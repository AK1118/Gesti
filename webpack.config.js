import path,{dirname} from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename);


export default (env,{mode})=>{
  //If this mode is "development",you must be set entry to test path,and mode "production" never won't use.
  const entry=mode==='development'?"./src/test/index.ts":"./src/index.ts";
  return {
    entry,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
    },
    devtool: "source-map",
    devServer: {
      port: 1118,
    },
    module: {
      rules: [
        {
          test: /(\.d)?\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                logLevel: "warn",
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".d.ts", ".js", ".ts"],
      alias:{
        "@":path.resolve(__dirname,'src')
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
    ],
  };
}
