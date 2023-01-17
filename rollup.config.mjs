import pkg from './package.json' assert { type: 'json' };
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    typescript({ exclude: [ '**/*.test.ts' ] }),
  ]
};
