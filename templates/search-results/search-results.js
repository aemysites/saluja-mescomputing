import { moveToMiddleSection } from '../../scripts/shared.js';

// eslint-disable-next-line import/prefer-default-export
export function loadLazy(main) {
  const searchBlock = main.querySelector('.search-results-container');
  if (searchBlock) {
    moveToMiddleSection(main, searchBlock);
  }
}
