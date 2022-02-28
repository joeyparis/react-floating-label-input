import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import rollupJson from '@rollup/plugin-json'
import nodePolyFills from 'rollup-plugin-node-polyfills'
import { babel } from '@rollup/plugin-babel'

export default {
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
