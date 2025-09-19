/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
// import ffetch from '../../scripts/ffetch.js';
import { getTheTheme, updateHostname } from '../../scripts/shared.js';
// import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import decorateChartbeat from '../chartbeat/chartbeat.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Creates a title element for the article with a corresponding link
 * @param {string} title The title of the article
 * @returns {HTMLElement} The title element with a link
 */
function createArticleTitle(article) {
  const cardTitle = document.createElement('div');
  // const isLock = shouldBeGated(article.publisheddate);
  cardTitle.className = 'most-read-card-title';
  // create an anchor tag for the title
  const cardLink = document.createElement('a');
  cardLink.href = article.path;
  cardLink.setAttribute('aria-label', `Read more about: ${article.title}`);
  // Todo: update after Go Live/CDN switch
  cardLink.textContent = article.title;
  cardTitle.appendChild(cardLink);
  return cardTitle;
}

/**
 * Creates a published date element for the article
 * @param {string} date The UNIX timestamp of the article's published date
 * @returns {HTMLElement} The published date element
 */
/* function createPublishedDate(date, wordcount) {
  // const publishedDate = document.createElement('div');
  publishedDate.className = 'most-read-card-date';
  publishedDate.innerHTML = `
        ${formatingDate(date)}${estimateTime(wordcount)}
  `;
  return publishedDate;
} */

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 * @param {string} index The article number
 */
function generateCard(article, index, articlesBlock) {
  const articleCard = document.createElement('div');
  articleCard.className = 'most-read-card';
  const cardNumber = document.createElement('div');
  cardNumber.className = 'most-read-card-number';
  const number = index + 1;
  cardNumber.textContent = `0${number}`;
  const context = document.createElement('div');
  context.className = 'most-read-card-context';
  context.appendChild(createArticleTitle(article));
  articleCard.appendChild(cardNumber);
  articleCard.appendChild(context);
  articlesBlock.appendChild(articleCard);
  updateHostname(articlesBlock);
}

/**
 * Fetches articles from a specified URL and generates a card for each article
 * If the specified sheet is not found, it fetches articles without specifying a sheet
 * @param {string} url The URL to fetch articles from
 */
// helper function to collect all articles from the generator
/* async function all(generator) {
  const result = [];
  for await (const item of generator) {
    if (item.publisheddate) {
      result.push(item);
    }
  }
  return result;
} */

function appendArticlesToPage(articles, articlesBlock) {
  articles.forEach((item, index) => {
    generateCard(item, index, articlesBlock);
  });
}

function createTitleBlock(block) {
  const theme = getTheTheme();

  let titleName;
  if (block.classList.contains('sidebar') && (theme === 'crn-de' || theme === 'computing-de')) {
    titleName = 'Meist gelesen';
  } else if (theme === 'crn-de' || theme === 'computing-de') {
    titleName = 'Am meisten gelesen';
  } else {
    titleName = 'Most read';
  }

  const title = render(
    `<div class="most-read-content">
      <div class="most-read-header">
        ${titleName}
      </div>
      <div class="most-read-line ">
      </div>
    </div>`
  );
  block.append(title);
}

function createMostReadWrapper(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'most-read-results';
  block.append(wrapper);
}

async function fetchArticles(articles, articlesBlock) {
  try {
    appendArticlesToPage(articles, articlesBlock);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

export default async function decorate(block) {
  createTitleBlock(block);
  createMostReadWrapper(block);
  const articlesBlock = block.querySelector('.most-read-results');
  const articles = await decorateChartbeat(articlesBlock);
  fetchArticles(articles, articlesBlock);
  block.querySelector('div').remove();
}
