import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.js", "**/*.jsx"], // Target JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 2021, // Use ES2021 features
      sourceType: "module", // ES Modules
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        process: "readonly",
        module: "readonly",
      },
    },
    plugins: {
      react,
      reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ doesn't need `React` in scope
      "react/jsx-no-target-blank": ["warn", { allowReferrer: true }], // Add `rel="noopener noreferrer"`
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];
