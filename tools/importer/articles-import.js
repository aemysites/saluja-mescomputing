/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* global WebImporter */

// figcaption blocks
const figcaption = (main, document) => {
  const figureElements = document?.querySelectorAll('figure');
  figureElements?.forEach((figureElement) => {
    const imgDiv = figureElement?.querySelector('.image-caption');
    const pElement = imgDiv ? imgDiv?.querySelector('p') : null;
    const fullText = imgDiv ? imgDiv?.textContent?.trim() : '';
    const pText = pElement ? pElement?.textContent?.trim() : '';
    const spanText = fullText?.slice(0, fullText.length - pText.length)?.trim();
    const cells = [['Fig caption (heading)'], [spanText, pText]];

    if (imgDiv) {
      const table = WebImporter?.DOMUtils?.createTable(cells, document);
      figureElement?.replaceWith(table);
    }
  });
};

const figcaptionAlt = (main, document) => {
  const figureElements = document?.querySelectorAll('figure');
  figureElements?.forEach((figureElement) => {
    const imgElement = figureElement?.querySelector('img');
    const figCaption = figureElement?.querySelector('figcaption');
    if (imgElement && figCaption) {
      const img = document?.createElement('img');
      img.src = imgElement?.src;
      img.alt = imgElement?.alt || 'Figure image';
      const figcaptionText = figCaption?.textContent?.trim();
      const cells = [['Fig caption'], [['Image'], img?.outerHTML], ['Description', figcaptionText]];
      const table = WebImporter?.DOMUtils?.createTable(cells, document);
      figureElement?.replaceWith(table);
    }
  });
};

// Create table block
const tableBlock = (main, document) => {
  const tables = document?.querySelectorAll('table');
  tables?.forEach((table) => {
    const newRow = document?.createElement('tr');
    const newHeader = document?.createElement('th');
    newHeader.textContent = 'Table (bordered)';

    const columnCount = table?.querySelector('tr')?.children?.length;
    newHeader?.setAttribute('colspan', String(columnCount));

    newRow?.appendChild(newHeader);
    const tbody = table?.querySelector('tbody');
    if (tbody) {
      tbody?.insertBefore(newRow, tbody?.firstChild);
    } else {
      table?.insertBefore(newRow, table?.firstChild);
    }
  });
};

// create embed twitter
const twitterBlock = (main, document) => {
  const twitter = document?.querySelectorAll('.twitter-tweet');
  twitter?.forEach((twit) => {
    let link = twit?.querySelector('p ~ a')?.getAttribute('href');
    console.log('Twitter link', link);
    if (!link) {
      console.log('Twitter link not exits', link);
      const fallbackLinks = twit.querySelectorAll('a');
      fallbackLinks?.forEach((fallbackLink) => {
        if (fallbackLink.href?.includes('/status/')) {
          link = fallbackLink.href;
        }
      });
      console.log('Twitter fallback is', link);
    }

    const cells = [['Embed'], [link]];
    const table = WebImporter?.DOMUtils?.createTable(cells, document);
    twit?.replaceWith(table);
  });
};

// create embed video
const videoBlock = (main, document, html) => {
  const jwplayer = html?.querySelectorAll('.article-image');
  const articleImage = document?.querySelector('.article-image');

  jwplayer?.forEach((item) => {
    const scripts = item?.querySelectorAll('script');
    scripts?.forEach((script) => {
      const src = script?.getAttribute('src');

      if (src.includes('jwplatform')) {
        const id = src?.split('/')?.pop()?.split('.js')[0];
        const cells = [['JW Player'], ['player-id', id]];
        const table = WebImporter?.DOMUtils?.createTable(cells, document);
        articleImage?.append(table);
      }
    });
  });
};

const alchemerBlock = (main, document) => {
  const alchemer = main?.querySelectorAll('.article-content noscript a');
  alchemer?.forEach((a) => {
    const href = a?.getAttribute('href');
    if (href?.includes('survey.alchemer')) {
      const cells = [['Embed'], [href]];
      const table = WebImporter?.DOMUtils?.createTable(cells, document);
      a?.replaceWith(table);
    }
  });
};

const datawrapperBlock = (main, document) => {
  const datawrapper = main?.querySelectorAll('.article-content p iframe');
  datawrapper?.forEach((item) => {
    const id = item?.getAttribute('id');
    const src = item?.getAttribute('src');
    if (id?.includes('datawrapper-chart')) {
      const cells = [['Embed'], [src]];
      const table = WebImporter?.DOMUtils?.createTable(cells, document);
      item?.replaceWith(table);
    }
  });
};

const iframeBlock = (main, document) => {
  const iframe = main?.querySelectorAll('.article-content p iframe');
  iframe?.forEach((item) => {
    console.log('item', item);
    const src = item?.getAttribute('src');
    const cells = [['iframe'], [src]];
    const table = WebImporter?.DOMUtils?.createTable(cells, document);
    item?.replaceWith(table);
  });
};

// section break
const sectionBreak = (main, document) => {
  const pag = main?.querySelector('.article-pagination');
  if (pag) {
    const hr = document?.createElement('hr');
    pag?.replaceWith(hr);
  }
};

// highlights block
const highlights = (main, document) => {
  const highlightsBlock = document?.querySelector('#highlights-advisers');
  const heading = document?.querySelector('#highlights-advisers h2');
  const links = document?.querySelectorAll('#highlights-advisers > div > div > div.big-article-right > h4 > a');

  if (highlightsBlock) {
    let content = `${heading?.textContent}`;
    let linksArray = [];

    links?.forEach((link) => {
      const url = new URL(link?.href);
      linksArray?.push(`<p><a href="${url?.pathname}" title="${url?.pathname}">${url?.pathname}</a></p>`);
    });

    const linksContent = linksArray?.join('');
    const cells = [['Highlights'], [content + linksContent]];

    try {
      const table = WebImporter?.DOMUtils?.createTable(cells, document);
      main?.append(table);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }
};

// metadata block
const createMetadataBlock = (main, document) => {
  const meta = {};
  meta.template = 'article';

  const title = document?.querySelector('title');
  if (title) {
    meta.title = title?.innerHTML?.replace(/[\n\t]/gm, '');
  }

  const desc = document?.querySelector('[property="og:description"]');
  if (desc) {
    meta.description = desc?.content;
  }

  const descDesc = document.querySelector('meta[name="description"]');
  if (descDesc) {
    const descDescContent = descDesc?.getAttribute('content');
    meta.description = descDescContent;
  }

  const link = document?.querySelector('[rel="syndication-source"]');
  if (link) {
    const url = new URL(link?.href);
    const type = url?.pathname?.split('/')[1];
    meta.type = type;
  }

  const author = document?.querySelector('.author-name > a');

  const internalHostnames = [
    'www.crn.de',
    'www.computing.co.uk',
    'www.channelweb.co.uk',
    'www.mescomputing.com',
    'www.crnasia.com',
    'www.crnaustralia.com',
    'www.crn.com.au',
    'crn.de',
    'computing.co.uk',
    'channelweb.co.uk',
    'mescomputing.com',
    'crnasia.com',
    'crnaustralia.com',
    'crn.com.au',
    'localhost',
  ];
  const { hostname } = author?.href ? new URL(author?.href) : '';

  if (internalHostnames?.includes(hostname)) {
    if (author) {
      meta.author = author?.textContent;
    } else {
      meta.author = '';
    }
    meta.authorAlias = '';
    meta.aliasURL = '';
  } else {
    meta.author = '';
    meta.authorAlias = author?.textContent || '';
    meta.aliasURL = author?.href || '';
  }

  const relatedTopics = document?.querySelectorAll('.related-topics a');
  meta.category = [];
  meta.tag = [];

  relatedTopics?.forEach((topic) => {
    const text = topic?.textContent;
    if (topic?.getAttribute('href')?.includes('/category/')) {
      meta?.category?.push(text);
    } else if (topic?.getAttribute('href')?.includes('/tag/')) {
      meta?.tag?.push(text);
    }
  });

  meta.category = meta?.category?.join(', ');
  meta.tag = meta?.tag.join(', ');

  const keywords = document?.querySelector('[name="keywords"]');
  if (keywords) {
    meta.keywords = keywords?.content;
  }

  const contentHub = meta?.type === 'content-hub';
  if (contentHub) {
    meta.tag = keywords?.content;
  }

  const pubDate = document?.querySelector('[property="article:published_time"]');
  if (pubDate) {
    meta.publishedDate = pubDate?.content;
  }
  const modDate = document?.querySelector('[property="article:modified_time"]');
  if (modDate) {
    meta.lastModified = modDate?.content;
  }
  const img = document?.querySelector('[property="og:image"]');
  if (img) {
    const el = document?.createElement('img');
    el.src = img?.content;
    meta.image = el;
  }

  const articleContent = document?.querySelector('.article-content');
  if (articleContent) {
    let totalWordCount = 0;
    const paragraphs = articleContent?.querySelectorAll('p');
    paragraphs?.forEach((p) => {
      const textContent = p?.textContent?.replace(/&nbsp;/g, ' ');
      totalWordCount += textContent.split(' ').filter((word) => word.length > 0).length;
    });
    meta.wordCount = totalWordCount;
  }

  // helper to create the metadata block
  const block = WebImporter?.Blocks?.getMetadataBlock(document, meta);
  main?.append(block);
  return meta;
};

// clean up
export default {
  transformDOM: ({ document, url, html }) => {
    const template = document?.createElement('template');
    template.innerHTML = html;
    const htmlContent = template?.content;
    const main = document?.body;
    tableBlock(main, document);
    videoBlock(main, document, htmlContent);
    twitterBlock(main, document);
    alchemerBlock(main, document);
    datawrapperBlock(main, document);
    figcaption(main, document);
    figcaptionAlt(main, document);
    sectionBreak(main, document);
    highlights(main, document);
    iframeBlock(main, document);

    const regex = /\/page(\/\d+)?$/;
    if (!regex?.test(url)) {
      createMetadataBlock(main, document, url);
    }

    const commonHeader = document.querySelectorAll('.common-header');
    let removeText;
    commonHeader.forEach((text) => {
      if (text.innerText.includes('You may also like')) {
        removeText = text;
        removeText.remove();
      }
    });

    WebImporter?.DOMUtils?.remove(main, [
      '.bhide-768',
      'footer',
      'nav',
      '.author',
      '.social-heading',
      '.common-right-hand-block',
      '.related-topics',
      '.pagination-article',
      '#more-on',
      '#wrapper > div.wrapper-container.article-page.ajax_search > div:nth-child(1) > div > div.common-left-hand-block.col-lg-8 > div.container-fluid',
      '#netzero-home',
      '#highlights-advisers',
      '.kreatio-mostread',
      'hr',
      '.upcoming-events-ticker',
      '.listing-article-block',
    ]);

    return main;
  },
};
