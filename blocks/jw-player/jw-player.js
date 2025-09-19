import { loadScript } from '../../scripts/aem.js';

function getPlayerId(block) {
  const playerIdElement = block.querySelector('.jw-player > div > div:nth-child(2)');
  const playerId = playerIdElement ? playerIdElement.textContent : null;
  return playerId;
}

function loadVideoLibrary(block, playerId) {
  if (block.getAttribute('data-video-status') === 'loaded') {
    return;
  }
  loadScript(`https://content.jwplatform.com/players/${playerId}.js`);
  block.setAttribute('data-video-status', 'loaded');
}

export default async function decorate(block) {
  const playerId = getPlayerId(block);
  block.innerHTML = `
    <div
    id="botr_${playerId}_SLy4o1M2Qg8u8NEzopA4_div"
    class="jwplayer jw-reset jw-state-idle jw-stretch-uniform jw-breakpoint-3 jw-floating-dismissible jw-keep-thumbnail jw-flag-user-inactive"
    tabindex="0"
    aria-label="Video Player"
    role="application"
    aria-describedby="jw-botr_${playerId}_SLy4o1M2Qg8u8NEzopA4_div-shortcuts-tooltip-explanation"
    style="width: 576px; height: 320px"
    ></div>
    `;

  const options = {
    root: null,
    rootMargin: '20%',
    threshold: 1.0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadVideoLibrary(block, playerId);
        observer.unobserve(block);
      }
    });
  }, options);

  observer.observe(block);
}
