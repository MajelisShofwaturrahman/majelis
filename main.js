(function () {
  'use strict';

  /* ── Hamburger menu ── */
  const toggle = document.querySelector('.menu-toggle');
  const menu   = document.querySelector('.menu');
  toggle.addEventListener('click', () => menu.classList.toggle('active'));
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('active'))
  );

  /* ── Scroll-reveal animation ── */
  const scrollObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

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

  /* ── Qasidah: open PDF in new window on row click ── */
  document.querySelectorAll('#qosidahList .sholawat-item').forEach(item => {
    item.addEventListener('click', () => {
      const pdf = item.dataset.pdf;
      if (pdf) window.open(pdf, '_blank');
    });
  });

})();
