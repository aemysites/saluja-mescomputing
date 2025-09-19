import { buildBlock, decorateBlock, loadBlock } from '../../scripts/aem.js';

function buildAuthorPage() {
  const middleSection = document.querySelector('.middle-section');
  const authorPageBlock = buildBlock('author-profile', '');
  middleSection.appendChild(authorPageBlock);
  decorateBlock(authorPageBlock);

  return loadBlock(authorPageBlock);
}

function buildListingPage() {
  const middleSection = document.querySelector('.middle-section');
  const listingPageBlock = buildBlock('listing-page', '');
  const listingPageWrapper = document.createElement('div');
  listingPageWrapper.classList.add('profile-listing-page');
  listingPageWrapper.appendChild(listingPageBlock);
  middleSection.appendChild(listingPageWrapper);
  decorateBlock(listingPageBlock);

  return loadBlock(listingPageBlock);
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy() {
  buildAuthorPage();
  buildListingPage();
}
