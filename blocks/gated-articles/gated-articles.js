import { getTheTheme, render } from '../../scripts/shared.js';

function createGatedBlock() {
  const theme = getTheTheme();
  let joinUrl;
  let joinNowText;
  let title;
  let list;
  let alreadyAmember;

  switch (theme) {
    case 'mescomputing-com':
      // code block
      title = 'Join Mescomputing';
      joinUrl = 'https://membership.mescomputing.com/virtual/joinctg?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Join Now';
      list = `
          <li> Unlimited access to real-time news, analysis and opinion from the technology industry</li>
          <li>Receive important and breaking news in our daily newsletter</li>
          <li>Be the first to hear about our events and awards programmes</li>
          <li>Join live member only interviews with IT leaders at the ‘IT Lounge’; your chance to ask your burning tech questions and have them answered</li>
          <li>Access to the Computing Delta hub providing market intelligence and research</li>
          <li>Receive our members-only newsletter with exclusive opinion pieces from senior IT Leaders</li>
      `;
      alreadyAmember = 'Already a Mescomputing member?';
      break;
    case 'computing-co-uk':
      // code block
      title = 'Join Computing';
      joinUrl = 'https://membership.computing.co.uk/virtual/joinctg?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Join Now';
      list = `
          <li>Unlimited access to real-time news, analysis and opinion</li>
          <li>Receive breaking news in our daily newsletter</li>
          <li>Be the first to hear about our events and awards programmes</li>
          <li>Gain exclusive discounts to our events</li>
          <li>Receive our members-only newsletter with exclusive opinion pieces from senior IT leaders</li>
          <li>Find out about new episodes of our Ctrl Alt Lead podcast featuring interviews with leading IT professionals</li>
      `;
      alreadyAmember = 'Already a Computing member?';
      break;
    case 'crn-de':
      title = 'Kostenfrei bei CRN anmelden und weiterlesen...';
      joinUrl = 'https://membership.crn.de/virtual/joinCRNDE?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Join Now';
      list = `
        <li>Täglich den CRN Newsletter</li>
        <li>Zugriff auf alle Artikel und Inhalte</li>
        <li>Teil einer starken, weltweiten Channel Community</li>
        <li>Laufzeit zwölf Monate ohne Kosten</li>
        <li>CRN Mitglieder sind gut informiert.</li>`;
      alreadyAmember = 'Sie sind bereits CRN-Mitglied?';
      break;
    case 'computing-de':
      title = 'Kostenfrei bei Computing anmelden und weiterlesen...';
      joinUrl = 'https://membership.computingdeutschland.de/virtual/joinCTGDE?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Join Now';
      list = `
        <li>Täglich den Computing Newsletter</li>
        <li>Zugriff auf alle Artikel und Inhalte</li>
        <li>Teil einer starken, weltweiten Channel Community</li>
        <li>Laufzeit zwölf Monate ohne Kosten</li>
        <li>CRN Mitglieder sind gut informiert.</li>`;
      alreadyAmember = 'Sie sind bereits Computing-Mitglied?';
      break;
    case 'channelweb-co-uk':
      title = 'Join CRN';
      joinUrl = 'https://membership.channelweb.co.uk/virtual/joincrn?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Join Now';
      list = `
        <li>Enjoy full access to channelweb.co.uk - the UK’s top news source for the IT channel</li>
        <li>Gain the latest insights through market analysis and interviews with channel leaders</li>
        <li>Stay on top of key trends with the Insider weekly newsletter curated by CRN’s edit</li>
        <li>Be the first to hear about our industry leading events and awards programmes </li> `;
      alreadyAmember = 'Already a CRN member?';
      break;
    case 'crn-asia':
      title = `Join CRN Asia - It's Free`;
      joinUrl = 'https://membership.crnasia.com/virtual/joincrna?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Subscribe Now';
      list = `
        <li>Full access to top news and expert opinion </li>
        <li>Daily newsletter with exclusive insights </li>
        <li>Early access to events and awards</li>
        <li>Join a global community of IT professionals </li> `;
      alreadyAmember = 'Already a CRN subscriber?';
      break;
    case 'crn-australia':
      title = 'Join CRN for FREE';
      joinUrl = 'https://membership.crn.com.au/virtual/joinCRNANZ?WYVtc=24hrlockscreen&WYVtcTypeID=16';
      joinNowText = 'Subscribe Now';
      list = `
        <li>Enjoy full, free access to CRN Australia - the top news source for the IT channel</li>
        <li>Gain the latest insights through market analysis and interviews with channel leaders</li>
        <li>Stay on top of key trends with the Insider weekly newsletter curated by CRN’s edit</li>
        <li>Be the first to hear about our industry leading events and awards programmes </li> `;
      alreadyAmember = 'Already a CRN subscriber?';
      break;
    default:
    // code block
  }
  return render(`
    <div class="gated-articles-container">
        <div class="gated-articles-content">
            <p>${theme === 'crn-de' || getTheTheme() === 'computing-de' ? 'Um diesen Artikel weiter zu lesen...' : 'To continue reading this article...'} </p>
            <h4 class="gated-articles-join">${title}</h4>
            <ul>
                ${list}
            </ul>
            <button class="join-btn"><a href="${joinUrl}" target="_blank">${theme === 'crn-de' || theme === 'computing-de' ? 'Jetzt Mitglied werden' : joinNowText}</a></button>
            <h4 class="gated-articles-computing"> ${alreadyAmember}</h4>
            <button class="login-btn"><a href="/userlogin">${theme === 'crn-de' || theme === 'computing-de' ? 'Einloggen' : 'Login'}</a></button>
        </div>
    </div>
  `);
}
export default function decorate(block) {
  const gatedBlock = createGatedBlock();
  block.append(gatedBlock);
  block.querySelector('div').remove();

  const logIn = document.querySelector('.gated-articles-content .login-btn');

  logIn?.addEventListener('click', () => {
    const url = window.location.href;
    sessionStorage.setItem('prev_url', url);
  });
}
