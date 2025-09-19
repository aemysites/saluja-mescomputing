/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import {
  all,
  estimateTime,
  extractElementsFromString,
  formatingDate,
  getTheTheme,
  formatToISO8601,
} from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

function createArticleImageElement(article) {
  const articleImage = document.createElement('div');
  articleImage.className = 'common-preselected-article-image';

  const imageLink = document.createElement('a');
  imageLink.href = article.path;
  imageLink.setAttribute('aria-label', `Read more about: ${article.title}`);

  const imageElement = document.createElement('img');
  imageElement.src = article.image;
  imageElement.alt = article.title;
  imageElement.loading = 'lazy';

  imageLink.appendChild(createOptimizedPicture(imageElement.src, article.title));
  articleImage.appendChild(imageLink);

  return articleImage;
}

function createArticleTitleElement(article) {
  const articleTitle = document.createElement('div');
  const isLock = shouldBeGated(article.publisheddate);
  articleTitle.className = `common-preselected-article-title ${isLock ? 'lock' : ''}`;
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  articleLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  articleLink.textContent = article.title;
  articleTitle.appendChild(articleLink);
  return articleTitle;
}

function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'common-preselected-article-date';
  publishedDate.innerHTML = `
      <img class="article-clock" src="/icons/clock.svg" alt="Clock icon"/>
    ${formatingDate(formatToISO8601(date))}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

function createArticleCategory(article) {
  const articleCategory = document.createElement('div');
  articleCategory.className = 'common-preselected-article-category';
  const firstCategory = extractElementsFromString(article.category)[0];
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${createCategorySlug(firstCategory)}`;
  articleCategoryLink.setAttribute('aria-label', `Read more stories on '${firstCategory}`);
  articleCategoryLink.textContent = firstCategory;
  articleCategory.appendChild(articleCategoryLink);
  return articleCategory;
}

let hasExtraSubtitleAndDate;

function setExtraSubtitleAndDate(block) {
  hasExtraSubtitleAndDate = block.classList.contains('extra-subtitle-date');
}

function generateCard(article, articlesBlock) {
  const articleCard = document.createElement('div');
  articleCard.className = 'common-preselected-article';
  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'common-preselected-article-context-wrapper';
  if (article.image !== '0' && article.image !== '') {
    contextWrapper.appendChild(createArticleImageElement(article));
  }
  if (hasExtraSubtitleAndDate) {
    contextWrapper.appendChild(createArticleCategory(article));
  }
  contextWrapper.appendChild(createArticleTitleElement(article));
  if (hasExtraSubtitleAndDate) {
    contextWrapper.appendChild(createPublishedDate(article.publisheddate, article.wordcount));
  }
  articleCard.appendChild(contextWrapper);
  articlesBlock.appendChild(articleCard);
}

function getSponsoredResourcesPaths(block) {
  const arrayCollection = block.querySelector('div div ul').getElementsByTagName('li');
  const paths = [];
  for (const item of arrayCollection) {
    const path = new URL(item.querySelector('a').title);
    paths.push(path.pathname);
  }
  return paths;
}

function getLinksPaths(block) {
  const arrayCollection = block.querySelector('div div ul').getElementsByTagName('li');
  const paths = [];
  for (const item of arrayCollection) {
    const path = new URL(item.querySelector('a').title);
    paths.push(path.pathname);
  }
  return paths;
}

function generateCardsByURLs(allArticles, paths, block) {
  const articlesByPath = allArticles.filter((a) =>
    paths.includes(new URL(a.path, window.location.origin).pathname)
  );
  articlesByPath.forEach((article) => generateCard(article, block));
}

async function fetchAllArticlesFromTagSheet() {
  const response = await fetch('/article-query-index.json?limit=10000'); 
  const json = await response.json();
  return all(json.data);
}

async function generateCardsByTags(tagList, allArticles, articlesBlock) {
  let itemsCount = 0;
  for (const article of allArticles) {
    const rawTags = article.tag || article.Tag || '';
    const rawCategories = article.category || article.Category || '';
    const listOfTags = rawTags.toLowerCase().split(',');
    const listOfCategories = rawCategories.toLowerCase().split(',');
    let sameTag = false;
    
    // Check tags using the exact same logic as listing-page-dynamic.js
    for (const tag of listOfTags) {
      let t;
      if (tag.startsWith(' ')) {
        t = tag.replace(' ', '');
      } else {
        t = tag;
      }
      
      // Use our createCategorySlug function for consistent tag matching
      const tagSlug = createCategorySlug(t);
      
      // Check against all input tags
      for (const inputTag of tagList) {
        const inputTagSlug = createCategorySlug(inputTag.toLowerCase());
        if (tagSlug === inputTagSlug) {
          sameTag = true;
          break;
        }
      }
      
      if (sameTag) break;
    }
    
    // Check categories if no tag match found
    if (!sameTag) {
      for (const category of listOfCategories) {
        let c;
        if (category.startsWith(' ')) {
          c = category.replace(' ', '');
        } else {
          c = category;
        }
        
        // Use our createCategorySlug function for consistent category matching
        const categorySlug = createCategorySlug(c);
        
        // Check against all input tags
        for (const inputTag of tagList) {
          const inputTagSlug = createCategorySlug(inputTag.toLowerCase());
          if (categorySlug === inputTagSlug) {
            sameTag = true;
            break;
          }
        }
        
        if (sameTag) break;
      }
    }
    
    if (sameTag) {
      generateCard(article, articlesBlock);
      itemsCount += 1;
    }
    if (itemsCount >= 5) break;
  }
  if (itemsCount < 5) {
    for (const article of allArticles) {
      if (!articlesBlock.innerHTML.includes(article.title)) {
        generateCard(article, articlesBlock);
        itemsCount += 1;
        if (itemsCount >= 5) break;
      }
    }
  }
}

function checkSponsoredResource(block) {
  return block.classList.contains('preselected-resources');
}

function checkLinks(block) {
  return block.classList.contains('links-attached');
}

async function fetchArticles(isSponsoredResource, isLinks, sponsoredResourcesPathsArray, articlesBlock, tagList = []) {
  try {
    const articles = await fetchAllArticlesFromTagSheet();

    // normalize + sort by published date (most recent first)
    articles.sort(
      (a, b) =>
        new Date(formatToISO8601(b.publisheddate)) -
        new Date(formatToISO8601(a.publisheddate)),
    );

    if (isSponsoredResource || isLinks) {
      generateCardsByURLs(articles, sponsoredResourcesPathsArray, articlesBlock);
    } else if (tagList.length > 0) {
      await generateCardsByTags(tagList, articles, articlesBlock);
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

function createHeadElements(node) {
  const ENABLE_VIEW_ALL = true;
  if (!ENABLE_VIEW_ALL) return;

  const viewBtnText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Alles ansehen' : 'View All';
  const documentFragment = render(`
    <p></p>
    <p class="button-container">
        <a href="" title="${viewBtnText}" aria-label="${viewBtnText}" class="button">
            ${viewBtnText}
        </a>
    </p>
  `);
  node.after(documentFragment);
}

function setViewAllArticlesHref(isSponsoredResources, block, categoryName, tagList = []) {
  const anchor = block.querySelector('.button-container a');
  if (!anchor) return;

  if (isSponsoredResources) {
    anchor.setAttribute('href', '/type/sponsored');
    return;
  }

  if (typeof categoryName === 'string' && categoryName.trim()) {
    const slug = createCategorySlug(categoryName.trim());
    anchor.setAttribute('href', `/category/${slug}`);
    return;
  }

  if (Array.isArray(tagList) && tagList.length > 0 && typeof tagList[0] === 'string') {
    const tagSlug = createCategorySlug(tagList[0].trim());
    anchor.setAttribute('href', `/tag/${tagSlug}`);
    return;
  }

  // fallback if nothing is available
  anchor.setAttribute('href', '#');
}

function addParagraphBeforeContent() {
  const sponsoredParagraph = document.createElement('p');
  sponsoredParagraph.className = 'sponsor-content-title';
  sponsoredParagraph.innerText = 'SPONSORED CONTENT';
  document
    .querySelector('.common-preselected-articles-wrapper:has(.preselected-resources)')
    .insertAdjacentElement('afterbegin', sponsoredParagraph);
}

export default async function decorate(block) {
  const articlesList = document.createElement('div');
  articlesList.className = 'common-preselected-article-list';
  const cloneArticleList = articlesList.cloneNode(true);
  block.appendChild(cloneArticleList);
  articlesList.remove();

  const articlesBlock = block.querySelector('.common-preselected-article-list');
  setExtraSubtitleAndDate(block);
  const isSponsoredResources = checkSponsoredResource(block);
  const isLinks = checkLinks(block);
  let tagList = [];
  let sponsoredResourcesPathsArray;

  if (isSponsoredResources) {
    sponsoredResourcesPathsArray = getSponsoredResourcesPaths(block);
    addParagraphBeforeContent();
  } else if (isLinks) {
    sponsoredResourcesPathsArray = getLinksPaths(block);
  }

  const allParagraphs = block.querySelectorAll('p');
  if (allParagraphs.length > 1 && allParagraphs[1].innerText) {
    tagList = allParagraphs[1].innerText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (allParagraphs.length > 1) allParagraphs[1].style.display = 'none';
  }

  createHeadElements(block.querySelectorAll('p')[0]);
  setViewAllArticlesHref(isSponsoredResources, block, '', tagList);
  await fetchArticles(
    isSponsoredResources,
    isLinks,
    sponsoredResourcesPathsArray,
    articlesBlock,
    tagList
  );

  if (getTheTheme() === 'crn-de' && block.className === 'common-preselected-articles block') {
    block.classList.add('simple-common-preselected');
  }
}
