module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    // "@storybook/addon-docs",
    // "@storybook/addon-controls"
    '@storybook/addon-a11y',
  ],
  "framework": "@storybook/react"
}
