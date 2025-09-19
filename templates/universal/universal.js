/**
 * Creates four sections (top, middle, right, bottom) and appends them to the main element.
 * Each section is a div with a class name corresponding to its position.
 * @param {HTMLElement} main The page's main element.
 * @returns {Object} An object containing the four created sections.
 */

function createContentSections(main) {
  const topAdContainer = document.createElement('div');
  topAdContainer.classList.add('top-ad-container');
  if (main.parentElement) {
    main.parentElement.insertBefore(topAdContainer, main);
  }

  const middleSection = document.createElement('div');
  middleSection.classList.add('middle-section', 'auto-section');
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'auto-section');
  const bottomSection = document.createElement('div');
  bottomSection.classList.add('bottom-section', 'auto-section');
  const curtain = document.createElement('div');
  curtain.classList.add('curtain', 'auto-section');
  const mobileAds = document.createElement('div');
  mobileAds.classList.add('mobile-ads', 'section');
  main.appendChild(middleSection);
  const hasSidebar = document.querySelector('meta[name="sidebar"]');
  if (hasSidebar) {
    if (hasSidebar.content !== 'off') {
      main.appendChild(rightSection);
    }
  }
  main.appendChild(bottomSection);
  main.appendChild(curtain);
  main.appendChild(mobileAds);
  return {
    topAdContainer,
    middleSection,
    rightSection,
    bottomSection,
    curtain,
    mobileAds,
  };
}

/**
 * Creates the general layout of the website, including things like
 * the top ad, right ad, bottom ad, etc.
 * @param {HTMLElement} main The page's main element.
 * @returns {Promise} Resolves when loading is complete.
 */
// eslint-disable-next-line import/prefer-default-export
export function loadEager(main) {
  main.classList.add('grid-layout');
  const hasSidebar = document.querySelector('meta[name="sidebar"]');

  if (hasSidebar) {
    if (hasSidebar.content === 'off') {
      main.classList.add('full-width');
    }
  }

  createContentSections(main);

  // move sections to middle section if they are not already in a section
  const template = document.querySelector('meta[name="template"][content="article"]');
  if (!template) {
    const middleSection = document.querySelector('.middle-section');
    [...main.querySelectorAll('div.section:not(.auto-section)')].forEach((section) => {
      section.style.display = 'block';
      middleSection.appendChild(section);
    });
  }
}
