import { configure } from "@storybook/react";
import { addParameters } from "@storybook/react";
import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
});

// automatically import all files ending in *.stories.js
configure(require.context("../src", true, /\.stories\.(js|ts|md)x?$/), module);
