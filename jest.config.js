module.exports = {
	collectCoverageFrom: ['index.js', 'options.js'],
	coverageThreshold: {
		global: {
			statements: 64, // Goal: 98,
			branches: 55, // Goal: 91,
			functions: 64, // Goal: 98,
			lines: 65, // Goal: 98,
		},
	},
	moduleNameMapper: {
		'.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
		'.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/internals/mocks/image.js',
	},
	setupFiles: ['<rootDir>/tests/env_init.js'],
	setupFilesAfterEnv: ['<rootDir>/tests/test-bundler.js'],
	testRegex: 'tests/.*\\.test\\.js$',
	snapshotSerializers: [],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
	testEnvironment: 'jsdom',
}
