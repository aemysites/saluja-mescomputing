import { buildBlock, decorateBlock, loadBlock } from '../../scripts/aem.js';

function buildListingPage() {
  const middleSection = document.querySelector('.middle-section');

  if (window.location.pathname.includes('/tag/') || window.location.pathname.includes('/category/')) {
    const listingPageBlock = buildBlock('listing-page-dynamic', '');
    middleSection.appendChild(listingPageBlock);
    decorateBlock(listingPageBlock);
    return loadBlock(listingPageBlock);
  }

  const listingPageBlock = buildBlock('listing-page', '');
  middleSection.appendChild(listingPageBlock);
  decorateBlock(listingPageBlock);
  return loadBlock(listingPageBlock);
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy() {
  buildListingPage();
}
