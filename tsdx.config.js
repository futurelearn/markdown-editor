const replace = require('@rollup/plugin-replace');
const postcss = require('rollup-plugin-postcss');
const postcssImport = require('postcss-import');

module.exports = {
  rollup(config, options) {
    config.plugins = config.plugins.map(plugin =>
      plugin.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(options.env),
            preventAssignment: true,
          })
        : plugin
    );

    config.plugins.push(
      postcss({
        plugins: [postcssImport],
        extract: true,
      })
    );

    return config;
  },
};
