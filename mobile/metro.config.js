const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'wasm' so Metro processes .wasm files as static assets
config.resolver.assetExts.push('wasm');

module.exports = config;
