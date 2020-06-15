import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './lib/CLI.js',
    output: {
      file: './out/vortex.bundle.js',
      format: 'cjs'
    },
    plugins: [commonjs()]
  };