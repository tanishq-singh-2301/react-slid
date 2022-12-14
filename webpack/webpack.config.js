const path = require("path");
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== "production";
const tailwindcss = require("tailwindcss");

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    // devtool: isDevelopment ? 'source-map' : false,
    devtool: false,

    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000,
        ignored: ['**/node_modules']
    },

    entry: path.resolve(__dirname, '../web/index.tsx'),

    output: {
        path: path.resolve(__dirname, '../build/web'),
        // sourceMapFilename: '[file].map',
        filename: `assets/js/[name].min.js`
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css'],
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript', ['@babel/preset-react', { development: isDevelopment }]],
                        plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean)
                    }
                }
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    isDevelopment ?
                        'style-loader' :
                        {
                            // save the css to external file
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: false
                            }
                        },
                    {
                        // becombine other css files into one
                        // https://www.npmjs.com/package/css-loader
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            importLoaders: 2, // 2 other loaders used first, postcss-loader and sass-loader
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        // process tailwind stuff
                        // https://webpack.js.org/loaders/postcss-loader/
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDevelopment,
                            postcssOptions: {
                                plugins: [
                                    tailwindcss('./web/tailwind.config.js'),
                                    require('autoprefixer')
                                    // add addtional postcss plugins here
                                    // easily find plugins at https://www.postcss.parts/
                                ]
                            }
                        }
                    },
                    {
                        // load sass files into css files
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    esModule: false
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/img/[name].[ext]',
                    // outputPath: "images",
                    esModule: false
                }
            },
            {
                test: /\.(ttf|eot|otf|woff)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]',
                    esModule: false
                }
            },
            {
                test: /\.(ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    esModule: false
                }
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            React: 'react'
        }),

        // build html file
        new HtmlWebPackPlugin({
            template: './web/public/index.html',
            filename: './index.html'
        }),

        isDevelopment && new ReactRefreshWebpackPlugin(),

        // https://webpack.js.org/plugins/mini-css-extract-plugin/
        // dump css into its own files
        new MiniCssExtractPlugin({
            filename: `assets/css/[name].min.css`
        }),

        // Bundle Analyzer, a visual view of what goes into each JS file.
        // https://www.npmjs.com/package/webpack-bundle-analyzer
        process.env.ANALYZE && new BundleAnalyzerPlugin()
    ].filter(Boolean),

    optimization: {
        minimize: !isDevelopment,
        minimizer: [
            // https://webpack.js.org/plugins/terser-webpack-plugin/
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the `compress` and `output`
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        inline: 2
                    },
                    mangle: {
                        // Find work around for Safari 10+
                        safari10: true
                    },
                    output: {
                        ecma: 5,
                        comments: false
                    }
                },

                // Use multi-process parallel running to improve the build speed
                parallel: true,

                extractComments: false
            }),

            // https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
            new CssMinimizerPlugin({
                // style do anything to the wordpress style.css file
                exclude: /style\.css$/,

                // Use multi-process parallel running to improve the build speed
                parallel: true,

                minimizerOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }]
                    // plugins: ['autoprefixer'],
                }
            })
        ]
    },

    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        port: 3000,
        host: '0.0.0.0',
        compress: true,
        allowedHosts: 'all',
        hot: true
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};