/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import {
  all,
  sortArticlesByPublishDate,
  allAuthors,
  extractElementsFromString,
  formatingDate,
  estimateTime,
  getTheTheme,
  updateHostname,
} from '../../scripts/shared.js';
import { getMetadata } from '../../scripts/aem.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 */
function generateCard(article, authors) {
  let authorImage;
  let authorName;
  let authorPath;
  authors.forEach((author) => {
    if (article.author === author.author) {
      authorName = author.author;
      authorPath = author.path;
      authorImage = author.authorimage;
    }
  });

  const isAlias = article.authoralias !== '' && article.authoralias !== '0';
  const imageData =
    authorImage && !isAlias
      ? `<a href="${authorPath}"><img class="more-on-author-image" src="${authorImage}" alt="Author Image"></a>`
      : '';

  const authorNameData =
    authorName && !isAlias
      ? `<div class="more-on-author-name"><a href="${authorPath}">${authorName}</a></div>`
      : `<div class="more-on-author-name"><a href="${article.aliasurl}">${article.authoralias}</a></div>`;

  const isLock = shouldBeGated(article.publisheddate);

  const firstCategory = extractElementsFromString(article.category)[0];

  const card = render(`
  <div class="more-on-card">
  ${
    article.image !== '0' && article.image !== ''
      ? `<div class="more-on-card-image-wrapper">
     <a href="${article.path}">
        <img class='more-on-card-image' src="${article.image}" alt="image"/>
      </a>
    </div>`
      : ``
  }
      <div class="more-on-card-context">
        <h4 class="more-on-card-category">
            <a href="/category/${createCategorySlug(firstCategory)}">
                ${firstCategory}
            </a>
        </h4>
        <div class="more-on-card-title ${isLock ? 'lock' : ''}">
            <h4><a title="${article.title}" class="" href="${article.path}">${article.title}</a></h4>
        </div>
        <div class="more-on-card-description">
         <p>${article.description.trim() !== '0' ? article.description : ''}</p>
        </div>
        <div class="more-on-article-details">
          <div class="more-on-card-author">
           ${imageData}
           ${authorNameData}
          </div>
          <div class="more-on-card-date">
            <img alt="clock" src="/icons/clock.svg">
            ${formatingDate(article.publisheddate)}${estimateTime(article.wordcount)}
          </div>
        </div>
    </div>
  </div>
  `);

  updateHostname(card);

  return card;
}

/**
 * Fetches category limit and offset from a specified URL
 * @param {string} url The URL to fetch articles from
 */
async function allCategoryLimit(generator, filteredBy) {
  const result = [];
  for await (const item of generator) {
    if (item && item.Category === filteredBy && item.Category) {
      result.push(item);
    }
  }
  return result;
}

async function fetchArticles(url, wrapper, mainBlock) {
  try {
    // attempt to fetch from the specified sheet
    const response = await fetch(url);
    const json = await response.json();
    const articles = await all(json.data);

    const authorsGenerator = ffetch('/author-query-index.json');
    const authors = await allAuthors(authorsGenerator);
    sortArticlesByPublishDate(articles);
    let appendsArticles = 0;

    articles.forEach((item) => {
      if (appendsArticles < 3) {
        if (!getMetadata('og:url').includes(item.path)) {
          const article = generateCard(item, authors);
          wrapper.append(article);
          appendsArticles += 1;
        }
      }
    });

    if (appendsArticles === 0) {
      mainBlock.querySelector('.more-on .title').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

async function fetchCategoryLimit(url, block, filteredBy, mainBlock) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    const articles = await allCategoryLimit(json.data, filteredBy);
    if (articles.length > 0) {
      const offset = Number(articles[0].Offset);
      const limit = Number(articles[0].Limit);

      // use drafts for testing until we have good date in main json
      fetchArticles(`/article-query-index.json?sheet=categorysort&offset=${offset}&limit=${limit}`, block, mainBlock);
    } else {
      mainBlock.querySelector('.more-on .title').style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'more-on-wrapper';
  const title = document.createElement('div');
  const filterByWord = getMetadata('category');
  const category = filterByWord.split(',')[0];

  title.className = 'title';
  title.innerText = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? `Mehr von ${category}` : `More on ${category}`;

  block.append(title);
  block.append(wrapper);

  // use drafts for testing until we have good date in main json
  fetchCategoryLimit('/article-query-index.json?sheet=category&offset=0&limit=10000', wrapper, filterByWord, block);
}
