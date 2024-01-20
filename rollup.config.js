import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { glob, globSync } from "glob";
import cleanupPlugin from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";

//获取所有数据
const allTypes = globSync("./src/types/*.d.ts");
const DEST_PATH = "dist/types/";
const copyAllTargets = [
  {
    src: "LICENSE",
    dest: "dist",
  },
  ...allTypes.map((_) => ({
    src: _.replace(/\\/g, "/"),
    dest: DEST_PATH,
  })),
];
const copyConfig = {
  targets: copyAllTargets,
};

const plugins = [
  cleanupPlugin(),
  typescript(),
  //压缩打包代码
  // terser(),
  copy(copyConfig),
];

const config = [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "./dist/index.amd.js",
        format: "amd",
        exports: "named",
      },
      {
        file: "./dist/index.esm.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins,
  },
];
export default config;
