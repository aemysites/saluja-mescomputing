export default async function decorate(block) {
  const testimonials = block.querySelectorAll(':scope > div');
  const testimonialsRow = document.createElement('div');
  testimonialsRow.classList.add('testimonials-row');
  testimonialsRow.append(testimonials[1], testimonials[2]);
  block.querySelector(':scope > div:nth-child(1)').insertAdjacentElement('afterend', testimonialsRow);
}
