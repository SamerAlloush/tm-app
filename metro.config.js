// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add .cjs extension support
config.resolver.sourceExts.push('cjs');

// Disable package exports
config.resolver.unstable_enablePackageExports = false;

module.exports = config;