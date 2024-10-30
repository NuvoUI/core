module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-apply'),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default'
        })
    ]
};
