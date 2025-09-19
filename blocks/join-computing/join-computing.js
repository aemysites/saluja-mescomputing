export default async function decorate(block) {
  const mobileIconSrc = block.querySelector('div div h2 a').href;
  const mobileIcon = document.createElement('div');
  const mobileButton = block.querySelector('div div .button-container a');
  mobileButton.setAttribute('target', '_blank');

  mobileIcon.classList.add('join-computing-icon');
  mobileIcon.innerHTML = `<a href="${mobileIconSrc}" class="join-computing-icon-anchor"></a>`;
  block.querySelector('div div h2').insertAdjacentElement('beforebegin', mobileIcon);
  mobileButton.innerHTML += '<span class="button-extra-text"> now</span>';

  const openedMailIcon = document.createElement('span');
  openedMailIcon.classList.add('opened-mail-icon');
  openedMailIcon.innerHTML = `
    <a href="${mobileIconSrc}" class="opened-mail-icon-anchor">
    </a>`;
  block.insertAdjacentElement('afterbegin', openedMailIcon);
}
