const webpack = require('webpack');

module.exports = function override(config, env) {
    console.log("config-overrides.js is being executed!");

    // Add polyfills for Node.js core modules
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "global": require.resolve("global/window") // Add global fallback
    };

    // Add aliases for specific modules
    config.resolve.alias = {
        ...config.resolve.alias,
        "process": "process/browser.js", // Keep this for direct imports
        "react-router": require.resolve("react-router"), // Explicitly resolve react-router
        "react-router-dom": require.resolve("react-router-dom"), // Explicitly resolve react-router-dom
    };

    // Add webpack plugins for process and Buffer
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process': JSON.stringify({
                env: {
                    NODE_ENV: process.env.NODE_ENV || 'development'
                }
            })
        })
    ]);

    return config;
}