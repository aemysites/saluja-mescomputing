/* eslint-disable no-new */
/* eslint-disable no-undef */

import { getMetadata } from '../../scripts/aem.js';

/**
 * Modifies the DOM as necessary to display the block.
 * @param {HTMLElement} block Default DOM structure for the block.
 */
export default function decorate(block) {
  const bwVideoplayerContainer = document.createElement('div');
  bwVideoplayerContainer.classList.add('beyondwords-video-container');

  const bwFlag = getMetadata('beyondwords');
  if (bwFlag && bwFlag === 'video') {
    block.innerHTML = '';
    block.append(bwVideoplayerContainer);
  }
}
