import { getTheTheme, updateHostname } from '../../scripts/shared.js';

function setAnchorTargetBasedOnTheme() {
  const theme = getTheTheme();

  switch (theme) {
    case 'mescomputing-com':
      document
        .querySelector('.hot-topics-wrapper .hot-topics div div ul li:nth-child(2) a')
        .setAttribute('target', '_self');
      document
        .querySelector('.hot-topics-wrapper .hot-topics div div ul li:nth-child(4) a')
        .setAttribute('target', '_self');
      break;
    case 'computing-co-uk':
      for (let index = 3; index < 8; index += 1) {
        document
          .querySelector(`.hot-topics-wrapper .hot-topics div div ul li:nth-child(${index}) a`)
          .setAttribute('target', '_self');
      }
      break;
    case 'channelweb-co-uk':
      for (let index = 2; index < 5; index += 1) {
        document
          .querySelector(`.hot-topics-wrapper .hot-topics div div ul li:nth-child(${index}) a`)
          .setAttribute('target', '_self');
      }
      break;
    case 'crn-asia':
      for (let index = 4; index < 5; index += 1) {
        document
          .querySelector(`.hot-topics-wrapper .hot-topics div div ul li:nth-child(${index}) a`)
          .setAttribute('target', '_self');
      }
      break;
    case 'crn-australia':
      for (let index = 4; index < 5; index += 1) {
        document
          .querySelector(`.hot-topics-wrapper .hot-topics div div ul li:nth-child(${index}) a`)
          .setAttribute('target', '_self');
      }
      break;
    default:
  }
}

setAnchorTargetBasedOnTheme();
updateHostname(document);
