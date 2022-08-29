module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint'
	},
	"env": {
		"browser": true,
		"node": true
	},
	// check if imports actually resolve
	settings: {
		'import/resolver': {
			webpack: {
				config: 'build/webpack.base.conf.js'
			}
		}
	},
    "extends": "airbnb-base",
	"rules": {
		// override default options
		"indent": ["error", "tab"],
		"no-cond-assign": ["error", "always"],

		// disable now, but enable in the future
		"one-var": "off", // ["error", "never"]
		"comma-dangle": "off", // ["error", "never"]

		// disable
		"init-declarations": "off",
		"no-console": "off",
		"no-tabs": "off",
		"no-inline-comments": "off",
		"no-underscore-dangle": "off",
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	"globals": {
		"$": false,
	}
};
