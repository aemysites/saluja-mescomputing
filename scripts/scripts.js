import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  toClassName,
  decorateBlock,
  loadBlock,
} from './aem.js';

const LCP_BLOCKS = ['top-stories']; // add your LCP blocks to the list
const TEMPLATE_LIST = [
  'homepage',
  'article',
  'tag',
  'category',
  'type',
  'off',
  'search-results',
  'authentication',
  'filter',
  'diversity-sustainability-tech',
];

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * @typedef Template
 * @property {function} [loadLazy] If provided, will be called in the lazy phase. Expects a
 *  single argument: the document's <main> HTMLElement.
 * @property {function} [loadEager] If provided, will be called in the eager phase. Expects a single
 *  argument: the document's <main> HTMLElement.
 * @property {function} [loadDelayed] If provided, will be called in the delayed phase. Expects a
 *  single argument: the document's <main> HTMLElement.
 */

/**
 * @type {Template}
 */
let universalTemplate;
/**
 * @type {Template}
 */
let template;

/**
 * Invokes a template's eager method, if specified.
 * @param {Template} [toLoad] Template whose eager method should be invoked.
 * @param {HTMLElement} main The document's main element.
 */
async function loadEagerTemplate(toLoad, main) {
  if (toLoad && toLoad.loadEager) {
    await toLoad.loadEager(main);
  }
}

/**
 * Invokes a template's lazy method, if specified.
 * @param {Template} [toLoad] Template whose lazy method should be invoked.
 * @param {HTMLElement} main The document's main element.
 */
async function loadLazyTemplate(toLoad, main) {
  if (toLoad) {
    if (toLoad.loadLazy) {
      await toLoad.loadLazy(main);
    }
  }
}

/**
 * Invokes a template's delayed method, if specified.
 * @param {Template} [toLoad] Template whose delayed method should be invoked.
 * @param {HTMLElement} main The document's main element.
 */
async function loadDelayedTemplate(toLoad, main) {
  if (toLoad && toLoad.loadDelayed) {
    await toLoad.loadDelayed(main);
  }
}

/**
 * Loads a template by concurrently requesting its CSS and javascript files, and invoking its
 * eager loading phase.
 * @param {string} templateName The name of the template to load.
 * @param {HTMLElement} main The document's main element.
 * @returns {Promise<Template>} Resolves with the imported module after the template's files are
 *  loaded and its eager phase is complete.
 */
async function loadTemplate(templateName, main) {
  const cssLoaded = loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
  let module;
  const decorateComplete = new Promise((resolve) => {
    (async () => {
      module = await import(`../templates/${templateName}/${templateName}.js`);
      await loadEagerTemplate(module, main);
      resolve();
    })();
  });
  await Promise.all([cssLoaded, decorateComplete]);
  return module;
}

/**
 * Loads a block named 'sidebar' into aside
 * @param rightSection aside element
 * @returns {Promise}
 */
async function loadSidebar(rightSection) {
  const sidebarBlock = buildBlock('sidebar', '');
  if (rightSection) {
    rightSection.append(sidebarBlock);
    decorateBlock(sidebarBlock);
  }
  return loadBlock(sidebarBlock);
}

/**
 * Asynchronously loads appropriate CSS styles based on the theme specified in the metadata.
 * @async
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function loadSiteCss() {
  try {
    const theme = toClassName(getMetadata('theme'));

    if (theme === 'mescomputing-com') {
      loadCSS(`${window.hlx.codeBasePath}/styles/styles.css`);
    }

    if (theme === 'channelweb-co-uk') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/channelweb-styles.css`);
    }

    if (theme === 'computing-co-uk') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/computingco-styles.css`);
    }

    if (theme === 'crn-de') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/crnde-styles.css`);
    }

    if (theme === 'computing-de') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/computingde-styles.css`);
    }

    if (theme === 'crn-asia') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/crn-asia-styles.css`);
    }

    if (theme === 'crn-australia') {
      loadCSS(`${window.hlx.codeBasePath}/styles/themes/crn-australia-styles.css`);
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('theme loading failed', error);
  }
}

loadSiteCss();

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const templateName = toClassName(getMetadata('template'));
    const templates = TEMPLATE_LIST;

    if (templateName === 'off') return;

    // Load the universal template for every page
    if (templateName !== 'homepage') {
      universalTemplate = await loadTemplate('universal', main);
    }

    if (templateName === 'tag' || templateName === 'type' || templateName === 'category') {
      template = await loadTemplate('tag-type-category', main);
      return;
    }

    if (templateName === 'author') {
      template = await loadTemplate('author-page', main);
      return;
    }

    if (templateName === 'search-results') {
      template = await loadTemplate('search-results', main);
      return;
    }

    if (templateName === 'authentication') {
      template = await loadTemplate('authentication', main);
      return;
    }

    if (templateName === 'diversity-sustainability-tech') {
      template = await loadTemplate('diversity-sustainability-tech', main);
      return;
    }

    if (templates.includes(templateName)) {
      template = await loadTemplate(templateName, main);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('template loading failed', error);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main, blocksExist) {
  decorateButtons(main);
  decorateIcons(main);

  // no need to rebuild blocks in delayed if they already exist
  if (!blocksExist) {
    buildAutoBlocks(main);
  }

  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await decorateTemplates(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  await loadLazyTemplate(universalTemplate, main);
  await loadLazyTemplate(template, main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadSidebar(doc.querySelector('.right-section'));
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(async () => {
    const main = document.querySelector('main');
    await loadDelayedTemplate(universalTemplate, main);
    await loadDelayedTemplate(template, main);
    import('./gdpr.js');
    import('./delayed.js');
    // TODO: ads wont load unless this is commented out?
  }, 3000);
  // load anything that can be postponed to the latest here
}
async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

document.querySelectorAll('#unlock-opportunities-for-midmarket-tech-vendors ~ p a').forEach((anchor) => {
  anchor.setAttribute('target', '_blank');
});

document.querySelectorAll('#best-tech-jobs-for-new-starters---q3-2023 ~ p a').forEach((anchor) => {
  anchor.setAttribute('target', '_blank');
});

document.querySelectorAll('a').forEach((anchor) => {
  const theme = getMetadata('theme');
  const href = anchor.getAttribute('href');
  if (!href.includes(theme) && href.includes('https')) {
    anchor.setAttribute('target', '_blank');
  }
});

if (window.location.pathname.toLowerCase() === '/sitemap') {
  const privacySettings = document.querySelectorAll('li > a[title="Privacy Settings"]');
  if (privacySettings) {
    privacySettings.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-underscore-dangle
        window._sp_.gdpr.loadPrivacyManagerModal(772368);
      });
    });
  }
}
