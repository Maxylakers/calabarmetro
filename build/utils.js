const path = require('path');
const config = require('./config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageConfig = require('../package.json');
const notifier = require('node-notifier');

exports.assetsPath = (_path) => {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory;

	return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = (options) => {
	options = options || {}; // eslint-disable-line

	const cssLoader = {
		loader: 'css-loader',
		options: {
			sourceMap: options.sourceMap,
		},
	};

	const postcssLoader = {
		loader: 'postcss-loader',
		options: {
			sourceMap: options.sourceMap,
		},
	};

	// generate loader string to be used with extract text plugin
	function generateLoaders(loader, loaderOptions) {
		const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

		if (loader) {
			loaders.push({
				loader: `${loader}-loader`,
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap,
				}),
			});
		}

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: loaders,
				fallback: 'style-loader',
			});
		}
		return ['style-loader'].concat(loaders);
	}

	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus'),
	};
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = (options) => {
	const output = [];
	const loaders = exports.cssLoaders(options);

	Object.keys(loaders).forEach((extension) => {
		if (loaders[extension]) {
			const loader = loaders[extension];
			output.push({
				test: new RegExp(`\\.${extension}$`),
				use: loader,
			});
		}
	});

	return output;
};

exports.createNotifierCallback = () => (severity, errors) => {
	if (severity !== 'error') return;

	const error = errors[0];
	const filename = error.file && error.file.split('!').pop();

	notifier.notify({
		title: packageConfig.name,
		message: `${severity}: ${error.name}`,
		subtitle: filename || '',
		icon: path.join(__dirname, 'logo.png'),
	});
};
