import nextPlugin from "eslint-config-next";

const eslintConfig = [
  ...nextPlugin,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "convex/_generated/**",
    ],
  },
];

export default eslintConfig;
