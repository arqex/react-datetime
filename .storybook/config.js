import { configure } from '@kadira/storybook';

function loadStories() {
  require('../stories/stories');
}

configure(loadStories, module);
