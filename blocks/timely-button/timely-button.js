export default function decorate(block) {
  const timelyButton = document.createElement('div');
  timelyButton.id = 'timelyButtonDiv';
  block.append(timelyButton);

  const script = document.createElement('script');
  script.setAttribute('src', 'https://events.timely.fun/embed.js');
  script.setAttribute('id', 'timely_script');
  script.setAttribute('class', 'timely_script');
  script.setAttribute('data-src', 'https://events.timely.fun/1sth7bw7/fes');
  script.setAttribute('data-max-height', '0');
  script.setAttribute('data-fes', 'Add Event');
  document.getElementById('timelyButtonDiv').appendChild(script);
}
