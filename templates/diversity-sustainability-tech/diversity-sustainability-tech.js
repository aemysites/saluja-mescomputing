function buildArticleCardsSection(main) {
  const articlecards = main.querySelector('.article-cards-wrapper');
  const middleSection = main.querySelector('.middle-section .section');
  const featuredContent = main.querySelector('.featured-content-wrapper');

  const container = document.createElement('div');
  container.classList.add('article-card-ad-container');
  container.prepend(articlecards);
  if (container) {
    const sideAd = document.createElement('div');
    sideAd.classList.add('right-section');
    container.append(sideAd);
    middleSection.insertBefore(container, featuredContent);
  }
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy(main) {
  buildArticleCardsSection(main);
}
