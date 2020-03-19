module.exports = {
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8080,
        proxy: 'http://hatuserver:82'
        // proxy: 'http://localhost:18364'
    },

    productionSourceMap: false,
    publicPath: './',
    configureWebpack: {
        externals: {
            BMap: 'BMap'
        }
    }
};
