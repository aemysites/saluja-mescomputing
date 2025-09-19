import { readBlockConfig, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  let { timelyid } = readBlockConfig(block);
  console.log('timelyid: ',timelyid);
  if (!timelyid) {
    const placeholders = await fetchPlaceholders();
    timelyid = placeholders.homepagetimely;
  }
  const script = document.createElement('script');
  script.id = 'timely_script';
  script.className = 'timely-script';
  script.src = 'https://events.timely.fun/embed.js';
//  script.setAttribute('data-src', `https://events.timely.fun/${timelyid}/`);
  script.setAttribute('data-src', `${timelyid}`);
  script.setAttribute('data-max-height', '0');

  const options = {
    root: null,
    rootMargin: '20%',
    threshold: 1.0,
  };

  // add event listener for intersection observer when block is in view port
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        block.replaceChildren(script);
        observer.unobserve(block);
      }
    });
  }, options);

  // observe the block
  observer.observe(block);
}
