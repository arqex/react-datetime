import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";

import pkg from "./package.json";

const config = {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "date-fns": "dateFns"
      }
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "date-fns": "dateFns"
      }
    }
  ],
  external: ["react", "react-dom", "date-fns"],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    typescript(),
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(terser());
}

export default config;
