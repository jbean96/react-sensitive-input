const path = require('path');

module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.mdx'],
	addons: ['@storybook/addon-essentials', '@storybook/preset-create-react-app'],
	// webpackFinal: async (config) => {
	// 	config.resolve.modules = [
	// 		path.resolve(__dirname, '..', 'src'),
	// 		path.resolve(__dirname, '..', 'node_modules'),
	// 	];

	// 	return config;
	// },
};
