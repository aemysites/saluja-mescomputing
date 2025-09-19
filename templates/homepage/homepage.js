import { buildBlock, loadBlock, decorateBlock } from '../../scripts/aem.js';
import { getTheTheme } from '../../scripts/shared.js';

/**
 * Creates three sections (top, conten, bottom) and appends them to the main element.
 * Each section is a div with a class name corresponding to its position.
 * @param {HTMLElement} main The page's main element.
 * @returns {Object} An object containing the four created sections.
 */
function createContentSections(main) {
  const topSection = document.createElement('div');
  topSection.classList.add('top-section', 'section');
  const contentSection = document.createElement('div');
  contentSection.classList.add('content-section', 'section');
  main.appendChild(topSection);
  main.appendChild(contentSection);
  return {
    topSection,
    contentSection,
  };
}

/** Moves a block to the top section of the page
 * @param main
 * @param block
 */
function moveToTopSection(main, block) {
  const topSection = main.querySelector('.top-section');
  if (topSection && block) {
    topSection.appendChild(block);
  }
}

/** Moves a block to the content section of the page
 * @param main
 * @param block
 */
function moveToContentSection(main, block) {
  const contentSection = main.querySelector('.content-section');
  if (contentSection && block) {
    contentSection.append(block);
  }
}

/*
 * Builds and loads article cards block
 * @param {Element} main The container element
 */
function buildArticleCardsBlock(main) {
  const articleCardsContainer = document.createElement('div');
  articleCardsContainer.classList.add('article-cards-container');
  const articleCardsWrapper = document.createElement('div');
  articleCardsWrapper.classList.add('article-cards-wrapper');
  const articleCardsBlock = buildBlock('article-cards', '');
  articleCardsWrapper.appendChild(articleCardsBlock);

  articleCardsContainer.appendChild(articleCardsWrapper);
  main.appendChild(articleCardsContainer);

  decorateBlock(articleCardsBlock);
  return loadBlock(articleCardsBlock);
}

function buildUpcomingEventsBlock(main) {
  const upcomingEventsContainer = document.createElement('div');
  upcomingEventsContainer.classList.add('upcoming-events-container');
  const upComingEventsWrapper = document.createElement('div');
  upComingEventsWrapper.classList.add('upcoming-events-wrapper');
  const upcomingEventsBlock = buildBlock('upcoming-events', '');
  upComingEventsWrapper.appendChild(upcomingEventsBlock);
  upcomingEventsContainer.appendChild(upComingEventsWrapper);
  main.appendChild(upcomingEventsContainer);

  decorateBlock(upcomingEventsBlock);
  moveToContentSection(main, upcomingEventsContainer);
  return loadBlock(upcomingEventsBlock);
}

function buildMostReadBlock(main) {
  const mostReadContainer = document.createElement('div');
  mostReadContainer.classList.add('most-read-container');
  const mostReadWrapper = document.createElement('div');
  mostReadWrapper.classList.add('most-read-wrapper');
  const mostReadBlock = buildBlock('most-read', '');
  mostReadWrapper.appendChild(mostReadBlock);
  mostReadContainer.appendChild(mostReadWrapper);
  main.appendChild(mostReadContainer);

  decorateBlock(mostReadBlock);
  moveToContentSection(main, mostReadContainer);
  return loadBlock(mostReadBlock);
}

function buildArticleCardsSection(main) {
  buildArticleCardsBlock(main);

  const container = document.createElement('div');
  container.classList.add('article-card-ad-container');
  if (container) {
    const articleCards = document.querySelector('.article-cards-container');
    const sideAd = document.createElement('div');
    sideAd.classList.add('right-section');
    container.append(articleCards, sideAd);
    moveToContentSection(main, container);
  }
}

// function buildTopStories(main) {
//   const topStories = document.querySelector('.top-stories-wrapper');
//   if (topStories) {
//     moveToContentSection(main, topStories);
//   }
// }

function buildTopStories(main, topStoriesBlock) {
  if (topStoriesBlock) {
    moveToContentSection(main, topStoriesBlock);
  }
}

function buildCommonSponsoredVariation(main, theme, commons) {
  if (theme === 'crn-de' || theme === 'computing-de' || theme === 'channelweb-co-uk') {
    const csContainer = document.createElement('div');
    csContainer.classList.add('common-preselected-content-ad-container');
    if (csContainer) {
      const sidebarAd = document.createElement('div');
      sidebarAd.classList.add('right-cs-section', 'right-section');
      csContainer.append(commons[1], commons[2], sidebarAd);
      if (commons[1] || commons[2]) {
        moveToContentSection(main, csContainer);
      }
    }

    if (commons[3]) {
      moveToContentSection(main, commons[3]);
    }
  }
}

function buildWhitepapers(main) {
  const whitepapers = document.querySelector('.whitepapers-wrapper');
  if (whitepapers) {
    moveToContentSection(main, whitepapers);
  }
}

function buildTrendlines(main) {
  const trendlines = document.querySelector('.trendlines-wrapper');
  if (trendlines) {
    moveToContentSection(main, trendlines);
  }
}

function buildCarousel(main) {
  const carousel = document.querySelector('.carousel-wrapper');
  if (carousel) {
    moveToContentSection(main, carousel);
  }
}

function buildRankedArticles(main) {
  const rankedAdContainer = document.createElement('div');
  rankedAdContainer.classList.add('ranked-articles-ad-container');
  if (rankedAdContainer) {
    const rankedArticles = document.querySelector('.ranked-articles-wrapper');
    const sideAd = document.createElement('div');
    sideAd.classList.add('ranked-right-section');
    rankedAdContainer.append(rankedArticles, sideAd);
    moveToContentSection(main, rankedAdContainer);
  }

  const rankedArticles = document.querySelector('.ranked-articles-wrapper');
  if (rankedArticles) {
    moveToContentSection(main, rankedArticles);
  }

  const rankedContainer = document.createElement('div');
  rankedContainer.classList.add('ranked-articles-ad-container');
  if (rankedContainer) {
    const rankedWrapper = document.querySelector('.ranked-articles-wrapper');
    const sideAd = document.createElement('div');
    sideAd.classList.add('right-ranked-section');
    rankedContainer.append(rankedWrapper, sideAd);
    moveToContentSection(main, rankedContainer);
  }
}

function buildJoinComputing(main) {
  const joinComputing = document.querySelector('.join-computing-wrapper');
  if (joinComputing) {
    moveToContentSection(main, joinComputing);
  }
}

function buildCommonSponsored(main, commons) {
  if (commons[0]) {
    moveToContentSection(main, commons[0]);
  }
}

function buildBottomAd(main) {
  const bottomAdContainer = document.createElement('div');
  bottomAdContainer.classList.add('bottom-ad-container');
  const bottomAd = document.createElement('div');
  bottomAd.classList.add('bottom-section');
  if (bottomAdContainer) {
    bottomAdContainer.appendChild(bottomAd);
    moveToContentSection(main, bottomAdContainer);
  }
}

function buildHomepageForMescomputing(main, commons) {
  buildCommonSponsored(main, commons);
  buildMostReadBlock(main);
  buildUpcomingEventsBlock(main);
  buildBottomAd(main);
  buildTrendlines(main);
  buildCarousel(main);
  buildRankedArticles(main);
}

function buildHomepageForCRNAsia(main, commons) {
  buildCommonSponsored(main, commons);
  buildMostReadBlock(main);
  buildUpcomingEventsBlock(main);
  buildBottomAd(main);
  buildTrendlines(main);
  buildCarousel(main);
  buildRankedArticles(main);
}

function buildHomepageForCRNAustralia(main, commons) {
  buildCommonSponsored(main, commons);
  buildMostReadBlock(main);
  buildBottomAd(main);
  buildTrendlines(main);
  buildCarousel(main);
  buildRankedArticles(main)
}

function buildHomepageForComputing(main, commons) {
  buildCommonSponsored(main, commons);
  buildUpcomingEventsBlock(main);
  buildBottomAd(main);
  buildWhitepapers(main);
  buildTrendlines(main);
  buildCarousel(main);
  buildRankedArticles(main);

  if (commons[1]) {
    moveToContentSection(main, commons[1]);
  }

  buildMostReadBlock(main);
  buildJoinComputing(main);
}

function buildHomepageForCrnDe(main, commons, topStoriesBlocks, theme) {
  buildCommonSponsored(main, commons);
  buildUpcomingEventsBlock(main);
  buildCarousel(main);
  buildBottomAd(main);
  buildCommonSponsoredVariation(main, theme, commons);
  buildTopStories(main, topStoriesBlocks[1]);
  buildCarousel(main);
  buildMostReadBlock(main);
  buildJoinComputing(main);
}

function buildHomepageForChannelweb(main, commons, topStoriesBlocks, theme) {
  buildCommonSponsored(main, commons);
  buildUpcomingEventsBlock(main);
  buildBottomAd(main);
  buildCarousel(main);
  buildCommonSponsoredVariation(main, theme, commons);
  buildTopStories(main, topStoriesBlocks[1]);
  buildMostReadBlock(main);
  buildJoinComputing(main);
}

export function loadEager(main) {
  createContentSections(main);
}

export function loadLazy(main) {
  const theme = getTheTheme();
  const commons = document.querySelectorAll('.common-preselected-articles-wrapper');
  const topStoriesBlocks = document.querySelectorAll('.top-stories-wrapper');

  const hotTopics = document.querySelector('.hot-topics-wrapper');
  if (hotTopics) {
    moveToTopSection(main, hotTopics);
  }

  const curtainAdContainer = document.createElement('div');
  curtainAdContainer.classList.add('curtain');
  main.appendChild(curtainAdContainer);

  const bottomBannerAdContainer = document.createElement('div');
  bottomBannerAdContainer.classList.add('bottom-banner-ad');
  main.appendChild(bottomBannerAdContainer);

  const mobileAdContainer = document.createElement('div');
  mobileAdContainer.classList.add('mobile-ads');
  main.appendChild(mobileAdContainer);

  const topAdContainer = document.createElement('div');
  topAdContainer.classList.add('top-ad-container');
  if (topAdContainer) {
    moveToTopSection(main, topAdContainer);
  }

  buildTopStories(main, topStoriesBlocks[0]);

  buildArticleCardsSection(main);

  if (theme === 'mescomputing-com') {
    buildHomepageForMescomputing(main, commons);
  }

  if (theme === 'computing-co-uk') {
    buildHomepageForComputing(main, commons);
  }

  if (theme === 'crn-de') {
    buildHomepageForCrnDe(main, commons, topStoriesBlocks, theme);
  }

  if (theme === 'computing-de') {
    buildHomepageForCrnDe(main, commons, topStoriesBlocks, theme);
  }

  if (theme === 'channelweb-co-uk') {
    buildHomepageForChannelweb(main, commons, topStoriesBlocks, theme);
  }

  if (theme === 'crn-asia') {
    buildHomepageForCRNAsia(main, commons, topStoriesBlocks, theme);
  }

  if (theme === 'crn-australia') {
    buildHomepageForCRNAustralia(main, commons, topStoriesBlocks, theme);
  }
  
  const sectionDiv = main.querySelector('div.section');
  if (sectionDiv) {
    sectionDiv.remove();
  }
}
