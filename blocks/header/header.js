import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getUserId, getUserName, isGated, isLoggedIn, logout } from '../../scripts/authentication/helpers.js';
import { getTheTheme, updateHostname } from '../../scripts/shared.js';
import { getUserWebsiteActivityStartData, getUserWebsiteActivityEndData } from '../../scripts/authentication/apiClient.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 769px)');
function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

const toggleMobile = (mobileMenu) => {
  const ariaCurrentState = mobileMenu.getAttribute('aria-expanded');
  const ariaNewState = ariaCurrentState === 'true' ? 'false' : 'true';
  mobileMenu.setAttribute('aria-expanded', ariaNewState);
  if (mobileMenu.hasAttribute('id')) {
    const navDrop = mobileMenu.querySelectorAll('.nav-drop');
    navDrop.forEach((item) => {
      if (item.getAttribute('aria-expanded') === 'true') {
        item.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (mobileMenu.hasAttribute('expanded')) {
    const expandedCurrentState = mobileMenu.getAttribute('expanded');
    const expandedNewState = expandedCurrentState === 'true' ? 'false' : 'true';
    mobileMenu.setAttribute('expanded', expandedNewState);
  }
};

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  // nav.querySelector('.dropdown-search').setAttribute('aria-expanded', false);

  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function getTheme() {
  let theme;
  if (
    getTheTheme() === 'crn-de' ||
    window.location.href.includes('localhost:3012') ||
    window.location.href.includes('crn-de') ||
    window.location.href.includes('crn.de')
  ) {
    theme = 'crn-de';
  } else if (
    getTheTheme() === 'mescomputing-com' ||
    window.location.href.includes('localhost:3010') ||
    window.location.href.includes('mescomputing-com') ||
    window.location.href.includes('mescomputing.com')
  ) {
    theme = 'mescomputing-com';
  } else if (
    getTheTheme() === 'computing-de' ||
    window.location.href.includes('localhost:3016') ||
    window.location.href.includes('computing-de') ||
    window.location.href.includes('computingdeutschland.de')
  ) {
    theme = 'computing-de';
  } else if (
    getTheTheme() === 'computing-co-uk' ||
    window.location.href.includes('localhost:3011') ||
    window.location.href.includes('computing-co-uk') ||
    window.location.href.includes('computing.co.uk')
  ) {
    theme = 'computing-co-uk';
  } else if (
    getTheTheme() === 'crn-asia' ||
    window.location.href.includes('localhost:3014') ||
    window.location.href.includes('crn-asia') ||
    window.location.href.includes('crnasia.com')
  ) {
    theme = 'crn-asia';
  } else if (
    getTheTheme() === 'crn-australia' ||
    window.location.href.includes('localhost:3015') ||
    window.location.href.includes('crn-australia') ||
    window.location.href.includes('crn.com.au') ||
    window.location.href.includes('crnaustralia.com')
  ) {
    theme = 'crn-australia';
  } else if (
    getTheTheme() === 'channelweb-co-uk' ||
    window.location.href.includes('localhost:3013') ||
    window.location.href.includes('channelweb-co-uk') ||
    window.location.href.includes('channelweb.co.uk')
  ) {
    theme = 'channelweb-co-uk';
  }
  return theme;
}

function getSearchTextHeaderByTheme() {
  let searchText;
  switch (getTheme()) {
    case 'mescomputing-com':
      searchText = 'Search MES Computing';
      break;
    case 'computing-co-uk':
      searchText = 'Search Computing';
      break;
    case 'channelweb-co-uk':
      searchText = 'Search Channel Web';
      break;
    case 'crn-de':
      searchText = 'In CRN Deutschland suchen';
      break;
    case 'computing-de':
      searchText = 'In Computing Deutschland suchen';
      break;
    case 'crn-asia':
      searchText = 'Search CRN Asia';
      break;
    case 'crn-australia':
      searchText = 'Search CRN Australia';
      break;
    default:
      searchText = '';
  }
  return searchText;
}

const range = document.createRange();
function render(html) {
  return range.createContextualFragment(html);
}

function isGerman() {
  let theme;
  if (
    getTheTheme() === 'crn-de' ||
    window.location.href.includes('localhost:3012') ||
    window.location.href.includes('crn-de') ||
    window.location.href.includes('crn.de')
  ) {
    theme = 'crn-de';
  }
  if (
    getTheTheme() === 'computing-de' ||
    window.location.href.includes('localhost:3016') ||
    window.location.href.includes('computing-de') ||
    window.location.href.includes('computingdeutschland.de')
  ) {
    theme = 'computing-de';
  }
  return theme;
}

function isCRNAsia() {
  let theme;
  if (
    getTheTheme() === 'crn-asia' ||
    window.location.href.includes('localhost:3014') ||
    window.location.href.includes('crn-asia') ||
    window.location.href.includes('crnasia.com')
  ) {
    theme = 'crn-asia';
  }
  return theme;
}

function isCRNAustralia() {
  let theme;
  if (
    getTheTheme() === 'crn-australia' ||
    window.location.href.includes('localhost:3015') ||
    window.location.href.includes('crn-australia') ||
    window.location.href.includes('crnaustralia.com') || 
    window.location.href.includes('crn.com.au')
  ) {
    theme = 'crn-australia';
  }
  return theme;
}

function isComputingDE() {
  let theme;
  if (
    getTheTheme() === 'computing-de' ||
    window.location.href.includes('localhost:3016') ||
    window.location.href.includes('computing-de') ||
    window.location.href.includes('computingdeutschland.de')
  ) {
    theme = 'computing-de';
  }
  return theme;
}

function createSearchDropdown(tools) {
  const search = isGerman() ? 'Hier suchen..' : 'Search here...';
  const searchDropDown = render(`
    <div class="dropdown-search">
      <div class="dropdown-search-container">
        <p>${getSearchTextHeaderByTheme()}</p>
        <button type="submit" class="button close-search-button">
              <span class="dropdown-close-icon">
                  <img src="/icons/close.svg" alt="Close icon"/>
              </span>
          </button>
        <form method="get" class='dropdown-searchform' action="/search">
          <input class="dropdown-searchbox" name="query" type="search" placeholder="${search}" required/>
          <input type="hidden" name="per_page" value="24"/>
          <input type="hidden" name="sort" value="recent"/>
          <input type="hidden" name="date" value="this_year"/>
          <button type="submit" class="button search-button">
              ${isGerman() ? 'Suche' : 'Search'}
              <span class="dropdown-serach-icon">
                  <img src="/icons/search-icon.png" alt="Search icon"/>
              </span>
          </button>
        </form>
      </div>
    </div>
  `);

  tools.append(searchDropDown);
}

function openSearch(tools, nav) {
  const searchContainer = tools.querySelector('.dropdown-search');
  const navDrop = nav.querySelectorAll('.nav-drop');
  if (searchContainer.getAttribute('aria-expanded') === 'true') {
    searchContainer.setAttribute('aria-expanded', false);
  } else {
    searchContainer.setAttribute('aria-expanded', true);
  }

  if (isDesktop.matches) {
    navDrop.forEach((item) => {
      item.setAttribute('aria-expanded', 'false');
    });
  } else {
    nav.setAttribute('aria-expanded', 'false');
  }
}

function closeSearch(tools) {
  const searchContainer = tools.querySelector('.dropdown-search');
  searchContainer.setAttribute('aria-expanded', false);
}

function toggleSearch(nav) {
  const search = nav.querySelector('.dropdown-search');
  search.setAttribute('aria-expanded', 'false');
}

function getJoinLink() {
  let link;
  switch (getTheme()) {
    case 'mescomputing-com':
      link = 'https://membership.mescomputing.com/virtual/joinctg?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      break;
    case 'computing-co-uk':
      link = 'https://membership.computing.co.uk/virtual/joinctg?WYVtc=homebuttonjoin&WYVtcTypeID=16&utm_source=CTGwebsite&utm_medium=weblink&utm_campaign=join_button';
      break;
    case 'channelweb-co-uk':
      link = 'https://membership.channelweb.co.uk/virtual/joincrn?WYVtc=homebuttonjoin&WYVtcTypeID=16&utm_source=channelweb&utm_medium=channelweb&utm_campaign=join%20button';
      break;
    case 'crn-de':
      link = 'https://membership.crn.de/virtual/joinCRNDE?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'computing-de':
      link = 'https://membership.computingdeutschland.de/virtual/joinCTGDE?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'crn-asia':
      link = 'https://membership.crnasia.com/virtual/joincrna?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'crn-australia':
      link = 'https://membership.crn.com.au/virtual/joinCRNANZ?utm_source=header_subscribe_button&utm_medium=website';
      break;
    default:
      link = '';
  }

  return link;
}
function createLoginBar(navBrand) {
  const isLogged = isLoggedIn();
  const html = render(`
    <div class="login-bar">
        ${
          isLogged && isGated()
            ? `
          <div class="logged-bar">
             <span class="logged-user-icon">
               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 20.5C19.0376 20.5 21.5 18.0376 21.5 15C21.5 11.9624 19.0376 9.5 16 9.5C12.9624 9.5 10.5 11.9624 10.5 15C10.5 18.0376 12.9624 20.5 16 20.5Z" fill="#003049"/>
                <path d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9961 12.5534 27.6252 9.24905 25.1881 6.81192C22.751 4.37479 19.4466 3.0039 16 3ZM24.2198 23.3013C23.417 22.1382 22.376 21.1593 21.1659 20.4294C19.7744 21.7584 17.9242 22.5 16 22.5C14.0758 22.5 12.2256 21.7584 10.8341 20.4294C9.624 21.1593 8.58299 22.1382 7.78022 23.3013C6.37085 21.7165 5.44966 19.7581 5.12757 17.6619C4.80548 15.5657 5.09623 13.4211 5.9648 11.4863C6.83337 9.55148 8.24273 7.90903 10.0232 6.75669C11.8036 5.60436 13.8792 4.99127 16 4.99127C18.1208 4.99127 20.1964 5.60436 21.9768 6.75669C23.7573 7.90903 25.1666 9.55148 26.0352 11.4863C26.9038 13.4211 27.1945 15.5657 26.8724 17.6619C26.5503 19.7581 25.6291 21.7165 24.2198 23.3013Z" fill="#003049"/>
              </svg>
            </span>
             <p>${getUserName()}</p>
             <ul class="header-tools-content individual">
                <li>
                  <ul class="user-menu">
                    <li><a class="account-user-link" title="Newsletters" href="/manage-account">
                    <span>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 20.5C19.0376 20.5 21.5 18.0376 21.5 15C21.5 11.9624 19.0376 9.5 16 9.5C12.9624 9.5 10.5 11.9624 10.5 15C10.5 18.0376 12.9624 20.5 16 20.5Z" fill="#fff"/>
                        <path d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9961 12.5534 27.6252 9.24905 25.1881 6.81192C22.751 4.37479 19.4466 3.0039 16 3ZM24.2198 23.3013C23.417 22.1382 22.376 21.1593 21.1659 20.4294C19.7744 21.7584 17.9242 22.5 16 22.5C14.0758 22.5 12.2256 21.7584 10.8341 20.4294C9.624 21.1593 8.58299 22.1382 7.78022 23.3013C6.37085 21.7165 5.44966 19.7581 5.12757 17.6619C4.80548 15.5657 5.09623 13.4211 5.9648 11.4863C6.83337 9.55148 8.24273 7.90903 10.0232 6.75669C11.8036 5.60436 13.8792 4.99127 16 4.99127C18.1208 4.99127 20.1964 5.60436 21.9768 6.75669C23.7573 7.90903 25.1666 9.55148 26.0352 11.4863C26.9038 13.4211 27.1945 15.5657 26.8724 17.6619C26.5503 19.7581 25.6291 21.7165 24.2198 23.3013Z" fill="#fff"/>
                      </svg>
                     </span>
                    ${isGerman() ? 'Mein Konto' : 'My account'}</a>
                    </li>
                    <li>
                      <a class="sign-out-user-link" title="Sign out" href="#">
                          <span>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M27.7108 15.2929L22.4608 10.0429C22.2733 9.85534 22.0189 9.74999 21.7537 9.75C21.4885 9.75001 21.2341 9.85538 21.0466 10.0429C20.859 10.2305 20.7537 10.4848 20.7537 10.7501C20.7537 11.0153 20.8591 11.2696 21.0466 11.4572L24.5895 15H13C12.7348 15 12.4804 15.1054 12.2929 15.2929C12.1054 15.4805 12 15.7348 12 16C12 16.2652 12.1054 16.5196 12.2929 16.7071C12.4804 16.8947 12.7348 17 13 17H24.5895L21.0466 20.5429C20.9538 20.6357 20.8801 20.746 20.8298 20.8673C20.7796 20.9886 20.7537 21.1187 20.7537 21.25C20.7537 21.5152 20.859 21.7696 21.0466 21.9571C21.2341 22.1447 21.4885 22.25 21.7537 22.25C22.0189 22.2501 22.2733 22.1447 22.4608 21.9572L27.7108 16.7072C27.8983 16.5196 28.0037 16.2653 28.0037 16C28.0037 15.7348 27.8983 15.4804 27.7108 15.2929Z" fill="#ffffff"/>
                              <path d="M15 26H6V6H15C15.2652 6 15.5196 5.89464 15.7071 5.70711C15.8946 5.51957 16 5.26522 16 5C16 4.73478 15.8946 4.48043 15.7071 4.29289C15.5196 4.10536 15.2652 4 15 4H6C5.46975 4.00061 4.9614 4.21151 4.58646 4.58646C4.21151 4.9614 4.00061 5.46975 4 6V26C4.00061 26.5302 4.21151 27.0386 4.58646 27.4135C4.9614 27.7885 5.46975 27.9994 6 28H15C15.2652 28 15.5196 27.8946 15.7071 27.7071C15.8946 27.5196 16 27.2652 16 27C16 26.7348 15.8946 26.4804 15.7071 26.2929C15.5196 26.1054 15.2652 26 15 26Z" fill="#ffffff"/>
                            </svg>
                          </span>
                      ${isGerman() ? 'Ausloggen' : 'Sign out'}
                      </a>
                    </li>
                  </ul>
                </li>
             </ul>
          </div>`
            : ''
        }

        ${
          !isLogged && isGated() && !isCRNAsia() && !isCRNAustralia()
            ? `
          <div class="log-in-bar">
             <button class="sign-in"><a href="/userlogin">${isGerman() ? 'Einloggen' : 'Sign in'}</a></button>
             <button class="join"><a href="${getJoinLink()}">${isGerman() ? 'Anmelden' : 'Join'}</a></button>
          </div>`
            : ''
        }

        ${
          !isLogged && isGated() && isCRNAsia()
            ? `
          <div class="log-in-bar">
             <button class="sign-in"><a href="/userlogin">${isGerman() ? 'Einloggen' : 'Sign in'}</a></button>
             <button class="join"><a href="${getJoinLink()}">${isGerman() ? 'Anmelden' : 'Subscribe'}</a></button>
          </div>`
            : ''
        }

         ${
          !isLogged && isGated() && isCRNAustralia()
            ? `
          <div class="log-in-bar">
             <button class="sign-in"><a href="/userlogin">${isGerman() ? 'Einloggen' : 'Sign in'}</a></button>
             <button class="join"><a href="${getJoinLink()}">${isGerman() ? 'Anmelden' : 'Subscribe'}</a></button>
          </div>`
            : ''
        }
        
        ${
          !isLogged && !isGated() && isCRNAustralia()
            ? `
          <div class="log-in-bar">
             <button class="join"><a href="${getJoinLink()}">${isGerman() ? 'Anmelden' : 'Subscribe'}</a></button>
          </div>`
            : ''
        }

        ${
          !isLogged && !isGated() && isComputingDE()
            ? `
          <div class="log-in-bar">
             <button class="join"><a href="${getJoinLink()}">${isGerman() ? 'Anmelden' : 'Join'}</a></button>
          </div>`
            : ''
        }

    </div>
  `);
  navBrand.append(html);

  const signOut = navBrand.querySelector('.sign-out-user-link');
  signOut?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  });
  return html;
}
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('a');
  navBrand.querySelector('.button-container').removeAttribute('class');
  const search = nav.querySelector('.nav-tools');
  const iconSearch = search.querySelector('.icon-search');
  iconSearch.querySelector('img').src = isDesktop.matches ? '/icons/search-icon.png' : '/icons/search-icon-mobile.png';
  iconSearch.querySelector('img').alt = 'Search icon';
  search.querySelector('p').innerText = isGerman() ? 'Suche' : 'Search';
  search.querySelector('div').append(iconSearch);
  const tools = document.createElement('div');
  tools.classList.add('menu-right-tools');
  brandLink.classList.remove('button');
  brandLink.classList.add('nav-brand-link');
  brandLink.setAttribute('title', 'Navigate to homepage');
  const brandImg = navBrand.querySelector('picture');
  const logoImg = brandImg.querySelector('img');
  logoImg.alt = `${getTheme()} logo image`;
  block.querySelector('div').remove();
  brandLink.innerHTML = '';
  brandLink.append(brandImg);

  createLoginBar(navBrand);

  const navSections = nav.querySelector('.nav-sections');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  tools.append(search);
  createSearchDropdown(tools);

  if (getTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
    const textSection = navWrapper.querySelectorAll('.section')[2];
    navWrapper.append(textSection);
  }

  const closeButton = tools.querySelector('.close-search-button');
  closeButton.addEventListener('click', () => closeSearch(tools));
  tools.querySelector('.nav-tools').addEventListener('click', () => openSearch(tools, nav));
  nav.append(tools);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    toggleSearch(nav);
  });

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => {
    toggleMobile(nav, navSections);
    tools.querySelector('.dropdown-search').setAttribute('aria-expanded', false);
  });
  nav.append(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);

  function addClassToListItems(element) {
    element.querySelectorAll('li').forEach((li) => {
      // Add class based on the li content
      li.className = li.textContent.trim().replace(/\s+/g, '-');
  
      // If the li has a nested ul, apply the function recursively
      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        addClassToListItems(nestedUl);
      }
    });
  }
  
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul').forEach((ul) => {
      addClassToListItems(ul);
    });
  
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', (event) => {
        tools.querySelector('.dropdown-search').setAttribute('aria-expanded', false);
        if (event.target.classList.contains('nav-drop') || event.target.parentElement.classList.contains('nav-drop')) {
          event.preventDefault();
        }
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        } else {
          const closestLi = event.target.closest('li');
          toggleMobile(closestLi);
        }
      });
    });
  }
  
  document.addEventListener('click', (event) => {
    const searchBlock = block.querySelector(`.dropdown-search[aria-expanded='true']`);
    const navTools = tools.querySelector('.nav-tools');
    const containingElement = navTools.contains(event.target);
    const searchButton = block.querySelector('.dropdown-search .search-button');
    const searchInput = block.querySelector('.dropdown-search .dropdown-searchbox');
    const header = block.querySelector(`header li[aria-expanded='true']`);

    if (searchBlock && !containingElement) {
      const outsideOfSearchClick = !searchBlock.contains(event.target);
      if (outsideOfSearchClick || (!searchButton.contains(event.target) && !searchInput.contains(event.target))) {
        closeSearch(tools);
      }
    }

    if (header) {
      const outsideClick = !header.contains(event.target);
      if (outsideClick) {
        toggleMenu(nav, navSections, isDesktop.matches);
      }
    }
  });

  // function to set target="_blank" for all links in a given section
  function setTargetBlankForSection(navigation, sectionSelector, sectionText) {
    const navItems = navigation.querySelectorAll(sectionSelector);
    let targetNav = null;
    navItems.forEach((item) => {
      if (item.textContent.trim().includes(sectionText)) {
        targetNav = item;
      }
    });

    if (targetNav) {
      const links = targetNav.querySelectorAll('a');
      links.forEach((link) => {
        link.setAttribute('target', '_blank');
      });
    }
  }

  // function to set target="_blank" link
  function setTargetBlankForLink(navigation, linkSelector, sectionText) {
    const link = navigation.querySelector(linkSelector);
    if (link) {
      if (link.textContent.trim().includes(sectionText)) {
        link.setAttribute('target', '_blank');
      }
    }
  }

  setTargetBlankForLink(nav, '.nav-sections > div > ul > li:nth-child(6) a', 'Community');

  setTargetBlankForSection(nav, '.nav-sections > div > ul > li:nth-child(8) > ul > li:nth-child(4)', 'Global');

  setTargetBlankForSection(
    nav,
    '.nav-sections > div > ul > li:nth-child(8) > ul > li:nth-child(3)',
    'The Channel Company'
  );
  tools.append(hamburger);

  createLoginBar(navSections);
  block.append(navWrapper);
  updateHostname(block);

  const signIn = document.querySelector('.sign-in');

  const navDrop = document.querySelectorAll('.nav-drop');

  navDrop.forEach((item) => {
    const ul = item.querySelectorAll('ul');
    if (ul.length > 2) {
      item.classList.add('multiple-list');
    }
  });

  signIn?.addEventListener('click', () => {
    const url = window.location.href;
    sessionStorage.setItem('prev_url', url);
  });
}

// Combined escape function
function WyvernHtmlEscape(str, isKeyword = false) {
  const replacements = {
      '&': '*20', '#': '*25', '?': '*26', '/': '*27', '"': '*21', "'": '*22',
      '<': '*23', '>': '*24', '{': '*28', '}': '*29', ',': isKeyword ? '|' : '*30',
      ':': '*31', '[': '*32', ']': '*33', '+': '*34'
  };
  return String(str).replace(/[&?#/"'<>{},:[\]+]/g, match => replacements[match]);
}

let userInfo;

async function fetchUserId() {
  userInfo = await getUserId(); 
  return userInfo;
}

function WyvernGetWebsiteActivity(userID, action) {
  const { hostname: host, href: path, protocol } = window.location;
  const titleMetadata = document.title;
  let tagMetadata = getMetadata('tag') || '';
  if (tagMetadata) {
      tagMetadata = tagMetadata.replace(/, /g, "|");
  }
  const fullUrl = `${protocol}//${host}`;
  const fullhost = WyvernHtmlEscape(fullUrl);

  if (action === 'Start') {
    console.log('STARTaction: ',action);
      getUserWebsiteActivityStartData(userID, fullhost, WyvernHtmlEscape(path), WyvernHtmlEscape(titleMetadata), WyvernHtmlEscape(tagMetadata, true));
  } else if (action === 'Stop') {
    console.log('STOP action: ',action);
      getUserWebsiteActivityEndData(userID, fullhost, WyvernHtmlEscape(path), WyvernHtmlEscape(titleMetadata), WyvernHtmlEscape(tagMetadata, true));
  }
}

// Define userID in a scope accessible to both event listeners
let userID;
console.log('getTheme()', getTheme());
if (!(getTheme() === 'mescomputing-com' || getTheTheme() === 'computing-de')) {
if (window.location.pathname !== "/userlogin") {
  // Code to run after the DOM is fully loaded
  (async () => {
    try {
        userID = await fetchUserId();
        console.log("userID: ",userID);
        if (userID != null && userID !== 0) {        
            WyvernGetWebsiteActivity(userID, 'Start');        
        }
    } catch (error) {
        console.error('User not logged in:', error);
    }
  })();
}
  // Listener for when the user exits the webpage
  if (window.location.pathname !== "/userlogin") {
  window.addEventListener('beforeunload', () => {
    (async () => {
      try {
          userID = await fetchUserId();
          console.log("userID: ",userID);
          if (userID != null && userID !== 0) {        
            WyvernGetWebsiteActivity(userInfo, 'Stop');       
          }
      } catch (error) {
          console.error('User not logged in:', error);
      }
    })();    
  });
  }
}
