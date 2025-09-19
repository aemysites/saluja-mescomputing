/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { all, formatToISO8601} from '../../scripts/shared.js';
import { createCategorySlug } from '../../scripts/url-utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

function createTrendlineTitle(title, path) {
  const trendlineTitle = document.createElement('a');
  trendlineTitle.className = 'trendline-title';
  trendlineTitle.href = path;
  trendlineTitle.setAttribute('aria-label', `Read more about ${title}`);
  trendlineTitle.innerText = title;
  return trendlineTitle;
}

/**
 * Creates an image element for the article
 * @param {string} imageUrl The URL of the article image
 * @param title
 * @returns {HTMLElement} The image element
 */
function createTrendlineImage(imageUrl, title) {
  const articleImage = document.createElement('img');
  articleImage.className = 'trendline-image';
  articleImage.src = `${imageUrl}`;
  articleImage.alt = title;
  articleImage.loading = 'lazy';
  return createOptimizedPicture(articleImage.src, title);
}

function generateTrendline(article, index, wrapperColumn) {
  const articleCard = document.createElement('div');
  articleCard.className = 'trendline-card';

  if (index === 0) {
    const linkWrapper = document.createElement('a');
    linkWrapper.href = `/category/${createCategorySlug(article.category)}`;
    if (article.image !== '0' && article.image !== '') {
      linkWrapper.appendChild(createTrendlineImage(article.image, article.title));
    }
    linkWrapper.setAttribute('aria-label', `Read more about ${article.title}`);
    articleCard.appendChild(linkWrapper);
  }
  articleCard.appendChild(createTrendlineTitle(article.title, article.path));
  wrapperColumn.appendChild(articleCard);
}

function setColumnsContent(
  articles,
  categoryList,
  tagList,
  column1,
  column2,
  column3,
  column1Name,
  column2Name,
  column3Name
) {
  articles.forEach((article) => {
    if (categoryList.length > 0) {
      categoryList.forEach((category) => {
        if (article.category.toLowerCase() === category.toLowerCase()) {
          if (column1.length < 4 && article.category.toLowerCase() === column1Name.toLowerCase()) {
            column1.push(article);
          } else if (column2.length < 4 && article.category.toLowerCase() === column2Name.toLowerCase()) {
            column2.push(article);
          } else if (column3.length < 4 && article.category.toLowerCase() === column3Name.toLowerCase()) {
            column3.push(article);
          }
        }
      });
    }

    if (tagList.length > 0) {
      tagList.forEach((tag) => {
        if (article.tag.toLowerCase().includes(tag.toLowerCase())) {
          if (column1.length < 4 && tag.toLowerCase() === column1Name.toLowerCase()) {
            column1.push(article);
          } else if (
            column2.length < 4 &&
            tag.toLowerCase() === column2Name.toLowerCase() &&
            !column1.includes(article)
          ) {
            column2.push(article);
          } else if (
            column3.length < 4 &&
            tag.toLowerCase() === column3Name.toLowerCase() &&
            !column1.includes(article) &&
            !column2.includes(article)
          ) {
            column3.push(article);
          }
        }
      });
    }
  });

  return [column1, column2, column3];
}

function addCategoryTag(
  column1Name,
  column2Name,
  column3Name,
  wrapperColumn1,
  wrapperColumn2,
  wrapperColumn3,
  categoryList
) {
  const column1Header = document.createElement('a');
  const column2Header = document.createElement('a');
  const column3Header = document.createElement('a');

  const nameColumn1 = createCategorySlug(column1Name);
  const nameColumn2 = createCategorySlug(column2Name);
  const nameColumn3 = createCategorySlug(column3Name);

  column1Header.href = categoryList.includes(column1Name) ? `/category/${nameColumn1}` : `/tag/${nameColumn1}`;
  column2Header.href = categoryList.includes(column2Name) ? `/category/${nameColumn2}` : `/tag/${nameColumn2}`;
  column3Header.href = categoryList.includes(column3Name) ? `/category/${nameColumn3}` : `/tag/${nameColumn3}`;
  column1Header.textContent = column1Name === 'AI' ? 'Artificial Intelligence' : column1Name;
  column2Header.textContent = column2Name === 'AI' ? 'Artificial Intelligence' : column2Name;
  column3Header.textContent = column3Name === 'AI' ? 'Artificial Intelligence' : column3Name;

  wrapperColumn1.querySelector('.trendline-tag').append(column1Header);
  wrapperColumn2.querySelector('.trendline-tag').append(column2Header);
  wrapperColumn3.querySelector('.trendline-tag').append(column3Header);
}

function getDataForEveryTrendline(articles, categoryList, tagList) {
  const column1 = [];
  const column2 = [];
  const column3 = [];
  let column1Name = '';
  let column2Name = '';
  let column3Name = '';
  const wrapperColumn1 = document.querySelector('.trendline-column.column-1');
  const wrapperColumn2 = document.querySelector('.trendline-column.column-2');
  const wrapperColumn3 = document.querySelector('.trendline-column.column-3');

  // set the name for each column, it's easy to track in which column the article must be added
  categoryList.forEach((category, index) => {
    if (index === 0) {
      column1Name = category;
    } else if (index === 1) {
      column2Name = category;
    } else {
      column3Name = category;
    }
  });

  tagList.forEach((tag) => {
    if (column1Name === '') {
      column1Name = tag;
    } else if (column2Name === '') {
      column2Name = tag;
    } else {
      column3Name = tag;
    }
  });

  addCategoryTag(column1Name, column2Name, column3Name, wrapperColumn1, wrapperColumn2, wrapperColumn3, categoryList);

  // set the content for each column of trendline
  setColumnsContent(articles, categoryList, tagList, column1, column2, column3, column1Name, column2Name, column3Name);

  // generate card for every column
  column1.forEach((article, id) => {
    generateTrendline(article, id, wrapperColumn1);
  });

  column2.forEach((article, id) => {
    generateTrendline(article, id, wrapperColumn2);
  });

  column3.forEach((article, id) => {
    generateTrendline(article, id, wrapperColumn3);
  });
}

async function fetchArticles(url, categoryList, tagList) {
  try {
    // attempt to fetch from the specified sheet
    const articlesGenerator = ffetch(url).limit(1000);
    const articles = await all(articlesGenerator);
    // SORT: Order articles by normalized publish date (most recent first)
    articles.sort(
      (a, b) =>
        new Date(formatToISO8601(b.publisheddate)) -
        new Date(formatToISO8601(a.publisheddate))
    );
    getDataForEveryTrendline(articles, categoryList, tagList);
  } catch (error) {
    console.error('Error fetching articles', error);
  }
}

function createTitle(block) {
  const title = document.createElement('div');
  title.className = 'trendline-header';
  title.innerText = 'Trendlines';
  block.append(title);
}

function createColumns(block) {
  const trendlineColumnsWrapper = document.createElement('div');
  trendlineColumnsWrapper.className = 'trendline-column-wrapper';
  const trendlineColumn1 = document.createElement('div');
  const trendlineColumn2 = document.createElement('div');
  const trendlineColumn3 = document.createElement('div');

  trendlineColumn1.className = 'trendline-column column-1';
  trendlineColumn2.className = 'trendline-column column-2';
  trendlineColumn3.className = 'trendline-column column-3';

  const trendlineTag1 = document.createElement('div');
  const trendlineTag2 = document.createElement('div');
  const trendlineTag3 = document.createElement('div');

  trendlineTag1.className = 'trendline-tag';
  trendlineTag2.className = 'trendline-tag';
  trendlineTag3.className = 'trendline-tag';

  trendlineColumn1.append(trendlineTag1);
  trendlineColumn2.append(trendlineTag2);
  trendlineColumn3.append(trendlineTag3);

  trendlineColumnsWrapper.append(trendlineColumn1, trendlineColumn2, trendlineColumn3);
  block.append(trendlineColumnsWrapper);
}

export default async function decorate(block) {
  document.querySelector('.trendlines > div').style.display = 'none';
  document.querySelector('.trendlines > div:nth-child(2)').style.display = 'none';
  const firstDivText = document.querySelector('.trendlines > div div').innerText;
  let category;
  let tag;

  if (firstDivText === 'Category' || firstDivText === 'category') {
    category = document.querySelector('.trendlines > div div:nth-child(2)');
    tag = document.querySelector('.trendlines > div:nth-child(2) div:nth-child(2)');
  } else {
    category = document.querySelector('.trendlines > div:nth-child(2) div:nth-child(2)');
    tag = document.querySelector('.trendlines > div div:nth-child(2)');
  }

  const tagString = tag.innerText.replaceAll(', ', ',');
  const tagList = tagString.split(',');

  const categoryString = category.innerText.replaceAll(', ', ',');
  const categoryList = categoryString.split(',');

  createTitle(block);
  createColumns(block);

  fetchArticles('/article-query-index.json', categoryList, tagList);
}
