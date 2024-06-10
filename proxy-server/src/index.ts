import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import httpProxy from 'http-proxy';
const app = express();
const PORT = 8000;
const proxy = httpProxy.createProxy();
app.use((req, res) => {
  const host = req.hostname;
  const subDomain = host.split('.')[0];
  if (!subDomain) {
    return res.status(400).send('Invalid subdomain');
  }
  return proxy.web(req, res, {
    target: `${process.env.S3_BASE_URL}/${subDomain}`, // forwards the request
    changeOrigin: true, // modifies the host header
  });
});
proxy.on('proxyReq', (proxy, req, res) => {
  if (req.url === '/') {
    proxy.path += 'index.html';
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
