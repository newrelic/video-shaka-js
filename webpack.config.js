var path = require('path');
var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');

var pkg = require('./package.json');
var license =
  '@license ' +
  pkg.license +
  '\n' +
  pkg.name +
  ' ' +
  pkg.version +
  '\nCopyright New Relic <http://newrelic.com/>' +
  '\n@author ' +
  pkg.author;

module.exports = [
  {
    //umd
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist/umd'),
      filename: 'newrelic-video-shaka.min.js',
      library: 'ShakaTracker',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env']],
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: license,
        entryOnly: true,
      }),
    ],
  },
  // commonjs buid
  // No `library` name — `commonjs2` then publishes the entry's full export
  // namespace as `module.exports`, so consumers get `{ default, ShakaTracker,
  // VegaTracker }` directly. With a `library` name set, webpack would wrap
  // the namespace under `module.exports.<name>`, hiding the named exports.
  // The `__esModule: true` flag on the namespace makes `import ShakaTracker
  // from '...'` (default import) still resolve correctly via babel's
  // `_interopRequireDefault`.
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist/cjs'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: license,
        entryOnly: true,
      }),
    ],
  },
  // ES Module Build
  {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist/esm'),
      filename: 'index.js',
      library: {
        type: 'module', // ES Module format
      },
    },
    experiments: {
      outputModule: true, // Enable ES Module output
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults', modules: false }],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: license,
        entryOnly: true,
      }),
    ],
  },
  // ============ BROWSER ENTRY ============
  // The `resolve.alias` rewires `@newrelic/video-core` -> the core's
  // `/browser` subpath for THIS build only. Both `tracker.js` and
  // `vegaTracker.js` use the literal `@newrelic/video-core` import string;
  // the alias resolves it to the Browser-pipeline-only entry so the Vega
  // chain (connectedDeviceAgent.js et al.) is unreachable from the bundle.
  // CommonJS
  {
    entry: './src/entry-browser.js',
    output: {
      path: path.resolve(__dirname, './dist/cjs/browser'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      alias: {
        '@newrelic/video-core$': require.resolve('@newrelic/video-core/browser'),
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
      ],
    },
    optimization: { minimize: true, minimizer: [new TerserPlugin()] },
    plugins: [
      new webpack.BannerPlugin({ banner: license, entryOnly: true }),
    ],
  },
  // ESM
  {
    entry: './src/entry-browser.js',
    output: {
      path: path.resolve(__dirname, './dist/esm/browser'),
      filename: 'index.js',
      library: { type: 'module' },
    },
    resolve: {
      alias: {
        '@newrelic/video-core$': require.resolve('@newrelic/video-core/browser'),
      },
    },
    experiments: { outputModule: true },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults', modules: false }],
              ],
            },
          },
        },
      ],
    },
    optimization: { minimize: true, minimizer: [new TerserPlugin()] },
    plugins: [
      new webpack.BannerPlugin({ banner: license, entryOnly: true }),
    ],
  },
  // ============ VEGA ENTRY ============
  // Mirror of /browser, but the alias points at the core `/vega` subpath.
  // CommonJS
  {
    entry: './src/entry-vega.js',
    output: {
      path: path.resolve(__dirname, './dist/cjs/vega'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      alias: {
        '@newrelic/video-core$': require.resolve('@newrelic/video-core/vega'),
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        },
      ],
    },
    optimization: { minimize: true, minimizer: [new TerserPlugin()] },
    plugins: [
      new webpack.BannerPlugin({ banner: license, entryOnly: true }),
    ],
  },
  // ESM
  {
    entry: './src/entry-vega.js',
    output: {
      path: path.resolve(__dirname, './dist/esm/vega'),
      filename: 'index.js',
      library: { type: 'module' },
    },
    resolve: {
      alias: {
        '@newrelic/video-core$': require.resolve('@newrelic/video-core/vega'),
      },
    },
    experiments: { outputModule: true },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults', modules: false }],
              ],
            },
          },
        },
      ],
    },
    optimization: { minimize: true, minimizer: [new TerserPlugin()] },
    plugins: [
      new webpack.BannerPlugin({ banner: license, entryOnly: true }),
    ],
  },
];
