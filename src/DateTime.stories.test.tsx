import * as React from "react";
import { render } from "@testing-library/react";

import * as stories from "./DateTime.stories";

test.each(
  Object.keys(stories).filter((name) => typeof stories[name] === "function")
)("should render %s story", (story) => {
  const StoryComponent = stories[story];
  render(<StoryComponent />);
});
