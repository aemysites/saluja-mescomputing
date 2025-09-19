import { getTheTheme } from '../../scripts/shared.js';

const articleTitle = () => {
  const title = document.querySelector('h1')?.innerText;
  return title;
};

const ArticleURL = () => window.location.pathname;

export default function decorate(block) {
  let url;
  switch (getTheTheme()) {
    case 'mescomputing-com':
      url = 'https://www.mescomputing.com';
      break;
    case 'computing-co-uk':
      url = 'https://www.computing.co.uk';
      break;
    case 'channelweb-co-uk':
      url = 'https://www.channelweb.co.uk/';
      break;
    case 'crn-de':
      url = 'https://www.crn.de/';
      break;
    case 'computing-de':
      url = 'https://www.computingdeutschland.de/';
      break;
    case 'crn-asia':
      url = 'https://www.crnasia.com/';
      break;
    case 'crn-australia':
      url = 'https://www.crn.com.au/';
      break;
    default:
      url = '';
  }

  const baseUrl = url;
  const fullUrl = `${baseUrl}${ArticleURL()}`;
  const encodedTitle = encodeURIComponent(articleTitle());

  block.innerHTML = `
    <div class="social">
      <p>${getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de' ? 'Teilen' : 'Share'}</p>
      <div class="socials">
        <ul>
          <li class="twitter">
            <a href="https://twitter.com/share?text=${encodedTitle}&url=${fullUrl}&via=computing_news" target="_blank" class="twitter-icon"></a>
          </li>
          <li class="linkedin">
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${fullUrl}&title=${encodedTitle}" target="_blank" class="linkedin-icon"></a>
          </li>
          <li class="mail">
            <a href="mailto:?subject=${encodedTitle}&body=Check out this article: ${fullUrl}" target="_blank" class="mail-icon"></a>
          </li>
          <li class="facebook">
            <a href="https://www.facebook.com/sharer.php?u=${fullUrl}" target="_blank" class="facebook-icon"></a>
          </li>
          <li class="whatsapp">
            <a href="https://api.whatsapp.com/send?text=Check out this article: ${encodeURIComponent(fullUrl)}" target="_blank" class="whatsapp-icon"></a>
          </li>
        </ul>
      </div>
    </div>
  `;
}
