/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (
  url
) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://player.vimeo.com/video/${video}${suffix}"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        title="Content from Vimeo" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedId = `twitter-embed-${Date.now()}`;
  let embedHTML;

  if (url.href.includes('/status/')) {
    // embed individual tweet
    embedHTML = `
      <div id="${embedId}" class="twitter-embed" style="display: flex; width: 300px; height: 497px; position: relative;">
        <blockquote class="twitter-tweet">
          <a href="${url.href}"></a>
        </blockquote>
      </div>`;
  } else {
    // embed profile timeline
    embedHTML = `
      <div id="${embedId}" class="twitter-embed" style="display: flex; width: 300px; height: 497px; position: relative;">
        <a class="twitter-timeline" data-width="300" data-height="497" href="${url.href}"></a>
      </div>`;
  }

  loadScript('https://platform.twitter.com/widgets.js', () => {
    const iframe = document.querySelector(`#${embedId} iframe`);
    if (iframe) {
      iframe.style.width = '100%';
      iframe.style.height = '100%';
    }
  });

  return embedHTML;
};

const embedDatawrapper = (url) => {
  const embedHTML = `<div style="left: 0; width: 100%; height: 100%; position: relative;">
        <iframe src="${url.href}" style="border: none; width: 100%; height: 470px;""></iframe>
            </div>`;
  return embedHTML;
};

const embedAlchemer = (url) => {
  const embedHTML = `<div style="position: relative; padding-bottom: 100%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="fullscreen";
       allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
    {
      match: ['datawrapper'],
      embed: embedDatawrapper,
    },
    {
      match: ['alchemer'],
      embed: embedAlchemer,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
