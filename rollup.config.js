const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const rollupJson = require('@rollup/plugin-json')
const nodePolyFills = require('rollup-plugin-node-polyfills')
const { babel } = require('@rollup/plugin-babel')

module.exports = {
	input: 'index.js',
	output: {
		dir: 'dist',
		format: 'cjs',
		exports: 'auto',
	},
	external: ['react', 'react-dom'],
	plugins: [
		nodeResolve({
			skip: ['react', 'react-dom'],
		}),
		babel({ babelHelpers: 'bundled' }),
		commonjs(),
		nodePolyFills(),
		rollupJson(),
	],
}
