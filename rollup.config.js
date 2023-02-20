
const typescript=require("@rollup/plugin-typescript");
const  {nodeResolve} =require("@rollup/plugin-node-resolve");
const commonjs=require("@rollup/plugin-commonjs");
const path=require('path');
module.exports={
    input:"./src/index.ts",
    output:[
        {
            file:"./dist/index.cjs.js",
            format:"cjs"
        },
        {
            file:"./dist/index.esm.js",
            format:"es"
        }
    ],
    plugins:[
        typescript(),
        nodeResolve(),
        commonjs(),
    ]
}