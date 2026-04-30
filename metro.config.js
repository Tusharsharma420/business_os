const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable package exports if it is causing resolution issues like import.meta
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
