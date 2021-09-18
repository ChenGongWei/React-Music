const {
    override,
    addWebpackAlias,
    addPostcssPlugins
} = require('customize-cra')
const path = require('path')


module.exports = override(
    addWebpackAlias({
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/api': path.resolve(__dirname, 'src/api'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/layout': path.resolve(__dirname, 'src/layout'),
        '@/assets': path.resolve(__dirname, 'src/assets'),
        '@/style': path.resolve(__dirname, 'src/style'),
    }),
    addPostcssPlugins([
        require('postcss-px2rem-exclude')({
            remUnit: 37.5,
            exclude: /node_modules|pc/i,
        }),
    ])
)
