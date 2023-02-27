
const typescript=require("@rollup/plugin-typescript");
module.exports={
    input:"./src/index.ts",
    output:[
        {
            file:"./dist/index.amd.js",
            format:"amd"
        },
        {
            file:"./dist/index.esm.js",
            format:"es"
        }
    ],
    plugins:[
        typescript(),
    ]
}