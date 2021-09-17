const {
    override,
    addWebpackAlias,
    addPostcssPlugins
} = require('customize-cra')
const path = require('path')


module.exports = override(
    addWebpackAlias({
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/components': path.resolve(__dirname, 'src/components'),
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
