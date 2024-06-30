import express from 'express';
import dotenv from 'dotenv';
import httpProxy from 'http-proxy';
import { isAssetRequest } from './utils/validations';
import { publishAnalytic } from './services/kafka';

dotenv.config();

const app = express();
const PORT = 8000;
const proxy = httpProxy.createProxy();

const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #444; }
    </style>
</head>
<body>
    <h1>Site Not Found</h1>
    <p>The requested site could not be found. Please check the URL and try again.</p>
</body>
</html>
`;

app.use((req, res) => {
  const host = req.headers.host;
  const subDomain = host ? host.split('.')[0] : null;

  if (!subDomain) {
    return res.status(400).send('Invalid subdomain');
  }

  const startTime = process.hrtime();

  res.on('finish', async () => {
    console.log(req.path);
    if (isAssetRequest(req.path)) return;
    const [seconds, nanoseconds] = process.hrtime(startTime);
    // Convert the duration to milliseconds
    const duration = seconds * 1000 + nanoseconds / 1e6;
    const analyticsData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      subdomain: subDomain,
      path: req.url,
      method: req.method,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      ip: req.ip,
      country: req.get('CF-IPCountry'),
      duration: duration.toFixed(2),
      contentLength: res.get('Content-Length'),
    };
    await publishAnalytic(analyticsData);
  });

  return proxy.web(req, res, {
    target: `${process.env.S3_BASE_URL}/${subDomain}`,
    changeOrigin: true,
  });
});
proxy.on('proxyReq', (proxy, req, res) => {
  if (req.url === '/') {
    proxy.path += 'index.html';
  }
});
proxy.on('proxyRes', (proxyRes, req, res) => {
  if (proxyRes.statusCode === 403 || proxyRes.statusCode === 404) {
    // For 403 or 404 errors, serve the fallback HTML
    proxyRes.destroy(); // End the original response

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(fallbackHtml),
    });
    res.end(fallbackHtml);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
