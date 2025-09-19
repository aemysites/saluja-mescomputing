import ffetch from '../../scripts/ffetch.js';
import { articleQueryIndex, getTheTheme } from '../../scripts/shared.js';

let currentIndex = 0;
let articles = [];
let paginationContainer;

/**
 * sets the current article index based on the current page's URL path
 * utilizes the global `articles` array to find an article matching the current path
 * updates `currentIndex` to the index of the found article or zero if not found
 */

function currentArticle() {
  const currentPath = window.location.pathname;
  const getCurrentArticle = articles.find((article) => article.path === currentPath);
  currentIndex = getCurrentArticle ? articles.indexOf(getCurrentArticle) : 0;
}

/**
 * updates the navigation links for "next" and "previous" articles based on the current index
 * will adjust the innerText and href attributes of links for the navigation
 */

function updateNavigationLinks() {
  const nextArticle = document.querySelector('.next-article');
  const prevArticle = document.querySelector('.previous-article');
  const prevArticleLink = document.querySelector('a.previous-article');
  const prevArticleTitle = document.querySelector('a.previous-article .article-title');

  const nextArticleLink = document.querySelector('a.next-article');
  const nextArticleTitle = document.querySelector('a.next-article .article-title');

  if (currentIndex < articles.length - 1) {
    prevArticleTitle.innerText = articles[currentIndex + 1].title;
    prevArticleLink.href = articles[currentIndex + 1].path;
  } else {
    prevArticleTitle.innerText = '';
    prevArticleLink.href = '#';
    prevArticle.innerText = '';
  }
  if (currentIndex > 0) {
    nextArticleTitle.innerText = articles[currentIndex - 1].title;
    nextArticleLink.href = articles[currentIndex - 1].path;
  } else {
    nextArticleTitle.innerText = '';
    nextArticleLink.href = '#';
    nextArticle.innerText = '';
  }
}

/**
 * loads articles by fetching article data from specified source
 * filters articles based on their template type ('article' only) and updates navigation links
 */

async function loadArticles() {
  const url = articleQueryIndex();
  try {
    const articlesGenerator = ffetch(url);
    const fetchedArticles = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const article of articlesGenerator) {
      if (article.template === 'article') {
        fetchedArticles.push(article);
      }
    }
    articles = fetchedArticles;
    currentArticle();
    updateNavigationLinks();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching articles:', error);
  }
}

/**
 * sets up click event handlers for navigation links (previous and next articles)
 * prevents default click behavior and changes page location based on article path
 */

function setupNavigationHandlers() {
  const prevArticleLink = document.querySelector('a.previous-article');
  const nextArticleLink = document.querySelector('a.next-article');

  prevArticleLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentIndex < articles.length - 1) {
      window.location.href = articles[currentIndex + 1].path;
    }
  });

  nextArticleLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentIndex > 0) {
      window.location.href = articles[currentIndex - 1].path;
    }
  });
}

export default function decorate(block) {
  paginationContainer = document.createElement('div');
  paginationContainer.className = 'article-pagination-container';

  const prevArticle = document.createElement('a');
  prevArticle.className = 'previous-article';
  const prevArticleLink = document.createElement('p');
  prevArticleLink.className = 'article-title';
  const prevP = document.createElement('p');
  prevP.innerText = getTheTheme() === 'crn-de' ? 'VORHERIGER ARTIKEL' : 'Previous Article';
  prevArticle.appendChild(prevP);
  prevArticle.appendChild(prevArticleLink);

  const nextArticle = document.createElement('a');
  nextArticle.className = 'next-article';
  const nextArticleLink = document.createElement('p');
  nextArticleLink.className = 'article-title';
  const nextP = document.createElement('p');
  nextP.innerText = getTheTheme() === 'crn-de' ? 'NÄCHSTER ARTIKEL' : 'Next Article';
  nextArticle.appendChild(nextP);
  nextArticle.appendChild(nextArticleLink);

  block.appendChild(paginationContainer);
  paginationContainer.appendChild(prevArticle);
  paginationContainer.appendChild(nextArticle);

  setupNavigationHandlers();
  loadArticles(currentIndex);
}
