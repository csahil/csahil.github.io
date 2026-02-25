// Infinite scroll + PDF tiles
const stream = document.getElementById('stream');
let items = [];
let cursor = 0;
const PAGE_SIZE = 18;

function boxHTML(item, index) {
  const title = item.title || 'Untitled';
  const company = item.company || item.title || '';
  const ticker = item.ticker || title;
  const bgStyle = item.img ? `style="background-image: url('${item.img}')"` : '';

  return `
  <div class="box clickable" data-index="${index}">
    <div class="screenshot" ${bgStyle}>
      <div class="text-display">
        <div class="ticker">${ticker}</div>
        <div class="company">${company}</div>
      </div>
    </div>
    <p>${title}</p>
  </div>`;
}

function renderNext() {
  const next = items.slice(cursor, cursor + PAGE_SIZE);
  if (!next.length) return;
  const html = next.map((item, i) => boxHTML(item, cursor + i)).join("");
  sentinel.insertAdjacentHTML('beforebegin', html);
  cursor += next.length;
  if (cursor >= items.length) observer.disconnect();
}

async function init() {
  try {
    const res = await fetch('data/items.json');
    items = await res.json();
    renderNext();
  } catch (e) {
    console.error('Failed to load items.json', e);
  }
}

const sentinel = document.getElementById('sentinel');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) renderNext();
  });
}, {rootMargin: '600px 0px'});

// Click handler for boxes
stream.addEventListener('click', (e) => {
  const box = e.target.closest('.box.clickable');
  if (box) {
    const index = box.dataset.index;
    window.location.href = `detail.html?id=${index}`;
  }
});

observer.observe(sentinel);
init();
