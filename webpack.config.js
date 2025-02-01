const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'node', // Since you're running in a Node.js environment
  entry: './src/server.ts', // The entry point to your application
  output: {
    filename: 'server.js', // Output file
    path: path.resolve(__dirname, 'dist'), // Build directory
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Ensure Webpack processes TypeScript files
        use: 'ts-loader', // Use ts-loader to compile TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/swagger-ui-dist/swagger-ui.css',
          to: 'swagger-ui.css',
        },
        {
          from: 'node_modules/swagger-ui-dist/swagger-ui-bundle.js',
          to: 'swagger-ui-bundle.js',
        },
        {
          from: 'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
          to: 'swagger-ui-standalone-preset.js',
        },
        {
          from: 'node_modules/swagger-ui-dist/favicon-16x16.png',
          to: 'favicon-16x16.png',
        },
        {
          from: 'node_modules/swagger-ui-dist/favicon-32x32.png',
          to: 'favicon-32x32.png',
        },
      ],
    }),
  ],
}
