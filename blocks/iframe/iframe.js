import { render } from '../../scripts/shared.js';

function embedIframe(url) {
  return render(`<iframe src="${url}" style="border: none; width: 100%;""></iframe>`);
}

export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  const content = block.querySelector('.iframe.block div div');
  const isText = content.textContent;
  const url = link || isText;
  if (url) {
    block.querySelector('.iframe.block > div').replaceWith(embedIframe(url));
  }

  const iframe = block.querySelector('iframe');
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow.document;
  let height = iframeDoc?.body.scrollHeight;
  if (!height){
    height = [...block.classList].find((el) => /[0-9]+px/.test(el));
  }
  console.log('height: ',height);
  if (height) {
    iframe.height = height;
  } else {
    iframe.height = '470px';
  }
}
