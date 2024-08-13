import { nodeResolve } from "@rollup/plugin-node-resolve";
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: "./index.js",
    output: {
        file: "./bundle.js",
        format: "es"
    },
    plugins: [
        nodeResolve(),
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            plugins: ['@babel/plugin-transform-runtime']
        }),
        serve({}),
        livereload({
            // filter: (filename, cb) => cb(filename.endsWith('.js'))
        })
    ]
}