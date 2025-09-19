/* eslint-disable no-console */
import { all, allAuthors, estimateTime, formatingDate } from '../../scripts/shared.js';
import { shouldBeGated } from '../../scripts/authentication/helpers.js';
import { createCategorySlug } from '../../scripts/url-utils.js';
import ffetch from '../../scripts/ffetch.js';

function findArticleByPath(articlesData, path) {
  if (!Array.isArray(articlesData)) {
    console.error(articlesData);
    return null;
  }
  return articlesData.find((article) => article.path === path) || null;
}

/**
 * Converts manual input paths to article objects using data from a given array of articles.
 * @param {Array<string>} paths An array of article paths.
 * @param {Array<Object>} articlesData An array of article data objects.
 * @returns {Array<Object>} An array of article objects.
 */
function convertPathsToObjects(paths, articlesData) {
  if (!Array.isArray(articlesData)) {
    console.error(articlesData);
    return [];
  }
  return paths.map((path) => {
    const articleDetails = findArticleByPath(articlesData, path);
    return {
      path,
      image: articleDetails ? articleDetails.image : '',
      title: articleDetails ? articleDetails.title : 'Default Title',
      description: articleDetails ? articleDetails.description : 'Default description',
      author: articleDetails ? articleDetails.author : 'Anonymous',
      publisheddate: articleDetails ? articleDetails.publisheddate : '0',
      category: articleDetails ? articleDetails.category : 'General',
      wordcount: articleDetails ? articleDetails.wordcount : '0',
    };
  });
}

// eslint-disable-next-line no-unused-vars
let pathsArray;

function getPathsArray(block, articlesData) {
  const arrayCollection = block.querySelectorAll('p a');
  const paths = [];
  arrayCollection.forEach((item) => {
    const path = new URL(item.href);
    paths.push(path.pathname);
  });
  const articleObjects = convertPathsToObjects(paths, articlesData);
  pathsArray = articleObjects;
  return articleObjects;
}

async function fetchArticleData(url) {
  try {
    const articlesGenerator = ffetch(url);
    const articles = await all(articlesGenerator);

    return articles;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return [];
  }
}

async function fetchAuthorData(url) {
  try {
    const authorsGenerator = ffetch(url);
    const authors = await allAuthors(authorsGenerator);

    return authors;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return [];
  }
}

function renderImage(article) {
  const link = document.createElement('a');
  link.href = article.path;
  link.target = '_blank';
  const img = document.createElement('img');
  img.classList.add('article-image');
  img.src = article.image;
  img.alt = 'Article Image';
  link.appendChild(img);
  return link;
}

function renderCateogry(article) {
  const categoryDiv = document.createElement('div');
  categoryDiv.classList.add('article-category');
  const categorySlug = createCategorySlug(article.category);
  const articleCategoryLink = document.createElement('a');
  articleCategoryLink.href = `/category/${categorySlug}`;
  articleCategoryLink.textContent = article.category;

  categoryDiv.appendChild(articleCategoryLink);
  return categoryDiv;
}

function renderTitle(article) {
  const isLock = shouldBeGated(article.publisheddate);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('article-title');
  if (isLock) {
    titleDiv.classList.add('lock');
  }

  const title = document.createElement('a');
  title.href = article.path;
  title.textContent = article.title;
  titleDiv.appendChild(title);
  return titleDiv;
}

function renderDescription(article) {
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('article-description');
  const description = document.createElement('a');
  description.textContent = article.description;
  descriptionDiv.appendChild(description);
  return descriptionDiv;
}

function renderAuthor(author) {
  if (!author) {
    return document.createElement('div');
  }

  const authorDiv = document.createElement('div');
  authorDiv.classList.add('article-author');

  if (author.authorimage) {
    const authorImg = document.createElement('a');
    authorImg.classList.add('author-img');
    authorImg.href = author.path;

    const img = document.createElement('img');
    img.src = author.authorimage;
    img.alt = 'Author Image';
    authorImg.appendChild(img);

    authorDiv.appendChild(authorImg);
  }

  const authorName = document.createElement('a');
  authorName.classList.add('author-name');
  authorName.href = author.path;
  authorName.textContent = author.author;
  authorDiv.appendChild(authorName);
  return authorDiv;
}

function renderPublishedDate(date, wordcount) {
  const publishedDate = document.createElement('div');
  publishedDate.className = 'published-date';
  publishedDate.innerHTML = `
      <img class="article-clock" src="/icons/clock.svg"/>
  ${formatingDate(date)}${estimateTime(wordcount)}
  `;
  return publishedDate;
}

function generateCard(article, author) {
  const card = document.createElement('div');
  card.classList.add('card');

  // top row
  const topRow = document.createElement('div');
  topRow.classList.add('top-row');
  if (article.image !== '0' && article.image !== '') {
    const imageLink = renderImage(article);
    topRow.appendChild(imageLink);
  }

  // bottom row
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('bottom-row');
  const authorDatewrap = document.createElement('div');
  authorDatewrap.classList.add('author-date-wrap');

  const category = renderCateogry(article);
  const title = renderTitle(article);
  const description = renderDescription(article);
  const auth = renderAuthor(author);
  const publishedDate = renderPublishedDate(article.publisheddate, article.wordcount);

  bottomRow.appendChild(category);
  bottomRow.appendChild(title);
  bottomRow.appendChild(description);
  authorDatewrap.appendChild(auth);
  authorDatewrap.appendChild(publishedDate);

  card.appendChild(topRow);
  card.appendChild(bottomRow);
  bottomRow.append(authorDatewrap);
  return card;
}

export default async function decorate(block) {
  const articlesData = await fetchArticleData('/article-query-index.json');
  const authors = await fetchAuthorData('/author-query-index.json');
  const heading = block.querySelector('.highlights p:first-of-type');
  if (heading) {
    heading.classList.add('highlights-heading');
  }
  const row = document.createElement('div');
  row.classList.add('row');

  const articleObjects = getPathsArray(block, articlesData);
  let articleNotFoundIndex = 0;

  articleObjects.forEach((article) => {
    const author = authors.find((a) => a.author === article.author);
    if (!author) {
      articleNotFoundIndex += 1;
    }
    const card = generateCard(article, author);
    row.appendChild(card);
  });

  const links = block.querySelectorAll('p a');
  links.forEach((link) => link.closest('p').remove());

  block.appendChild(row);

  if (articleNotFoundIndex === 3) {
    block.remove();
  }
}
