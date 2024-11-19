const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production', // 배포용으로 설정
    entry: './src/index.js', // 진입점 파일
    output: {
        filename: '[name].bundle.js',
        publicPath: '/',  // 이 부분을 설정
        path: path.resolve(__dirname, 'dist'),
        clean: true, // 기존 파일 제거
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 원본 HTML 파일의 경로
            filename: 'index.html', // 출력할 HTML 파일의 이름
        }),
        new Dotenv({
            path: path.resolve(__dirname, '../.env'), // .env 파일의 경로
            safe: true, // optional: .env.example 파일을 통해 안전한 환경 변수를 설정할 수 있습니다.
        }),
    ],
    optimization: {
        minimize: true, // 압축을 활성화합니다.
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true, // console.log() 호출을 제거합니다.
                },
                mangle: true, // 변수 이름을 난독화합니다.
            },
        })],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3001,
        proxy: [
            {
                context: ['/api'],
                target: process.env.DJANGO_AUTH_HOST || 'http://localhost:8000', // .env 파일에서 로드한 API 서버의 주소
                changeOrigin: true,
                logLevel: 'info'
            },
        ],
        historyApiFallback: {
            index: '/index.html',  // Add this line for SPA
        }, 
        client: {
            logging: 'info', // Enable debug logging for the client
        },
    },
    resolve: {
        extensions: ['.js'],
    },
};
