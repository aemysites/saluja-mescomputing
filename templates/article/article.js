import {
  moveToMiddleSection,
  buildSocialHeadingTop,
  buildAuthorCard,
  moveToBottomSection,
  buildSocialHeadingBottom,
} from '../../scripts/shared.js';
import { buildBlock, decorateBlock, getMetadata, loadBlock } from '../../scripts/aem.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';

const type = getMetadata('type');

function getDefaultSections(main) {
  const defaultSections = [...main.querySelectorAll('div.section:not(.auto-section)')];
  return defaultSections;
}

function showSectionBasedOnPage() {
  const usp = new URLSearchParams(window.location.search);
  const pageIndex = Number(usp.get('page') || 1);
  const sections = document.querySelectorAll('div.section:not(.auto-section)');
  sections.forEach((section, idx) => {
    section.style.display = idx === pageIndex - 1 ? 'block' : 'none';
  });
}

function buildBecomeAMember() {
  const becomeAmember = buildBlock('become-a-member', { elems: [] });
  const article = document.querySelector('article');
  if (article) {
    article.parentElement.insertBefore(becomeAmember, article);
    decorateBlock(becomeAmember);
    loadBlock(becomeAmember);
  }
}

function buildGatedArticles() {
  const gatedArticles = buildBlock('gated-articles', { elems: [] });
  const article = document.querySelector('article');
  if (article) {
    article.parentElement.insertBefore(gatedArticles, article.nextSibling);
    decorateBlock(gatedArticles);
    loadBlock(gatedArticles);
  }
}

function buildArticle(main) {
  const articleContainer = document.createElement('article');
  articleContainer.classList.add('article');
  const articleHead = document.createElement('div');
  articleHead.classList.add('article-head');
  articleContainer.appendChild(articleHead);

  const sections = getDefaultSections(main);
  if (articleContainer) {
    articleContainer.append(...sections);
  }

  showSectionBasedOnPage();

  const articleSections = articleContainer.querySelectorAll('div.section').length;
  const hero = articleContainer.querySelectorAll('.section.hero-container');
  const count = (type === 'profile' || hero) && articleSections > 2 ? articleSections - 2 : articleSections - 1;
  articleContainer.dataset.articleCount = count;

  window.addEventListener('popstate', showSectionBasedOnPage);

  const table = document.querySelector('.table-container');
  if (table) {
    articleContainer.appendChild(table);
  }

  const figcationAlt = document.querySelector('.fig-caption-container');
  if (figcationAlt) {
    articleContainer.appendChild(figcationAlt);
  }

  const embed = document.querySelector('.embed-container');
  if (embed) {
    articleContainer.appendChild(embed);
  }

  moveToMiddleSection(main, articleContainer);
}

function buildRelatedArticles(insertAfter) {
  const relatedArticles = buildBlock('related-topics', { elems: [] });
  if (insertAfter) {
    insertAfter.parentElement.insertBefore(relatedArticles, insertAfter.nextSibling);
    decorateBlock(relatedArticles);
    loadBlock(relatedArticles);
  }
}

function buildArticlePagination() {
  const articlePagination = buildBlock('article-pagination', { elems: [] });
  const article = document.querySelector('article');
  if (article && type !== 'content-hub') {
    article.parentElement.insertBefore(articlePagination, article.nextSibling);
    decorateBlock(articlePagination);
    loadBlock(articlePagination);
  }
}

function buildAlsoLike() {
  const alsoLike = buildBlock('you-may-also-like', { elems: [] });
  const article = document.querySelector('article');
  if (article && type !== 'content-hub') {
    article.parentElement.insertBefore(alsoLike, article.nextSibling.nextSibling);
    decorateBlock(alsoLike);
    loadBlock(alsoLike);
  }
}

function buildMoreOn(main) {
  const moreOn = buildBlock('more-on', { elems: [] });
  const alsoLike = document.querySelector('.you-may-also-like');

  if (alsoLike) {
    alsoLike.after(moreOn);
    decorateBlock(moreOn);
    loadBlock(moreOn);
    moveToBottomSection(main, moreOn);
  }
}

function assignClassToNextElement(startElement) {
  if (!startElement) {
    return;
  }
  // eslint-disable-next-line prefer-const
  let nextElement = startElement.nextElementSibling;
  if (nextElement && nextElement.tagName === 'H2') {
    nextElement.classList.add('sub-heading');
  }
}

function assignHeadings() {
  const articleHead = document.querySelector('.article-head');
  if (!articleHead) return;

  const h1 = articleHead.querySelector('h1');
  const h2 = articleHead.querySelector('h2');
  const p = articleHead.querySelector('p');
  if (h1) {
    h1.className = 'heading';
  }
  if (h2) {
    h2.className = 'sub-heading';
  }
  if (p) {
    p.className = 'article-summary';
  }
}

// create the article head
function moveToArticleHead() {
  const pictureEl = document.querySelector('p > picture');
  const articleHead = document.querySelector('.article-head');
  const pictureWithsibling = document.querySelector('.hero picture');
  const pictureSibling = pictureWithsibling?.nextElementSibling;
  if (pictureEl && articleHead && !pictureWithsibling && type !== 'content-hub') {
    let currentEl = pictureEl.parentElement.previousElementSibling;
    const elems = [];
    while (currentEl && !currentEl.className.includes('article-head')) {
      elems.unshift(currentEl);
      currentEl = currentEl.previousElementSibling;
    }
    elems.forEach((elem) => {
      articleHead.appendChild(elem);
    });

    // check if type is 'content-hub' and append the pictureEl
    if (type === 'content-hub') {
      articleHead.appendChild(pictureEl);
    }
  } else if (pictureWithsibling && pictureSibling?.classList.contains('heading')) {
    const heroBanner = pictureWithsibling?.parentElement?.parentElement?.parentElement?.parentElement;
    articleHead.appendChild(pictureSibling);
    articleHead.insertBefore(heroBanner, pictureSibling);
  } else if (type === 'content-hub' && !pictureWithsibling) {
    const h = document.querySelector('.heading');
    const socialHeading = document.querySelector('.social-heading');
    h?.parentElement.appendChild(socialHeading);
  } else {
    const heading = document.querySelector('.heading');
    const subheading = document.querySelector('.sub-heading');
    articleHead.appendChild(heading);

    if (subheading) {
      articleHead.appendChild(subheading);
    }
  }
}

// remove other elements with the same classname
function ensureUniqueClass(main, className) {
  const elements = main.querySelectorAll(`.${className}`);
  if (elements.length > 1) {
    elements.forEach((element, index) => {
      if (index > 0 && !element.classList.contains('fig-caption')) {
        element.remove(className);
      }
    });
  }
}

function addGatedArticles(article) {
  buildGatedArticles();

  const section = article.querySelector('.section:not(.hero-container)');
  const articleSection = article.querySelectorAll('.section:not(.hero-container) .default-content-wrapper');
  console.log('articleSection', articleSection);
  const isPicture =
    articleSection[0].children.length > 1
      ? 'false'
      : articleSection[0]?.children[0]?.children[0]?.nodeName === 'PICTURE';
  let startRemove;
  let articleContent;
  let showItems;
  let sectionAfterRemove;

  if (articleSection.length > 1 && isPicture === true) {
    startRemove = 2;
  } else {
    startRemove = 0;
  }

  // eslint-disable-next-line no-plusplus
  for (let j = section.children.length - 1; j > startRemove; j--) {
    section.children[j].remove();
  }

  if (articleSection[0].children.length > 1 && !isPicture) {
    // eslint-disable-next-line prefer-destructuring
    articleContent = articleSection[0];
    showItems = 2;
  } else if (articleSection[0].children.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    articleContent = articleSection[0];
    showItems = 4;
  } else {
    // eslint-disable-next-line prefer-destructuring
    articleContent = articleSection[1];
    showItems = 6;
  }
  const articleChildren = articleContent.children;
  
  // eslint-disable-next-line no-plusplus
  for (let i = articleChildren.length - 1; i > showItems; i--) {
    articleChildren[i].remove();
  }

  const articleSectionAfterRemove = article.querySelectorAll('.section .default-content-wrapper');
  if (articleSectionAfterRemove.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    sectionAfterRemove = article.querySelectorAll('.section .default-content-wrapper')[1];
  } else {
    // eslint-disable-next-line prefer-destructuring
    sectionAfterRemove = article.querySelectorAll('.section .default-content-wrapper')[0];
  }
  console.log('section: ', sectionAfterRemove);

  if (sectionAfterRemove.querySelector('p:last-child')) {
    sectionAfterRemove.querySelector('p:last-child').className = 'lock-article';
  } else if (sectionAfterRemove.lastChild) sectionAfterRemove.lastChild.className = 'lock-article';

  if (!sectionAfterRemove.querySelector('.lock-article')) {
    if (sectionAfterRemove.lastChild) {
        sectionAfterRemove.lastChild.className = 'lock-article';
    }
}
  const lock = sectionAfterRemove.querySelector('.lock-article');

  while (lock?.nextElementSibling) {
    const sibling = lock.nextElementSibling;
    sibling.parentNode.removeChild(sibling);
  }

  while (lock?.parentElement.nextElementSibling) {
    const sibling = lock.parentElement.nextElementSibling;
    sibling.parentNode.removeChild(sibling);
  }
}

function buildListingPage() {
  if (type === 'content-hub') {
    const middleSection = document.querySelector('.middle-section');
    const listingPageBlock = buildBlock('listing-page', '');
    middleSection.appendChild(listingPageBlock);
    decorateBlock(listingPageBlock);
    return loadBlock(listingPageBlock);
  }
  return null;
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy(main) {
  const articleDate = getMetadata('publisheddate');
  const articleType = getMetadata('type');
  buildArticle(main);
  if (shouldBeGated(articleDate, articleType)) {
    buildBecomeAMember();
  }

  buildArticlePagination();
  buildAlsoLike();
  buildMoreOn(main);
  const sections = getDefaultSections(main);
  const article = document.querySelector('article');

  // remove button-container class from p elements
  const buttonContainers = article.querySelectorAll('p.button-container');

  buttonContainers.forEach((el) => {
    el.classList.remove('button-container');
  });

  // remove button class from nested a elements
  const nestedButton = article.querySelectorAll('a.button');
  nestedButton.forEach((el) => {
    el.classList.remove('button');
  });

  const video = document.querySelector('.jw-player-container');
  if (video) {
    article.appendChild(video);
  }

  if (sections) {
    sections.forEach((section) => {
      const pagination = buildBlock('pagination', { elems: [] });
      section.append(pagination);
      decorateBlock(pagination);
      loadBlock(pagination);
    });
  }

  showSectionBasedOnPage();
  window.addEventListener('popstate', showSectionBasedOnPage);

  // add subheading class
  document.querySelectorAll('.section h1').forEach((heading) => {
    if (heading) {
      heading.className = 'heading';
      // TODO: sample gate
      // TODO: end sample gate
      assignClassToNextElement(heading);
    }
  });

  const articleHead = document.querySelector('.article-head');
  if (articleHead) {
    buildSocialHeadingTop(articleHead);
  }

  if (article && !shouldBeGated(articleDate, articleType) && type !== 'content-hub') {
    buildSocialHeadingBottom(article);
  }

  const socialHeading = document.querySelector('.social-heading-bottom');
  if (socialHeading && !shouldBeGated(articleDate, articleType) && type !== 'content-hub') {
    buildRelatedArticles(socialHeading);
  }

  ensureUniqueClass(main, 'heading');
  ensureUniqueClass(main, 'sub-heading');
  ensureUniqueClass(main, 'article-summary');

  buildAuthorCard(main);
  moveToArticleHead();
  assignHeadings();
  buildListingPage();
  const curtain = document.createElement('div');
  curtain.classList.add('curtain', 'section');

  function clearDuplicateHighlightsInArticle() {
    const extraHighlight = article.querySelectorAll('.highlights-wrapper');
    if (extraHighlight.length > 0) {
      extraHighlight.forEach((el) => {
        el.remove();
      });
    }
  }

  const highlights = document.querySelector('.highlights-wrapper');
  if (highlights) {
    moveToBottomSection(main, highlights);
    clearDuplicateHighlightsInArticle();
  }

  if (shouldBeGated(articleDate, articleType)) {
    addGatedArticles(article);
  }

  main.appendChild(curtain);

  const paragraphs = document.querySelectorAll('article .section:not(.hero-container) p');
  let index = 0;
  paragraphs.forEach((p) => {
    const picture = p.querySelector('picture');
    const strong = p.querySelector('strong');
    if (!picture && index < 1 && !p.textContent) {
      const sibling = p.previousSibling;
      const parent = p.parentElement;
      const summary = document.createElement('h4');
      summary.innerText = document?.querySelector('[property="og:description"]').content;
      const istwoh4 = sibling?.nodeName === 'H4' && sibling.textContent !== summary.textContent;
      const containDescription = sibling?.textContent.includes(summary.textContent.replaceAll('...', ''));

      if (sibling?.nodeName !== 'H4' && !strong && !containDescription && !p.textContent) {
        parent.insertBefore(summary, p);
      } else if ((sibling?.nodeName !== 'H4' || istwoh4) && !strong && !containDescription && !p.textContent) {
        parent.insertBefore(summary, sibling);
      }
      index += 1;
    }

    if (p.textContent === 'You may also like') {
      while (p.nextElementSibling) {
        const sibling = p.nextElementSibling;
        sibling.parentNode.removeChild(sibling);
      }

      p.remove();
    }
  });
}
