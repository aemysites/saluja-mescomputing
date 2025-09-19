let gtmIdentifier = '';
if (
  window.location.hostname.endsWith('mescomputing.com') ||
  window.location.hostname.indexOf('mescomputing-com--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-PLHBNRS';
} else if (
  window.location.hostname.endsWith('channelweb.co.uk') ||
  window.location.hostname.indexOf('channelweb-co-uk--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-KZQCHJZ';
} else if (
  window.location.hostname.endsWith('computing.co.uk') ||
  window.location.hostname.indexOf('computing-co-uk--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-MMDB4RK';
} else if (
  window.location.hostname.endsWith('crnasia.com') ||
  window.location.hostname.indexOf('crn-asia--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-WDP4MWST';
} else if (
  window.location.hostname.endsWith('crnaustralia.com') ||
  window.location.hostname.endsWith('crn.com.au') ||
  window.location.hostname.indexOf('crn-australia--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-PRNL4HJK';
} else if (
  window.location.hostname.endsWith('crn.de') ||
  window.location.hostname.indexOf('crn-de--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-KFT28J5';
} else if (
  window.location.hostname.endsWith('computingdeutschland.de') ||
  window.location.hostname.indexOf('computing-de--thechannelcompany') > 0
) {
  gtmIdentifier = 'GTM-NTF53LM';
} else {
  gtmIdentifier = 'GTM-PLHBNRS';
}
// eslint-disable-next-line
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s);
  const dl = l !== 'dataLayer' ? `&l=${l}` : '';
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', gtmIdentifier);
console.log(gtmIdentifier);
