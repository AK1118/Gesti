const path=require("path");
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');

module.exports={
    entry:"./src/index.ts",
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"boundle.js",
    },
    devtool:"source-map",
    devServer:{
        port:1118,
    },
    module:{
        rules:[
            {
                test:/(\.d)?\.ts$/,
                use:[
                    {
                        loader:'ts-loader',
                        options: {
                            logLevel: 'warn'
                        }
                    }
                ],
                exclude:/node_modules/,
            }
        ],
    },
    resolve:{
        extensions:['.d.ts','.js','.ts'],
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            {
              template:'index.html'
            }
        )
    ]
};