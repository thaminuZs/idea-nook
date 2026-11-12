const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

const previousEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware, metroServer) => {
    const baseMiddleware = previousEnhanceMiddleware
      ? previousEnhanceMiddleware(metroMiddleware, metroServer)
      : metroMiddleware;

    return (req, res, next) => {
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      return baseMiddleware(req, res, next);
    };
  },
};

module.exports = config;
