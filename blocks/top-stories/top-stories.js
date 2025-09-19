/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
import ffetch from '../../scripts/ffetch.js';
import {
  estimateTime,
  extractElementsFromString,
  formatingDate,
  getTheTheme,
  formatToISO8601,
} from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Creates an image element for the article with a corresponding link
 * @param {object} article The article object containing the image URL
 * @param {number} index The index of the article
 * @returns {HTMLElement} The image element with a link
 */
function createArticleImage(article, index) {
  const articleImage = document.createElement('div');
  articleImage.className = 'top-stories-img-link';

  const imageLink = document.createElement('a');
  imageLink.href = article.path;
  imageLink.setAttribute('aria-label', `Read more about: ${article.title}`);

  if (article.image !== '0') {
    const image = document.createElement('img');
    image.src = article.image;
    image.alt = article.title;

    imageLink.append(createOptimizedPicture(image.src, article.title));

    if (index === 0) {
      imageLink.querySelector('img').removeAttribute('loading');
    }
  }

  articleImage.appendChild(imageLink);
  return articleImage;
}

/**
 * Creates a description element for the article with a corresponding link
 * @param {object} article The article object
 * @returns {HTMLElement} The description element with a link
 */
function createArticleDescription(article) {
  const articleDescription = document.createElement('div');
  articleDescription.className = 'top-stories-description';
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  articleLink.textContent = article.description;
  articleLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  articleDescription.appendChild(articleLink);
  return articleDescription;
}

/**
 * Creates a title element for the article with a corresponding link.
 * Uses the (already normalized) publish date for gating.
 * (This follows version 2’s gating so that the author section is rendered.)
 * @param {object} article The article object
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitle(article) {
  const articleTitle = document.createElement('div');
  // Use the normalized publisheddate (set via all()) for gating.
  const isLock = shouldBeGated(article.publisheddate);
  articleTitle.className = `top-stories-title ${isLock ? 'lock' : ''}`;
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  articleLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  articleLink.textContent = article.title;
  articleTitle.appendChild(articleLink);
  return articleTitle;
}

/**
 * Creates an author element for the article with a corresponding link.
 * This updated version fixes the issue by comparing names in a case‑insensitive manner.
 * @param {object} article The article object
 * @param {Array} authors The list of authors
 * @returns {HTMLElement} The author element with a link and image (if available)
 */

/**
 * Creates an author element for the article with a corresponding link.
 * This version ensures that the author image is pulled through and that both the image and name link to the author profile.
 * @param {object} article The article object
 * @param {Array} authors The list of authors
 * @returns {HTMLElement} The author element with a link and image (if available)
 */

function createArticleAuthor(article, authors) {
  const articleAuthor = document.createElement('div');
  articleAuthor.className = 'top-stories-author';
  const articleLink = document.createElement('a');
  let authorImageContainer;
  let authorImage;
  authors.forEach((author) => {
    if (article.author === author.author) {
      // create an anchor tag for the author
      authorImageContainer = document.createElement('a');
      authorImage = document.createElement('img');
      authorImage.alt = author.author;
      articleLink.href = author.path;
      articleLink.textContent = author.author;
      articleLink.setAttribute('aria-label', `Learn about ${author.author}`);
      authorImageContainer.href = author.path;
      authorImage.src = author.authorimage;
    }
    if (article.authoralias !== '0' && article.authoralias !== '') {
      articleLink.textContent = article.authoralias;
      articleLink.setAttribute('aria-label', article.authoralias);
      articleLink.href = article.aliasurl;
    }
  });

  if (
    authorImageContainer &&
    authorImage &&
    authorImage.src !== `${window.location.href}` &&
    (article.authoralias === '' || article.authoralias === '0')
  ) {
    authorImageContainer.appendChild(createOptimizedPicture(authorImage.src, authorImage.alt));
    articleAuthor.appendChild(authorImageContainer);
  }

  articleAuthor.appendChild(articleLink);
  return articleAuthor;
}

/**
 * Creates a published date element for the article.
 * The raw date is normalized before being formatted.
 * @param {string} date The article's published date
 * @param {number} wordcount The article's word count
 * @returns {HTMLElement} The published date element
 */

function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'top-stories-date';
  publishedDate.innerHTML = `
    <img class="article-clock" alt="article-clock-icon" width="14px" height="14px" src="/icons/clock.svg"/>
    ${formatingDate(formatToISO8601(date))}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

/**
 * Creates a category element for the article with a corresponding link
 * @param {object} article The article object
 * @returns {HTMLElement} The category element with a link
 */
function createArticleCategory(article) {
  const articleCategory = document.createElement('div');
  articleCategory.className = 'top-stories-category';
  const firstCategory = extractElementsFromString(article.category)[0];
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${createCategorySlug(firstCategory)}`;
  articleCategoryLink.textContent = firstCategory;
  articleCategoryLink.setAttribute('aria-label', `Read more stories on ${firstCategory}`);
  articleCategory.appendChild(articleCategoryLink);
  return articleCategory;
}

/**
 * Generates an article card containing the article's title, author, image,
 * published date, and description.
 * @param {HTMLElement} block The main block element
 * @param {Object} article The article object
 * @param {number} index The index of the article in the list
 * @param {string} divClassName The class name of the div where the card will be appended
 * @param {Array} authors The list of authors
 */
function generateCard(block, article, index, divClassName, authors) {
  const articleCard = document.createElement('div');
  articleCard.className = 'top-stories';

  // Create a div for the image
  const imageDiv = document.createElement('div');
  imageDiv.className = 'top-stories-image';
  if (article.image !== '0' && article.image !== '') {
    imageDiv.appendChild(createArticleImage(article, index));
  }

  // Create a div for text content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'text-wrap';

  const topDiv = document.createElement('div');
  topDiv.className = 'title-category-wrapper';

  // Title & Category
  topDiv.appendChild(createArticleTitle(article));
  topDiv.appendChild(createArticleCategory(article));
  contentDiv.appendChild(topDiv);

  // Description
  if (article.description !== '0') {
    contentDiv.appendChild(createArticleDescription(article));
  }

  // Author & Published Date
  const bottomDiv = document.createElement('div');
  bottomDiv.className = 'bottom-wrap';
  bottomDiv.appendChild(createArticleAuthor(article, authors));
  bottomDiv.appendChild(createPublishedDate(article.publisheddate, article.wordcount));
  contentDiv.appendChild(bottomDiv);

  // Combine image & text content
  if (article.image !== '0' && article.image !== '') {
    articleCard.appendChild(imageDiv);
  }
  articleCard.appendChild(contentDiv);

  // Append to the appropriate target div
  let targetDiv;
  if (index === 0) {
    targetDiv = block.querySelector('.first-wrap');
  } else {
    targetDiv = block.querySelector('.second-wrap');
  }

  if (targetDiv) {
    targetDiv.appendChild(articleCard);
  } else {
    console.error(`Div with class ${divClassName} not found`);
  }
}

// helper function to collect all articles from the generator
async function all(generator) {
  const result = [];
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

/**
 * Generates article cards when filtering by a specific tag, category, or other property.
 * @param {Array} articles The list of articles
 * @param {HTMLElement} block The block to which we append the articles
 * @param {Array} authors The list of authors
 * @param {object} filterDataOption { type, value }
 */
function generateCardsByFilterOptionType(articles, block, authors, filterDataOption) {
  let itemsCount = 0;
  let filterTagArray = [];

  articles.forEach((item) => {
    if (filterDataOption.type === 'tag' || filterDataOption.type === 'category') {
      filterTagArray = extractElementsFromString(item[filterDataOption.type]);
      if (itemsCount < 4 && filterTagArray.includes(filterDataOption.value)) {
        generateCard(block, item, itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
        itemsCount += 1;
      }
    } else if (itemsCount < 4 && item[filterDataOption.type].toLowerCase() === filterDataOption.value) {
      generateCard(block, item, itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
      itemsCount += 1;
    }
  });

  // If fewer than 4 items match, fill up with non-matching items
  if (itemsCount < 4) {
    articles.forEach((item) => {
      if (filterDataOption.type === 'tag' || filterDataOption.type === 'category') {
        filterTagArray = extractElementsFromString(item[filterDataOption.type]);
        if (itemsCount < 4 && !filterTagArray.includes(filterDataOption.value)) {
          generateCard(block, item, itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
          itemsCount += 1;
        }
      } else if (itemsCount < 4 && item[filterDataOption.type].toLowerCase() !== filterDataOption.value) {
        generateCard(block, item, itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
        itemsCount += 1;
      }
    });
  }
}

/**
 * Generates article cards based on a pre-selected list of article URLs/paths.
 * @param {Array} articles The list of articles
 * @param {HTMLElement} block The block to which we append the articles
 * @param {Array} authors The list of authors
 * @param {Array} sponsoredResourcesPathsArray Preselected paths to display first
 */
function generateCardsByURLs(articles, block, authors, sponsoredResourcesPathsArray) {
  let itemsCount = 0;

  sponsoredResourcesPathsArray?.forEach((item) => {
    for (let index = 0; index < articles.length || index < 4; index += 1) {
      if (item === articles[index].path) {
        generateCard(block, articles[index], itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
        itemsCount += 1;
      }
    }
  });

  // Fill remaining slots (up to 4 total) with articles not in the preselected list
  let isArticleInList = false;
  for (let index = 0; index < 4 && itemsCount < 4; index += 1) {
    isArticleInList = false;
    for (let index2 = 0; index2 < sponsoredResourcesPathsArray.length || index2 < 5; index2 += 1) {
      if (articles[index].path === sponsoredResourcesPathsArray[index2]) {
        isArticleInList = true;
      }
    }
    if (!isArticleInList) {
      generateCard(block, articles[index], itemsCount, itemsCount ? '.second-wrap' : '.first-wrap', authors);
      itemsCount += 1;
    }
  }
}

/**
 * Attempts to fetch articles, then calls either generateCardsByFilterOptionType or generateCardsByURLs.
 * Articles are normalized and then sorted by publish date.
 * @param {string} url The URL to fetch articles from
 * @param {boolean} hasFilterOption Whether a filter option is set
 * @param {HTMLElement} block The block element
 * @param {Array} authors The list of authors
 * @param {object} filterDataOption { type, value }
 * @param {Array} sponsoredResourcesPathsArray If preselected resources exist, use them first
 */
async function fetchArticles(url, hasFilterOption, block, authors, filterDataOption, sponsoredResourcesPathsArray) {
  try {
    const articlesGenerator = ffetch(url).limit(1000);
    const articles = await all(articlesGenerator);
    // Sort articles by normalized publish date (most recent first)
    articles.sort((a, b) => {
      const ad = new Date(formatToISO8601(a.publisheddate)).getTime();
      const bd = new Date(formatToISO8601(b.publisheddate)).getTime();
      return bd - ad;
    });

    if (hasFilterOption) {
      generateCardsByFilterOptionType(articles, block, authors, filterDataOption);
    } else {
      generateCardsByURLs(articles, block, authors, sponsoredResourcesPathsArray);
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

/**
 * Fetches authors from a given URL.
 * @param {string} url The URL for the author index
 * @returns {Array} A list of author objects
 */
async function fetchAuthors(url) {
  try {
    const authorsGenerator = ffetch(url);
    return await all(authorsGenerator);
  } catch (error) {
    console.error('Error fetching authors', error);
    return [];
  }
}

/**
 * Checks if a block has the 'preselected-resources' class.
 * @param {HTMLElement} block The block to check
 * @returns {boolean}
 */
function checkSponsoredResource(block) {
  return block.classList.contains('preselected-resources');
}

/**
 * Returns an array of paths from the 'preselected-resources' list.
 * @param {HTMLElement} block The block element
 * @returns {Array<string>} The paths array
 */
function getSponsoredResourcesPaths(block) {
  const arrayCollection = block.querySelector('div div ul')?.getElementsByTagName('li');
  const paths = [];
  if (arrayCollection) {
    for (const item of arrayCollection) {
      const path = new URL(item.querySelector('a').title);
      paths.push(path.pathname);
    }
  }
  return paths;
}

/**
 * Checks if a block has the 'top-stories-header' class.
 * @param {HTMLElement} block The block to check
 * @returns {boolean}
 */
function checkForExtraHeader(block) {
  return block.classList.contains('top-stories-header');
}

/**
 * Retrieves the title text from the block and removes its container.
 * @param {HTMLElement} block The block element
 * @returns {string} The title text
 */
function getTitleOfTheBlock(block) {
  const titleContainer = block.querySelector(':scope > div');
  const blockTitle = titleContainer.querySelector(':scope > div:nth-child(2)').innerHTML;
  titleContainer.remove();
  return blockTitle;
}

/**
 * Retrieves filter data option from the block and removes its container.
 * @param {HTMLElement} block The block element
 * @returns {object} { type, value }
 */
function getFilterDataOption(block) {
  const optionParent = block.querySelector(':scope > div');
  const optionType = optionParent.querySelector(':scope > div').innerHTML.toLowerCase();
  const optionValue = optionParent.querySelector(':scope > div:nth-child(2)').innerHTML.toLowerCase();
  const dataOption = { type: optionType, value: optionValue };
  optionParent.remove();
  return dataOption;
}

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Inserts a header block with the provided title and a "View All" button.
 * @param {HTMLElement} node The parent node
 * @param {string} title The title to display
 * @param {HTMLElement} firstBlock The reference block before which we insert
 */
function createHeadElements(node, title, firstBlock) {
  const viewBtnText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Alles ansehen' : 'View All';
  const documentFragment = render(`
    <div>
      <div>
        <p>${title}</p>
        <p></p>
        <p class="button-container">
          <a href="" title="${viewBtnText}" class="button">${viewBtnText}</a>
        </p>
      </div>
    </div>
  `);
  node.insertBefore(documentFragment, firstBlock);
}

/**
 * Sets the "View All" button's href based on the filter type and value.
 * @param {HTMLElement} block The block element
 * @param {object} filterDataOption { type, value }
 */
function setViewAllArticlesHref(block, filterDataOption) {
  const newFilter = filterDataOption.value.replace(/ /, '-');
  const hrefValue = `/${filterDataOption.type}/${newFilter}`;
  block.querySelector(':scope > div div p:nth-child(3) a').setAttribute('href', hrefValue);
}

/**
 * Decorates the block by fetching articles, rendering them, and optionally
 * displaying a title/header and preselected resources.
 * @param {HTMLElement} block The block element to decorate
 */
export default async function decorate(block) {
  const authors = await fetchAuthors('/author-query-index.json');
  let filterDataOption = {};
  let sponsoredResourcesPathsArray = [];

  const componentTitle = getTitleOfTheBlock(block);

  // Check if there's a filter header
  if (checkForExtraHeader(block)) {
    filterDataOption = getFilterDataOption(block, filterDataOption);
  }

  // Insert a heading area before the "first-wrap" container
  const firstWrapDiv = block.querySelector('.first-wrap');
  createHeadElements(block, componentTitle, firstWrapDiv);

  // Prepare containers
  const firstRow = document.createElement('div');
  firstRow.className = 'first-wrap';
  const secondRow = document.createElement('div');
  secondRow.className = 'second-wrap';
  block.appendChild(firstRow);
  block.appendChild(secondRow);

  // If block has preselected resources
  if (checkSponsoredResource(block)) {
    sponsoredResourcesPathsArray = getSponsoredResourcesPaths(block);
  }

  // Fetch and display articles (articles are normalized and then sorted)
  await fetchArticles(
    '/article-query-index.json',
    checkForExtraHeader(block),
    block,
    authors,
    filterDataOption,
    sponsoredResourcesPathsArray
  );

  // Remove the preselected-resources list container if present
  if (checkSponsoredResource(block)) {
    block.querySelector('div').remove();
  }

  // If we had a filter header, set "View All" button link
  if (checkForExtraHeader(block)) {
    setViewAllArticlesHref(block, filterDataOption);
  }

  // Limit second row to 3 stories
  const topStories = secondRow.querySelectorAll('.top-stories');
  let index = 1;
  topStories.forEach((story) => {
    if (index > 3) {
      story.remove();
    }
    index += 1;
  });
}
