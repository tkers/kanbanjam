import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'docs/main.js',
    format: 'umd',
  },
  plugins: [nodeResolve(), terser()],
}
