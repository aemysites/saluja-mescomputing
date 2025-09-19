/**
 * Adds classes to paragraphs in the author profile block.
 * Author info comes in paragraphs without any attributes and
 * not all authors have the same amount of paragraphs.
 */
function addParagraphsClasses(authorWrapper) {
  const paragraphs = authorWrapper.querySelectorAll('p');
  paragraphs.forEach((p) => {
    if (p.querySelector('picture')) {
      p.classList.add('author-image');
    }

    if (p.textContent.length > 0 && p.textContent.length < 30) {
      if (p.textContent.toLowerCase() !== 'follow') {
        p.classList.add('author-position');
      }
    }

    const authorName = document.querySelector('meta[name="author"]')?.getAttribute('content');
    if (p.textContent.length > 30 || p.textContent.toLowerCase().includes(authorName?.toLowerCase())) {
      p.classList.add('author-about');
    }

    if (p.textContent.toLowerCase() === 'follow') {
      p.classList.add('author-follow');
    }
  });
}

/**
 * Adds classes to social media links in the author profile block.
 * Uses the href attribute to determine the social media type.
 */
function addSocialMediaClasses(authorWrapper) {
  const socialWrapper = authorWrapper.querySelector('ul');
  if (!socialWrapper) {
    return;
  }

  const socialLinks = socialWrapper.querySelectorAll('li');
  socialLinks.forEach((item) => {
    const link = item.querySelector('a');
    link.textContent = '';

    if (!link.target) {
      link.setAttribute('target', '_blank');
    }

    if (link.href.includes('twitter')) {
      link.classList.add('author-twitter');
    } else if (link.href.includes('linkedin')) {
      link.classList.add('author-linkedin');
    } else if (link.href.includes('facebook')) {
      link.classList.add('author-facebook');
    } else if (link.href.includes('whatsapp')) {
      link.classList.add('author-whatsapp');
    } else if (link.href.includes('mail')) {
      link.classList.add('author-mail');
    }
  });
}

export default function decorate(block) {
  const authorWrapper = document.querySelector('h1').parentElement;
  document.querySelector('h1').setAttribute('id', 'author-profile');

  const authorSection = authorWrapper.parentElement;
  addParagraphsClasses(authorWrapper);
  addSocialMediaClasses(authorWrapper);
  block.appendChild(authorSection);
}
