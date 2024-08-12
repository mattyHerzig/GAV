import { nodeResolve } from "@rollup/plugin-node-resolve";
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: "./editor.mjs",
  output: {
    file: "./editor.bundle.js",
    format: "iife"
  },
  plugins: [
    nodeResolve(),
    babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        plugins: ['@babel/plugin-transform-runtime']
    }),
    serve({
        openPage: '/index.html',
        open: true,
        contentBase: '',
        host: 'localhost',
        port: 3000
    }),
    livereload({})
  ]
}