module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [ 'plugin:vue/essential', '@vue/airbnb' ],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'linebreak-style': [ 'off', 'windows' ],
		'no-param-reassign': [ 'error', { props: false } ],
		'arrow-parens': [ 'error', 'always' ],
		'operator-linebreak': [ 'off' ],
		'import/extensions': [ 'off' ],
		'object-curly-newline': [ 'off' ],
		'global-require': [ 'off' ],
		'arrow-parens': [ 'off' ],
		'import/prefer-default-export': [ 'off' ],
		'no-unused-expressions': [ 'off' ],
		'guard-for-in': [ 'off' ],
		'no-restricted-syntax': [ 'off' ]
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
