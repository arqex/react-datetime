module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-knobs",
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
};
