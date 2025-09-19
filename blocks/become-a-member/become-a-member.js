// eslint-disable-next-line import/named
import { getTheTheme, render } from '../../scripts/shared.js';

/**
 * Generates an article card with the article's number, title and publish date
 * @param {Object} article The article object
 */
function createConvertrForm() {
  const theme = getTheTheme();
  let text;
  let link;

  switch (theme) {
    case 'mescomputing-com':
      // code block
      text = 'Become a Mescomputing member';
      link = 'https://membership.mescomputing.com/virtual/joinctg?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      break;
    case 'computing-co-uk':
      // code block
      text = 'Become a Computing member';
      link = 'https://membership.computing.co.uk/virtual/joinctg?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'crn-de':
      text = 'Werden Sie CRN-Mitglied';
      link = 'https://membership.crn.de/virtual/joinCRNDE?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'channelweb-co-uk':
      text = 'Become a CRN member';
      link = 'https://membership.channelweb.co.uk/virtual/joincrn?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'crn-asia':
      text = 'Become a CRN Asia subscriber for FREE';
      link = 'https://membership.crnasia.com/virtual/joincrna?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'crn-australia':
      text = 'Become a CRN Australia subscriber for FREE';
      link = 'https://membership.crn.com.au/virtual/joinCRNANZ?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    case 'computing-de':
      text = 'Werden Sie Computing-Mitglied';
      link = 'https://membership.computingdeutschland.de/virtual/joinCTGDE?WYVtc=homebuttonjoin&WYVtcTypeID=16';
      break;
    default:
    // code block
  }

  return render(`
      <span></span>
       <a href="${link}">
          ${text}
       </a>
    `);
}

export default function decorate(block) {
  block.append(createConvertrForm(block));
}
