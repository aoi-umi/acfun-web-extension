const commonjs = require("rollup-plugin-commonjs");
export default {
  // 核心选项
  input: 'dist/lib/index.js',     // 必须
  plugins: [
    commonjs(),
  ],
  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file: 'dist/index.js',    // 必须
    format: 'iife',  // 必须
  }
}