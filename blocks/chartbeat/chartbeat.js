import { fetchPlaceholders, readBlockConfig } from '../../scripts/aem.js';
import ffetch from '../../scripts/ffetch.js';

// Function that grabbed an article name by URL

/* function createTitleFromUrl(url) {
  // Extract the last segment after the last "/"
  const lastSegment = url.split('/').pop();

  // Replace hyphens with spaces and capitalize each word
  const title = lastSegment
    .split('-') // Split words by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join the words with spaces
  return title;
} */

async function all(generator) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const item of generator) {
    result.push(item);
  }
  return result;
}

async function fetchArticles(url) {
  const articlesGenerator = ffetch(url).limit(10);
  const articles = await all(articlesGenerator);
  return articles;
}

export default async function decorateChartbeat(block) {
  const blockConfig = readBlockConfig(block);
  const placeholders = await fetchPlaceholders();
  const cbKey = placeholders.chartbeatapikey;
  const cbSite = placeholders.chartbeatsite;
  const cbUrl = blockConfig.url;
  const cbLimit = blockConfig.limit;
  const articles = [];
  let filteredPages;

  const addArticle = (path, title) => {
    const newArticle = { path, title };
    articles.push(newArticle);
  };

  if (cbKey && cbSite) {
    block.textContent = '';
    const url = cbUrl || 'https://api.chartbeat.com/live/toppages/v3';
    const limit = cbLimit || 5;
    // Get results from Chartbeat API
    const results = await fetch(`${url}?apikey=${cbKey}&host=${cbSite}&limit=${limit + 20}`);

    const resultsJson = await results.json();
    // if (resultsJson && resultsJson.pages && resultsJson.pages.length >= limit) {
    const allowedKeywords = ['news', 'news-network', 'blog', 'blog-post', 'interview', 'news-analysis', 'sponsored'];

    filteredPages = resultsJson.pages.filter((page) => {
      const segment = page.path.replace(cbSite, '').split('/').filter(Boolean);
      if (segment.length > 0 && allowedKeywords.includes(segment[0])) {
        if (page.title !== '') {
          return true;
        }
        return false;
      }
      return false;
    });

    if (filteredPages.length < 5) {
      const placeholderArticles = await fetchArticles('/article-query-index.json');
      let prodArticles = [];
      prodArticles = [...filteredPages];
      while (prodArticles.length < 5) {
        const article = placeholderArticles.shift();
        prodArticles.push(article);
      }
      filteredPages = prodArticles;
    }

    filteredPages.splice(0, limit).forEach((page) => {
      let articlePath = '';
      let articleTitle = '';
      const path = page.path.replace(`${cbSite}`, '');
      articlePath = `https://www.${cbSite}${path}`;
      articleTitle = page.title;
      addArticle(articlePath, articleTitle);
    });
    // }
  } else {
    const placeholderArticles = await fetchArticles('/article-query-index.json');
    placeholderArticles.splice(0, 5).forEach((page) => {
      let articlePath = '';
      let articleTitle = '';
      const path = page.path.replace(`${cbSite}`, '');
      articlePath = `${cbSite}${path}`;
      articleTitle = page.title;
      addArticle(articlePath, articleTitle);
    });
  }
  return articles;
}
