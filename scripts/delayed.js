/* eslint-disable no-undef */
/* eslint-disable no-new */
/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import { sampleRUM, loadScript, fetchPlaceholders } from './aem.js';

const website = document.querySelector('meta[name="theme"]').content;

/**
 * Builds an ad HTML for the given ad position and site name.
 * @param {String} [adPosition] Location of ad on the page.
 * @param {String} [siteName] Name of the site matched by the 'theme' meta tag.
 * @returns {HTMLElement} The ad HTML.
 */
function buildAd(adPosition, siteName) {
  const ads = {
    topAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Top_Leader-->
        <div id="unit-1681500941341" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Top_Leader-->
        <div id="unit-1668528913695" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Top_Leader-->
        <div id="unit-1668456862043" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Top_Leader-->
        <div id="unit-1681482061568" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_Top_Leader-->
        <div id="unit-1676308594193" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Top_Leader-->
        <div id="unit-1726868243212" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Top_Leader-->
        <div id="unit-1734631582905" class="tmsads"></div>`,
    },
    bottomAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_In_Content_1-->
        <div id="unit-1681495188993" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_In_Content_1-->
        <div id="unit-1668528651432" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_In_Content_1-->
        <div id="unit-1668456793489" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_In_Content_1-->
        <div id="unit-1681481831587" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_In_Content_1-->
        <div id="unit-1676308704049" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_In_Content_1-->
        <div id="unit-1726867623376" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_In_Content_1-->
        <div id="unit-1734461375361" class="tmsads"></div>`,
    },
    bottomBannerAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_In_Content_2-->
        <div id="unit-1681500249239" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_In_Content_2-->
        <div id="unit-1668528724835" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_In_Content_2-->
        <div id="unit-1668456809490" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_In_Content_2-->
        <div id="unit-1681481897411" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_In_Content_2-->
        <div id="unit-1676308844193" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_In_Content_2-->
        <div id="unit-1726867673947" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_In_Content_2-->
        <div id="unit-1734462375537" class="tmsads"></div>`,
    },
    rightSidebarAd1: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Right_Sidebar_1-->
        <div id="unit-1681501041716" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Right_Sidebar_1-->
        <div id="unit-1668528957828" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Right_Sidebar_1-->
        <div id="unit-1668462410463" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Right_Sidebar_1-->
        <div id="unit-1681482153923" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_Right_Sidebar_1-->
        <div id="unit-1676308801761" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Right_Sidebar_1-->
        <div id="unit-1726869230060" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Right_Sidebar_1-->
        <div id="unit-1734632287182" class="tmsads"></div>`,
    },
    rightSidebarAd2: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Right_Sidebar_2-->
        <div id="unit-1681501063770" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Right_Sidebar_2-->
        <div id="unit-1668528989092" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Right_Sidebar_2-->
        <div id="unit-1668462434151" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Right_Sidebar_2-->
        <div id="unit-1681482184203" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_Right_Sidebar_2-->
        <div id="unit-1676308817698" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Right_Sidebar_2-->
        <div id="unit-1726869350570" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Right_Sidebar_2-->
        <div id="unit-1734632342101" class="tmsads"></div>`,
    },
    mobileStickyAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Mobile_Sticky-->
        <div id="unit-1705587670475" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Footer_Sticky-->
        <div id="unit-1668528591483" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Footer_Sticky-->
        <div id="unit-1668456709036" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Footer_Sticky-->
        <div id="unit-1731617204974" class="tmsads"></div>`,
      'compting-de': `
       <!-- /21804213519/computing_germany/Ros_Ribbon-->
       <div id="unit-1757010659848" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Mobile_Sticky-->
        <div id="unit-1726868196799" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Mobile_Sticky-->
        <div id="unit-1734631317032" class="tmsads"></div>`,
    },
    wallpaperAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Wallpaper-->
        <div id="unit-1681501021303" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Wallpaper-->
        <div id="unit-1695068322430" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Wallpaper-->
        <div id="unit-1690908580614" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Wallpaper-->
        <div id="unit-1681482126532" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_Wallpaper-->
        <div id="unit-1677693937342" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Wallpaper-->
        <div id="unit-1726869546220" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Wallpaper-->
        <div id="unit-1734632413529" class="tmsads"></div>`,
    },
    nativeAd: {
      'mescomputing-com': `
        <!-- /21804213519/computing_US/Ros_Native-->
        <div id="unit-1681501009107" class="tmsads"></div>`,
      'channelweb-co-uk': `
        <!-- /21804213519/channelweb.co.uk/Ros_Native-->
        <div id="unit-1696350424134" class="tmsads"></div>`,
      'computing-co-uk': `
        <!-- /21804213519/computing.co.uk/Ros_Native-->
        <div id="unit-1690908557412" class="tmsads"></div>`,
      'crn-de': `
        <!-- /21804213519/channelweb-german/Ros_Native-->
        <div id="unit-1681482111352" class="tmsads"></div>`,
      'computing-de': `
        <!-- /21804213519/computing_germany/Ros_Native-->
        <div id="unit-1677694717800" class="tmsads"></div>`,
      'crn-asia': `
        <!-- /21804213519/CRN_Asia/Ros_Native-->
        <div id="unit-1726869193014" class="tmsads"></div>`,
      'crn-australia': `
        <!-- /21804213519/CRN_Australia/Ros_Native-->
        <div id="unit-1734632030816" class="tmsads"></div>`,
    },
  };

  if (ads[adPosition] && Object.prototype.hasOwnProperty.call(ads[adPosition], siteName)) {
    return ads[adPosition][siteName];
  }

  return '';
}

// add more delayed functionality here
function buildTopAd() {
  const topAdHTML = buildAd('topAd', website);
  const range = document.createRange();
  const topAdEl = range.createContextualFragment(topAdHTML);
  const topAdContainer = document.querySelector('.top-ad-container');
  if (topAdContainer) {
    topAdContainer.appendChild(topAdEl);
  }
}

function buildRightAd(main) {
  const curtainAdHTML = `
        <div class="right-ad">
          ${buildAd('rightSidebarAd1', website)}
        </div>
        `;
  const range = document.createRange();
  const rightAdEl = range.createContextualFragment(curtainAdHTML);
  const rightAdContainer = main.querySelector('.right-section');
  if (rightAdContainer) {
    rightAdContainer.appendChild(rightAdEl);
  }
}

function buildNativeAd(main) {
  const curtainNativeHTML = `
        <div class="native-ad">
          ${buildAd('nativeAd', website)}
        </div>
        `;
  const range = document.createRange();
  const nativeAdEl = range.createContextualFragment(curtainNativeHTML);
  const nativeAdContainer = main.querySelector('.article-pagination');
  if (nativeAdContainer) {
    nativeAdContainer.appendChild(nativeAdEl);
  }
}

function buildRankedRightAd(main) {
  const curtainAdHTML = `
        <div class="right-ad">
          ${buildAd('rightSidebarAd2', website)}
        </div>
        `;
  const range = document.createRange();
  const rightAdEl = range.createContextualFragment(curtainAdHTML);
  let rightAd2DivCheck = main.querySelector('.right-ranked-section');
  if (!rightAd2DivCheck) {
    rightAd2DivCheck = main.querySelector('.right-cs-section');
  }
  const rightAdContainer = rightAd2DivCheck;
  if (rightAdContainer) {
    rightAdContainer.appendChild(rightAdEl);
  }
}

function buildCSRightAd(main) {
  const curtainAdHTML = `
        <div class="right-ad">
          <div id="unit-1681501063770" class="tmsads">
        </div>
        `;
  const range = document.createRange();
  const rightAdEl = range.createContextualFragment(curtainAdHTML);
  const rightAdContainer = main.querySelector('.right-cs-section');
  if (rightAdContainer) {
    rightAdContainer.appendChild(rightAdEl);
  }
}

/**
 * Loads the bottom ad.
 * @returns {Promise} Resolves when the ad is loaded.
 */
function buildBottomAd(main) {
  const bottomAdHTML = `
      <div class="bottom-ad">
        ${buildAd('bottomAd', website)}
      </div>
      `;
  const range = document.createRange();
  const bottomAdEl = range.createContextualFragment(bottomAdHTML);
  const bottomAdContainer = main.querySelector('.bottom-section');
  if (bottomAdContainer) {
    bottomAdContainer.appendChild(bottomAdEl);
  }
}

function buildBottomBannerAd(main) {
  const bottomBannerAdHTML = `
      <div class="bottom-banner-ad">
        ${buildAd('bottomBannerAd', website)}
      </div>
      `;
  const range = document.createRange();
  const bottomBannerAdEl = range.createContextualFragment(bottomBannerAdHTML);
  const curtainAdContainer = main.querySelector('.bottom-banner-ad');
  if (curtainAdContainer) {
    curtainAdContainer.appendChild(bottomBannerAdEl);
  }
}

/**
 * Loads the curtain ad.
 * @returns {Promise} Resolves when the ad is loaded.
 */
function buildCurtainAds(main) {
  const curtainAdHTML = `
      <div class="curtain">
        ${buildAd('wallpaperAd', website)}
      </div>
      `;
  const range = document.createRange();
  const curtainAdEl = range.createContextualFragment(curtainAdHTML);
  const curtainAdContainer = main.querySelector('.curtain');
  if (curtainAdContainer) {
    curtainAdContainer.appendChild(curtainAdEl);
  }
}

/**
 * Loads the mobile ad.
 * @returns {Promise} Resolves when the ad is loaded.
 */
function buildMobileAds(main) {
  const mobileAdHTML = `
      <div class="mobile-ads">
        ${buildAd('mobileStickyAd', website)}
      </div>
      `;
  const range = document.createRange();
  const mobileAdEl = range.createContextualFragment(mobileAdHTML);
  const mobileAdsContainer = main.querySelector('.mobile-ads');
  if (mobileAdsContainer) {
    mobileAdsContainer.appendChild(mobileAdEl);
  }
}

// Returns site to be used in adengine script in addMartechStack function
function getSite(siteName) {
  const sites = {
    'mescomputing-com': 'computingus',
    'computing-co-uk': 'computingcouk',
    'channelweb-co-uk': 'channelwebcouk',
    'crn-de': 'channelwebgerman',
    'computing-de': 'computinggermany',
    'crn-asia': 'crnasia',
    'crn-australia': 'crnaustralia',
  };

  return sites[siteName] ?? '';
}

// Returns tms client name to be used in adengine script in addMartechStack function
function getTmsClient(siteName) {
  const clients = {
    'mescomputing-com': 'computing US',
    'computing-co-uk': 'computing.co.uk',
    'channelweb-co-uk': 'channelweb.co.uk',
    'crn-de': 'channelweb-german',
    'computing-de': 'computinggermany',
    'crn-asia': 'CRN Asia',
    'crn-australia': 'CRN Australia',
  };

  return clients[siteName] ?? '';
}

function addMartechStack() {
  // Defer the loading of the Global Ads script for 3 second - let's test zaraz

  // jc mapping keywords to ad categories june 25
  const adCategories = [];
  if (document.querySelector("meta[name='keywords']")) {
    const adKeywords = document.querySelector("meta[name='keywords']").getAttribute('content').split(', ');
    for (let i = 0; i < adKeywords.length; i += 1) {
      // eslint-disable-next-line no-console
      console.log(adKeywords[i]);
      adCategories.push(adKeywords[i]);
    }
  } else if (document.querySelector("meta[name='tag']")) {
    const adKeywords = document.querySelector("meta[name='tag']").getAttribute('content').split(', ');
    for (let i = 0; i < adKeywords.length; i += 1) {
      // eslint-disable-next-line no-console
      console.log(adKeywords[i]);
      adCategories.push(adKeywords[i]);
    }
  }
  if (document.querySelector("meta[name='companynames']")) {
    const adCompanies = document.querySelector("meta[name='companynames']").getAttribute('content').split(', ');
    for (let i = 0; i < adCompanies.length; i += 1) {
      // eslint-disable-next-line no-console
      console.log(adCompanies[i]);
      adCategories.push(adCompanies[i]);
    }
  }
  loadScript(`https://lib.tashop.co/${getSite(website)}/adengine.js`, {
    async: '',
    'data-tmsclient': `${getTmsClient(website)}`,
    'data-layout': 'ros',
    'data-debug': 'true',
    'data-targeting': JSON.stringify({ category: adCategories }),
  });
  window.TAS = window.TAS || { cmd: [] };

  // Add Adobe Analytics
  if (
    window.location.hostname.endsWith('mescomputing.com') ||
    window.location.hostname.indexOf('mescomputing-com--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/efbf0eefaeb3/launch-e9493082afe7.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('channelweb.co.uk') ||
    window.location.hostname.indexOf('channelweb-co-uk--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/687c31973248/launch-ddf10bb04d8a.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('computing.co.uk') ||
    window.location.hostname.indexOf('computing-co-uk--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/c2d4603a717d/launch-cc469565ed77.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('crn.de') ||
    window.location.hostname.indexOf('crn-de--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/de5c4b07c5de/launch-4b7802349bce.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('computingdeutschland.de') ||
    window.location.hostname.indexOf('computing-de--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/f81744889712/launch-a40965f9d69b.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('crnasia.com') ||
    window.location.hostname.indexOf('crn-asia--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/56df9d0e8d83/launch-309880a0611c.min.js', { async: '' });
  } else if (
    window.location.hostname.endsWith('crnaustralia.com') ||
    window.location.hostname.endsWith('crn.com.au') ||
    window.location.hostname.indexOf('crn-australia--thechannelcompany') > 0
  ) {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/f8dbe9dc673b/launch-8fca85b6fc00.min.js', { async: '' });
  } else {
    loadScript('https://assets.adobedtm.com/9cfdfb0dd4d0/efbf0eefaeb3/launch-e9493082afe7.min.js', { async: '' });
  }

  // Add Google Tag Manager
  loadScript('/scripts/gtm-init.js', { defer: true });
}

async function buildCompanyListing(main) {
  const p = main.querySelector('.convertr-company-listing-container > div > div > div > div > p');
  const convertrLink = main.querySelector('.convertr-company-listing-container > div > div > div > div > p > a');

  if (convertrLink) {
    const linkHref = convertrLink.getAttribute('href');
    const container = main.querySelector('.convertr-company-listing-container > div > div > div > div');

    const script = document.createElement('script');
    script.setAttribute('src', `${linkHref}`);
    script.setAttribute('type', 'text/javascript');
    p.remove();

    const wrapper = document.createElement('div');

    const options = {
      method: 'GET',
    };

    const apiUrl = `https://convertr-proxy.the-channel-company-emea-ltd.workers.dev/?url=${linkHref}`;
    const response = await fetch(apiUrl, options);
    const res = await response.text();
    wrapper.innerHTML = res;
    container.append(wrapper);
  }
}

async function enableChartBeat() {
  /* eslint-disable camelcase */
  /* eslint-disable no-multi-assign */
  /* eslint-disable no-underscore-dangle */
  const { chartbeatconfigid, chartbeatsite } = await fetchPlaceholders();
  const _sf_async_config = (window._sf_async_config = window._sf_async_config || {});
  _sf_async_config.uid = chartbeatconfigid;
  _sf_async_config.domain = chartbeatsite;
  _sf_async_config.useCanonical = true;
  _sf_async_config.useCanonicalDomain = true;
  _sf_async_config.sections = '';
  _sf_async_config.authors = '';
  function loadChartbeat() {
    const e = document.createElement('script');
    const n = document.getElementsByTagName('script')[0];
    e.type = 'text/javascript';
    e.async = true;
    e.src = '//static.chartbeat.com/js/chartbeat.js';
    n.parentNode.insertBefore(e, n);
  }
  loadChartbeat();
}

async function buildConvrtrBox(main) {
  const boxes = main.querySelectorAll('.convertr-box > div');
  // eslint-disable-next-line no-restricted-syntax
  for (const box of boxes) {
    if (box) {
      box.classList = 'convertr-box-section';
      if (!box.parentElement.classList.contains('company')) {
        const boxContent = box.querySelector('div');
        boxContent.classList = 'convertr-box-content';

        box.querySelector('div:nth-of-type(2)').classList = 'convertr-box-script';

        const linkHref = box.querySelector('.convertr-box-script a').getAttribute('href');
        const link = encodeURIComponent(linkHref);
        const options = {
          method: 'GET',
        };

        const wrapper = document.createElement('div');

        const apiUrl = `https://convertr-proxy.the-channel-company-emea-ltd.workers.dev/?url=${link}`;

        // eslint-disable-next-line no-await-in-loop
        const response = await fetch(apiUrl, options);
        // eslint-disable-next-line no-await-in-loop
        const res = await response.text();
        wrapper.innerHTML = res;
        boxContent.append(wrapper);
      }
    }
  }
}

async function loadBeyondwords(main) {
  const bwContainer = main.querySelector('.beyondwords-container');
  const bwVideoContainer = main.querySelector('.beyondwords-video-container');

  if (!bwContainer && !bwVideoContainer) {
    return;
  }

  const placeholders = await fetchPlaceholders();
  const bwProject = placeholders.beyondwordsproject;

  const insertScript = (target, playerStyle = null) => {
    const bwScript = document.createElement('script');
    bwScript.async = true;
    bwScript.defer = true;
    bwScript.src = 'https://proxy.beyondwords.io/npm/@beyondwords/player@latest/dist/umd.js';
    bwScript.onload = function () {
      const playerConfig = {
        target: this,
        projectId: bwProject,
        clientSideEnabled: true,
      };

      if (playerStyle) {
        playerConfig.playerStyle = playerStyle;
      }

      new BeyondWords.Player(playerConfig);
    };
    target.append(bwScript);
  };

  if (bwContainer) {
    insertScript(bwContainer);
  }

  if (bwVideoContainer) {
    insertScript(bwVideoContainer, 'video');
  }
}

function buildDelayedAds(main) {
  try {
    buildCompanyListing(main);
    buildConvrtrBox(main);
    buildTopAd(main);
    loadBeyondwords(main);
    buildNativeAd(main);
    buildRightAd(main);
    buildRankedRightAd(main);
    buildCSRightAd(main);
    buildBottomAd(main);
    buildBottomBannerAd(main);
    buildCurtainAds(main);
    buildMobileAds(main);
    enableChartBeat();
    addMartechStack();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Delayed Auto Blocking failed', error);
  }
}

buildDelayedAds(document.querySelector('main'));

// Auto refresh for inactivity adapted from www.crn.com -
function autoRefresh() {
  const oldLocation = window.location.toString();
  let location2 = '';

  if (
    oldLocation.indexOf('video') === -1 &&
    oldLocation.indexOf('awards-and-lists') === -1 &&
    oldLocation.indexOf('tag') === -1 &&
    oldLocation.indexOf('type') === -1
  ) {
    if (oldLocation.indexOf('?') > -1) {
      if (oldLocation.indexOf('itc=refresh') > -1) {
        location2 = oldLocation;
      } else {
        location2 = `${oldLocation}&itc=refresh`;
      }
    } else {
      location2 = `${oldLocation}?itc=refresh`;
    }
    window.location.href = location2;
  }
}
setInterval(autoRefresh, 2700000); // 45 minutes

// Core Web Vitals RUM collection
sampleRUM('cwv');
