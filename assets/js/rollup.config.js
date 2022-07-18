import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from "@rollup/plugin-replace";

export default {
    input: 'anchor/main.js',
    output: {
        file: 'bundle.js',
        format: 'es'
    },
    plugins: [
        commonjs(),
        nodePolyfills(
            {
                include: ['buffer']
            }
        ),
        resolve({
            browser: true,
            preferBuiltins: false
        }),
        replace(
            {
                preventAssignment: false,
                values : {
                    'require("crypto")': 'require("crypto-browserify")'
                }
            }
        )
        ,
        typescript(
            {target: "es2019"}
        ),
        json()
    ]
};
