module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["prettier"],
  extends: ["prettier"],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": 2,
  },
};
