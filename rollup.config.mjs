import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupTypescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import terser from '@rollup/plugin-terser';
import versionInjector from 'rollup-plugin-version-injector';

import pkg from './package.json' assert { type: 'json' };

const folder = './dist/';

const config = (prod) => {
  return {
    input: 'src/index.ts',
    output: [
      {
        file: folder + pkg.main.replace('.js', `-dev.js`),
        format: 'iife',
        strict: false,
      },
      ...[
        prod && {
          file: folder + pkg.main,
          format: 'iife',
          strict: false,
        },
        prod && {
          file: folder + pkg.main.replace('.js', `-v${pkg.version}.js`),
          format: 'iife',
          strict: false,
        },
      ].filter((v) => v),
    ],
    plugins: [
      resolve(),
      commonjs(),
      rollupTypescript(),
      babel({
        exclude: 'node_modules/**',
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        presets: ['@babel/preset-env'],
      }),
      terser(),
      versionInjector(),
    ],
  };
};

export default (args) => {
  const prod = !!args.prod;
  return config(prod);
};
