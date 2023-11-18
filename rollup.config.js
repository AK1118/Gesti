import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import cleanupPlugin from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";

const copyConfig = {
  targets: [
    {
      src: "./src/types/index.d.ts",
      dest: "dist/types/",
    },
    {
      src: "./src/types/serialization.d.ts",
      dest: "dist/types/",
    },
    {
        src:"LICENSE",
        dest:"dist"
    }
  ],
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
