const config = window.LINCOLN;
const genericMessage = 'Olá, Lincoln! Vim pelo site e gostaria de planejar minha viagem por Alagoas e Pernambuco.';
document.querySelectorAll('[data-whatsapp]').forEach(a => a.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(genericMessage)}`);
document.querySelector('#year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); }
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.querySelectorAll('[data-destination]').forEach(a => a.addEventListener('click', () => { document.querySelector('#destination').value = a.dataset.destination; document.querySelector('#service').value = 'Passeios e viagens'; }));
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => document.querySelector('#service').value = a.dataset.service));
const today = new Date();
document.querySelector('#trip-date').min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelector('#trip-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const name = data.get('name').trim();
  if (!name) { form.elements.name.setCustomValidity('Informe seu nome.'); form.elements.name.reportValidity(); return; }
  const rawDate = data.get('date');
  const date = rawDate ? rawDate.split('-').reverse().join('/') : 'A combinar';
  const message = [`Olá, Lincoln! Sou ${name} e vim pelo site.`, '', `Gostaria de saber sobre: ${data.get('service')}.`, `Destino ou trajeto: ${data.get('destination').trim() || 'Quero uma sugestão'}.`, `Data prevista: ${date}.`, `Pessoas: ${data.get('people') || 'A definir'}.`, data.get('notes').trim() ? `Observações: ${data.get('notes').trim()}` : '', '', 'Pode me informar as opções, os valores e a disponibilidade?'].filter(Boolean).join('\n');
  const isEmail = e.submitter?.value === 'email';
  const url = isEmail ? `mailto:${config.email}?subject=${encodeURIComponent('Orçamento de viagem — Lincoln Turismo')}&body=${encodeURIComponent(message)}` : `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  const status = document.querySelector('#form-status');
  status.replaceChildren(document.createTextNode(isEmail ? 'Abra seu aplicativo de e-mail e envie o pedido. ' : 'Revise e envie sua mensagem no WhatsApp. '));
  const fallback = document.createElement('a'); fallback.href = url; fallback.textContent = 'Se não abriu, clique aqui.'; fallback.style.textDecoration = 'underline';
  if (!isEmail) { fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; }
  status.append(fallback);
  if (isEmail) window.location.href = url; else window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelector('[name="name"]').addEventListener('input', e => e.target.setCustomValidity(''));
const videoTitles = ['Um convite para Alagoas', 'Sol e descanso à beira-mar', 'Praia e beach club', 'Sabores pelo caminho', 'Um dia no litoral', 'Pé na areia', 'Barra de São Miguel', 'Praia dos Carneiros · Pernambuco', 'Uma parada para aproveitar', 'Um mergulho na viagem', 'Vila do Marceneiro', 'Caminhos até o mar', 'Hibiscus: um dia de sol', 'O litoral espera por você', 'Paisagens para guardar', 'Um registro no Aloha', 'Caminho para a Praia do Gunga', 'Encontros com o mar', 'Fim de tarde no litoral', 'Um novo caminho', 'Um olhar sobre o litoral', 'Dias de piscina e sol', 'Um lugar para desacelerar', 'Entre piscinas e coqueiros', 'Aproveite cada parada', 'Um passeio pelo beach club', 'Um convite a Maragogi'];
const videoOrder = [13,17,27,7,1,8,16,2,3,4,5,6,9,10,11,12,14,15,18,19,20,21,22,23,24,25,26];
const videos = videoOrder.map(n => { const id = String(n).padStart(2,'0'); return {type:'video',src:`assets/videos/video-${id}.mp4`,poster:`assets/posters/video-${id}.jpg`,title:videoTitles[n-1]}; });
const photos = [
  ['photo-01.webp','Caminho para o mar · Hibiscus'],['photo-02.webp','Dias de descanso · Hibiscus'],['photo-03.webp','Um registro no Hibiscus'],['lincoln.webp','Lincoln pelo litoral de Alagoas'],['photo-05.webp','Entre jardins e coqueiros · Aloha'],['photo-06.webp','Um dia no Aloha'],['photo-07.webp','Um novo olhar sobre o Aloha'],['photo-08.webp','Piscina, sol e paisagem · Aloha']
].map(([file,title]) => ({type:'photo',src:`assets/${file}`,poster:`assets/${file}`,title}));
let galleryType = 'videos', visibleCount = 4;
const grid = document.querySelector('#gallery-grid');
const more = document.querySelector('#gallery-more');
const mediaDialog = document.querySelector('#media-dialog');
let previousFocus;
function showDialog(dialog) { previousFocus = document.activeElement; dialog.showModal(); document.body.classList.add('modal-open'); }
function showMedia(item) {
  document.querySelector('#media-title').textContent = item.title;
  const content = document.querySelector('#media-content'); content.replaceChildren();
  const element = document.createElement(item.type === 'video' ? 'video' : 'img');
  element.src = item.src;
  if (item.type === 'video') { element.controls = true; element.playsInline = true; element.preload = 'metadata'; element.poster = item.poster; }
  else element.alt = item.title;
  content.append(element);
  document.querySelector('#media-caption').textContent = (item.title.includes('Pernambuco') ? 'Praia dos Carneiros, Pernambuco. Consulte Lincoln para incluir este destino no seu roteiro. ' : 'Registro do acervo da Lincoln Turismo. ') + 'Valores e ofertas eventualmente exibidos nos vídeos são da época da gravação. Consulte condições e disponibilidade atuais com Lincoln.';
  showDialog(mediaDialog);
}
function renderGallery() {
  const items = galleryType === 'videos' ? videos : photos;
  grid.replaceChildren();
  items.slice(0,visibleCount).forEach(item => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'gallery-item'; button.setAttribute('aria-label', `${item.type === 'video' ? 'Assistir' : 'Ampliar'}: ${item.title}`);
    const img = document.createElement('img'); img.src = item.poster; img.alt = ''; img.loading = 'lazy'; img.width = 480; img.height = 640;
    const play = document.createElement('span'); play.className = 'play'; play.textContent = item.type === 'video' ? '▶' : '↗'; play.setAttribute('aria-hidden','true');
    const label = document.createElement('span'); label.className = 'gallery-label'; const small = document.createElement('small'); small.textContent = item.type === 'video' ? 'APERTE O PLAY' : 'EXPLORE O DESTINO'; label.append(small,document.createTextNode(item.title));
    button.append(img,play,label); button.addEventListener('click', () => showMedia(item)); grid.append(button);
  });
  more.hidden = visibleCount >= items.length;
  more.style.display = more.hidden ? 'none' : 'flex';
}
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => { galleryType = button.dataset.gallery; visibleCount = 4; document.querySelectorAll('[data-gallery]').forEach(b => {b.classList.toggle('active',b === button); b.setAttribute('aria-pressed',String(b === button));}); renderGallery(); }));
more.addEventListener('click', () => { const previousCount = visibleCount; visibleCount += 8; renderGallery(); grid.children[previousCount]?.focus({preventScroll:true}); });
document.querySelector('#privacy-open').addEventListener('click', () => showDialog(document.querySelector('#privacy-dialog')));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { const video = dialog.querySelector('video'); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } document.body.classList.remove('modal-open'); previousFocus?.focus({preventScroll:true}); });
});
document.querySelector('#intro-video').addEventListener('click', () => showMedia(videos.find(item => item.src === 'assets/videos/video-01.mp4')));
renderGallery();
