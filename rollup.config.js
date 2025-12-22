import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/core/index.ts',
  output: [
    {
      file: 'dist/uxqa.js',
      format: 'umd',
      name: 'UXQA',
      sourcemap: true
    },
    {
      file: 'dist/uxqa.min.js',
      format: 'umd',
      name: 'UXQA',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: 'dist/uxqa.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    })
  ]
};
