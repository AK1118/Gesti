
const typescript=require("@rollup/plugin-typescript");
const terser=require("@rollup/plugin-terser");
const cleanup=require("rollup-plugin-cleanup")
module.exports={
    input:"./src/index.ts",
    output:[
        {
            file:"./dist/index.amd.js",
            format:"amd",
            exports:"named"
        },
        {
            file:"./dist/index.esm.js",
            format:"es",
            exports:"named"
        },
    ],
    plugins:[
        typescript(),
        //压缩打包代码
        // terser(),
        cleanup(),
    ]
}