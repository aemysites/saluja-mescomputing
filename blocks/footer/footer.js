import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getTheTheme, updateHostname } from '../../scripts/shared.js';

// check if the link is external
function isExternalURL(url) {
  const theme = getTheTheme();
  const alternativeTheme = theme.replace(/-/g, '.');
  const urlOrigin = new URL(url).origin;
  const windowOrigin = window.location.origin;
  return !(
    (urlOrigin.includes(theme) || urlOrigin.includes(alternativeTheme)) &&
    (windowOrigin.includes(theme) || windowOrigin.includes(alternativeTheme))
  );
}

// function to set target="_blank" links for navigation links
function setTargetBlankForNavigation(block) {
  const firstSectionLinks = block.querySelectorAll('.footer-first-navigation ul li a');
  firstSectionLinks.forEach((link) => {
    if (isExternalURL(link.href)) {
      link.setAttribute('target', '_blank');
    }
  });
  const secondSectionLinks = block.querySelectorAll('.footer-second-navigation ul li a');
  secondSectionLinks.forEach((link) => {
    if (isExternalURL(link.href)) {
      link.setAttribute('target', '_blank');
    }
  });
}

// function to set target="_blank" links for media section
function setTargetBlankForLinks(block) {
  const links = block.querySelectorAll('.footer-media-title ul li');
  links.forEach((link) => {
    link.querySelector('a').setAttribute('target', '_blank');
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const isGerman = getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de';
  const privacySetings = isGerman
    ? block.querySelector(`a[title='Cookie-Einstellungen']`)
    : block.querySelector(`a[title='Privacy Settings']`);
  if (privacySetings) {
    privacySetings.addEventListener('click', (e) => {
      e.preventDefault();
      if (isGerman) {
        // eslint-disable-next-line no-underscore-dangle
        window._sp_.gdpr.loadPrivacyManagerModal(775268, 'purposes');
      } else {
        // eslint-disable-next-line no-underscore-dangle
        window._sp_.gdpr.loadPrivacyManagerModal(772368);
      }
    });
  }
  setTargetBlankForNavigation(block);
  setTargetBlankForLinks(block);
  updateHostname(block);

  const images = block.querySelectorAll('.footer-media-title img');
  images?.forEach((img) => {
    img.alt = 'Media image';
  });
}
