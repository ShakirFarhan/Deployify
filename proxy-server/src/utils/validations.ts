export const isAssetRequest = (path: string) => {
  const assetExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.json',
  ];
  return assetExtensions.some((ext) => path.endsWith(ext));
};
