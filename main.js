(function () {
  'use strict';

  /* ── Hamburger menu ── */
  const toggle = document.querySelector('.menu-toggle');
  const menu   = document.querySelector('.menu');
  toggle.addEventListener('click', () => menu.classList.toggle('active'));
  // Close menu when a link is tapped
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('active'))
  );

  /* ── Scroll-reveal animation ── */
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ── WhatsApp share ── */
  document.getElementById('shareWhatsApp').addEventListener('click', () => {
    const text =
      `*JADWAL MAJELIS SHOFWATURRAHMAN*\n` +
      `Assalamu'alaikum,\n` +
      `Berikut informasi jadwal pengajian Majelis Shofwaturrahman.\n\n` +
      `- Lokasi:\nhttps://www.google.com/maps?q=Majelis%20Shofwaturrahman\n\n` +
      `- Detail lengkap:\nhttps://majelisshofwaturrahman.github.io/majelis/\n\n` +
      `Semoga bermanfaat dan berkah 🤲`;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  });

  /* ── Qasidah search filter ── */
  document.getElementById('qosidahSearch').addEventListener('input', function () {
    const kw = this.value.toLowerCase();
    document.querySelectorAll('#qosidahList .sholawat-item').forEach(item => {
      const title = item.querySelector('h3').textContent.toLowerCase();
      item.style.display = title.includes(kw) ? '' : 'none';
    });
  });

  /* ── Inline PDF viewer (accordion) ── */
  // Per-item state stored in a WeakMap
  const pdfState = new WeakMap();

  // Render a specific page onto the item's canvas
  function renderPage(item, pageNum) {
    const state  = pdfState.get(item);
    const canvas = item.querySelector('canvas');
    const ctx    = canvas.getContext('2d');
    const info   = item.querySelector('.pdf-page-info');
    const btnPrev = item.querySelector('.pdf-prev');
    const btnNext = item.querySelector('.pdf-next');

    state.pdf.getPage(pageNum).then(page => {
      // Scale to fill the container width nicely
      const container = canvas.closest('.pdf-canvas-scroll');
      const targetW   = Math.min(container.clientWidth || 320, 800);
      const viewport  = page.getViewport({ scale: 1 });
      const scale     = targetW / viewport.width;
      const scaled    = page.getViewport({ scale });

      canvas.width  = scaled.width;
      canvas.height = scaled.height;
      canvas.style.width  = '100%';
      canvas.style.height = 'auto';

      page.render({ canvasContext: ctx, viewport: scaled });

      state.current  = pageNum;
      info.textContent = `${pageNum} / ${state.pdf.numPages}`;
      btnPrev.disabled = pageNum <= 1;
      btnNext.disabled = pageNum >= state.pdf.numPages;
    });
  }

  // Load PDF for an item (lazy — only on first open)
  function loadPDFForItem(item) {
    const state = pdfState.get(item);
    if (state.loaded) { return; }
    state.loaded = true;

    const url = item.dataset.pdf;
    pdfjsLib.getDocument(url).promise.then(pdf => {
      state.pdf = pdf;
      renderPage(item, 1);
    }).catch(() => {
      item.querySelector('.pdf-page-info').textContent = 'Gagal memuat PDF';
    });
  }

  // Wire up each qasidah item
  document.querySelectorAll('#qosidahList .sholawat-item').forEach(item => {
    // Init state
    pdfState.set(item, { loaded: false, pdf: null, current: 1 });

    const header = item.querySelector('.sholawat-header');
    const panel  = item.querySelector('.sholawat-panel');

    // Toggle open/close on header tap
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('#qosidahList .sholawat-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.sholawat-panel').style.maxHeight = '';
      });

      if (!isOpen) {
        item.classList.add('open');
        // Set explicit maxHeight to enable CSS transition
        panel.style.maxHeight = panel.scrollHeight + 300 + 'px';
        loadPDFForItem(item);
        // Scroll item into view smoothly
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });

    // Prev / Next page buttons
    item.querySelector('.pdf-prev').addEventListener('click', e => {
      e.stopPropagation();
      const state = pdfState.get(item);
      if (state.pdf && state.current > 1) renderPage(item, state.current - 1);
    });
    item.querySelector('.pdf-next').addEventListener('click', e => {
      e.stopPropagation();
      const state = pdfState.get(item);
      if (state.pdf && state.current < state.pdf.numPages) renderPage(item, state.current + 1);
    });
  });

})();