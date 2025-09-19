/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { sortArticlesByPublishDate, formatingDate, estimateTime } from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

/**
 * Creates an image element for the article with a corresponding link
 * @param {object} article The article object containing the image URL
 * @returns {HTMLElement} The image element with a link
 */
function createArticleImage(article) {
  const articleImage = document.createElement('div');
  articleImage.className = 'ranked-articles-image';
  const imageLink = document.createElement('a');
  imageLink.href = article.path;
  imageLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  const imageElement = document.createElement('img');
  imageElement.src = article.image;
  imageElement.alt = 'Article Image';
  imageElement.loading = 'lazy';
  imageLink.appendChild(createOptimizedPicture(imageElement.src, article.title));
  articleImage.appendChild(imageLink);
  return articleImage;
}

/**
 * Creates a title element for the article with a corresponding link
 * @param {string} title The title of the article
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitle(article) {
  const articleTitle = document.createElement('div');
  const isLock = shouldBeGated(article.publisheddate);
  articleTitle.className = `ranked-articles-title ${isLock ? 'lock' : ''}`;
  // create an anchor tag for the title
  const articleLink = document.createElement('a');
  articleLink.href = article.path;
  articleLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  // Todo: update after Go Live/CDN switch
  articleLink.textContent = article.title;
  articleTitle.appendChild(articleLink);
  return articleTitle;
}

async function all(generator) {
  const result = [];
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

/**
 * Creates an author element for the article with a corresponding link
 * @param {Object} article The article object containing author information
 * @returns {HTMLElement} The author element with a link
 */
function createArticleAuthor(article, authors) {
  try {
    const articleAuthor = document.createElement('div');
    articleAuthor.className = 'ranked-articles-author';

    const articleLink = document.createElement('a');

    authors.forEach((verify) => {
      if (verify.author === article.author) {
        articleLink.href = verify.path;
        articleLink.setAttribute('aria-label', `Learn about ${verify.author}`);
        articleLink.textContent = article.author;
      }
    });

    articleAuthor.appendChild(articleLink);
    return articleAuthor;
  } catch (error) {
    console.error('Error creating article author:', error);
    return null;
  }
}

/**
 * Creates a published date element for the article
 * @param {string} date The UNIX timestamp of the article's published date
 * @returns {HTMLElement} The published date element
 */
function createPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'ranked-articles-date';
  publishedDate.innerHTML = `${formatingDate(date)}${estimateTime(wordcount)}`;

  return publishedDate;
}

/**
 * Generates an article card containing the article's title, author, image, published date, and description.
 * @param {Object} article The article object containing all necessary data.
 * @param {number} index The index of the article in the list.
 * @param {string} divClassName The class name of the div where the card will be appended.
 */
function generateCard(article, authors, block) {
  const articleCard = document.createElement('div');
  articleCard.className = 'ranked-articles';
  const contextWrapper = document.createElement('div');
  contextWrapper.className = 'ranked-articles-context-wrapper';
  if (article.image !== '0' && article.image !== '') {
    contextWrapper.appendChild(createArticleImage(article));
  }
  const contentDiv = document.createElement('div');
  contentDiv.className = 'text-wrap';
  contentDiv.appendChild(createArticleTitle(article));
  contentDiv.appendChild(createArticleAuthor(article, authors));
  contentDiv.appendChild(createPublishedDate(article.publisheddate, article.wordcount));

  // Append the content div to the context wrapper
  contextWrapper.appendChild(contentDiv);

  // Append the context wrapper to the article card
  articleCard.appendChild(contextWrapper);

  const targetDiv = block.querySelector('.wrap');
  if (targetDiv) {
    targetDiv.appendChild(articleCard);
  } else {
    console.error(`Div with class wrap not found`);
  }
}

function appendArticlesToPage(articles, authors, block) {
  const maxArticles = 6;
  let articlesAppended = 0;

  articles.forEach((item) => {
    if (articlesAppended < maxArticles) {
      generateCard(item, authors, block);
      articlesAppended += 1;
    }
  });
}

/**
 * Fetches articles from a specified URL and generates a card for each article
 * If the specified sheet is not found, it fetches articles without specifying a sheet
 * @param {string} url The URL to fetch articles from
 */
// helper function to collect all articles from the generator
async function allArticles(generator, filteredByWord) {
  const result = [];
  for await (const item of generator) {
    const category = createCategorySlug(item.category);
    const { type } = item;
    if (
      item.category !== '0' &&
      item.publisheddate &&
      (category === filteredByWord ||
        type === filteredByWord ||
        item.tag.toLowerCase().includes(filteredByWord.replaceAll('-', ' ')) ||
        item.author.toLowerCase() === filteredByWord.replaceAll('-', ' '))
    ) {
      result.push(item);
    }
  }
  return result;
}

async function allCategoryLimit(generator, filteredByWord) {
  const result = [];
  for await (const item of generator) {
    const category = createCategorySlug(item.Category);

    if (item && category === filteredByWord && category) {
      result.push(item);
    }
  }
  return result;
}

async function fetchArticles(url, filteredByWord, block) {
  try {
    const response = ffetch('/author-query-index.json');
    const authors = await all(response);
    // attempt to fetch from the specified sheet
    const articlesGenerator = ffetch(url).limit(1000);
    const articles = await allArticles(articlesGenerator, filteredByWord);
    appendArticlesToPage(articles, authors, block);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

async function fetchCategory(urlCategory, filteredByWord, block, authors) {
  try {
    const response = await fetch(urlCategory);
    const json = await response.json();
    const articles = await allArticles(json.data, filteredByWord);
    sortArticlesByPublishDate(articles);
    appendArticlesToPage(articles, authors, block);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

async function fetchCategoryLimit(url, filteredByWord, block) {
  try {
    const res = await fetch(url);
    const json = await res.json();
    const articles = await allCategoryLimit(json.data, filteredByWord);

    const offset = Number(articles[0].Offset);
    const limit = articles[0].Limit;
    const urlCategory = `/article-query-index.json?sheet=categorysort&offset=${offset}&limit=${limit}`;
    const response = ffetch('/author-query-index.json');
    const authors = await all(response);
    fetchCategory(urlCategory, filteredByWord, block, authors);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

function fetchArticlesByFiltered(filteredBy, filteredByWord, block) {
  // fetch and display articles
  if (filteredBy === 'Category' || filteredBy === 'category') {
    fetchCategoryLimit('/article-query-index.json?sheet=category&offset=0&limit=10000', filteredByWord, block);
  } else {
    fetchArticles('/article-query-index.json', filteredByWord, block);
  }
}

function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function decoratePage(block, filteredBy, filteredByWord) {
  const rankedArticlesTextDiv = document.createElement('div');
  rankedArticlesTextDiv.className = 'ranked-articles-text';

  const rankedArticlesLeftDiv = document.createElement('div');
  rankedArticlesLeftDiv.className = 'ranked-articles-left';
  rankedArticlesLeftDiv.textContent = capitalizeFirstLetter(filteredByWord);
  rankedArticlesTextDiv.appendChild(rankedArticlesLeftDiv);

  const rankedArticlesRightDiv = document.createElement('div');
  rankedArticlesRightDiv.className = 'ranked-articles-right';
  rankedArticlesTextDiv.appendChild(rankedArticlesRightDiv);

  const articlesViewDiv = document.createElement('div');
  articlesViewDiv.className = 'ranked-articles-view';
  const articlesViewLink = document.createElement('a');
  articlesViewLink.href = `/${filteredBy}/${filteredByWord}`;
  articlesViewLink.setAttribute('aria-label', 'VIEW ALL');
  articlesViewLink.textContent = 'VIEW ALL';
  articlesViewDiv.appendChild(articlesViewLink);
  rankedArticlesRightDiv.appendChild(articlesViewDiv);

  const articlesArrowDiv = document.createElement('div');
  articlesArrowDiv.className = 'ranked-articles-arrow';
  const articlesArrowLink = document.createElement('a');
  articlesArrowLink.href = `/${filteredBy}/${filteredByWord}`;
  const articlesArrowElement = document.createElement('img');
  articlesArrowElement.src = '/icons/hot-topic-arrow.svg';
  articlesArrowElement.alt = 'Orange arrow';

  articlesArrowElement.setAttribute('width', '23px');
  articlesArrowElement.setAttribute('height', '16px');

  articlesArrowLink.appendChild(articlesArrowElement);
  articlesArrowDiv.appendChild(articlesArrowLink);
  rankedArticlesRightDiv.appendChild(articlesArrowDiv);
  block.appendChild(rankedArticlesTextDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.className = 'wrap';
  block.appendChild(wrapDiv);
}

export default function decorate(block) {
  const hiddenDiv = block.querySelector('div');
  hiddenDiv.className = 'hidden';
  hiddenDiv.style.display = 'none';
  const filteredBy = hiddenDiv.querySelector('div:first-child').innerText;
  const filteredByWord = hiddenDiv.querySelector('div:last-child').innerText.toLowerCase().replaceAll(' ', '-');

  decoratePage(block, filteredBy, filteredByWord);
  fetchArticlesByFiltered(filteredBy, filteredByWord, block);
  hiddenDiv.remove();
}
