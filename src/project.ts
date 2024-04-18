import { makeProject } from '@motion-canvas/core';

import example from './scenes/example?scene';
import main from './scenes/main?scene';
import test_slide from './scenes/test_slide?scene';

export default makeProject({
  scenes: [test_slide],
});
