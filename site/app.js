const search = document.querySelector('#search');
if (search) {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.archive-item')];
  let category = 'All';
  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const project of projects) {
      const show = (category === 'All' || project.dataset.category === category) && project.textContent.toLocaleLowerCase().includes(query);
      project.hidden = !show;
      if (show) count++;
    }
    document.querySelector('#result-count').textContent = `${count} of ${projects.length} projects`;
    document.querySelector('#empty').hidden = count !== 0;
  }
  search.addEventListener('input', update);
  for (const button of buttons) button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    update();
  });
}
