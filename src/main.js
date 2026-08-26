import { advantagesData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });

  // 2. Active Link Navigation on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${sectionId}`) {
            a.classList.add('active');
          }
        });
      }
    });

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    }
  });

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Coach Carousel Slider Logic (交互式教练海报轮播)
  const coachTrack = document.getElementById('coachTrack');
  const coachPrevBtn = document.getElementById('coachPrevBtn');
  const coachNextBtn = document.getElementById('coachNextBtn');
  const coachDots = document.getElementById('coachDots');
  const coachSlides = document.querySelectorAll('.coach-slide-item');

  if (coachTrack && coachSlides.length > 0) {
    let currentIndex = 0;
    let autoPlayTimer = null;

    function getVisibleCount() {
      const width = window.innerWidth;
      if (width <= 768) return 1;
      if (width <= 1100) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, coachSlides.length - visible);
    }

    function renderDots() {
      if (!coachDots) return;
      coachDots.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(i);
        });
        coachDots.appendChild(dot);
      }
    }

    function updateSlidePosition() {
      const visible = getVisibleCount();
      const slideWidthPercent = 100 / visible;
      coachTrack.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

      const dots = coachDots ? coachDots.querySelectorAll('.carousel-dot') : [];
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    function goToSlide(index) {
      const maxIdx = getMaxIndex();
      if (index < 0) currentIndex = maxIdx;
      else if (index > maxIdx) currentIndex = 0;
      else currentIndex = index;
      updateSlidePosition();
    }

    if (coachNextBtn) {
      coachNextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
      });
    }

    if (coachPrevBtn) {
      coachPrevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    const wrapper = document.getElementById('coachCarouselWrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoPlay);
      wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch & Swipe Support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    coachTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoPlay();
    });

    coachTrack.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    coachTrack.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
      startAutoPlay();
    });

    window.addEventListener('resize', () => {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      renderDots();
      updateSlidePosition();
    });

    renderDots();
    updateSlidePosition();
    startAutoPlay();
  }

  // 4. 7大核心优势 Cards Click -> Detail Modal
  const advantageCards = document.querySelectorAll('.advantage-card');
  const detailModal = document.getElementById('detailModal');
  const detailModalBody = document.getElementById('detailModalBody');
  const closeDetailModal = document.getElementById('closeDetailModal');

  advantageCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.getAttribute('data-index');
      const item = advantagesData[idx];
      if (item && detailModal && detailModalBody) {
        detailModalBody.innerHTML = `
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${item.image}" alt="${item.title}" style="width:100%; max-height:280px; object-fit:cover; border-radius:14px; margin-bottom:16px;">
          </div>
          ${item.detailHtml}
          <div style="margin-top:24px; text-align:center;">
            <button class="btn btn-primary" id="modalAdvantageBookBtn"><i class="fa-solid fa-ticket"></i> 即刻生成该方案体验卡</button>
          </div>
        `;
        detailModal.classList.add('active');

        const modalAdvantageBookBtn = document.getElementById('modalAdvantageBookBtn');
        if (modalAdvantageBookBtn) {
          modalAdvantageBookBtn.addEventListener('click', () => {
            detailModal.classList.remove('active');
            openBookingModal();
          });
        }
      }
    });
  });

  if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
      detailModal.classList.remove('active');
    });
  }

  // 5. Room Type Filtering
  const roomFilterBtns = document.querySelectorAll('.room-filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  roomFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roomFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const roomType = btn.getAttribute('data-room');

      roomCards.forEach(card => {
        const cardType = card.getAttribute('data-room-type');
        if (roomType === 'all' || cardType === roomType) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Lightbox Viewer for Full Images & Gallery
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  const clickableImgElements = document.querySelectorAll('.resort-gallery-item, .room-card, .office-card, .coach-card, .trainee-img-wrapper');

  clickableImgElements.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

      const img = item.querySelector('img');
      const captionText = item.querySelector('h3, h4, p') ? item.querySelector('h3, h4, p').innerText : '';
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.innerText = captionText;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 7. Interactive BMI & Weight Loss Calculator
  const bmiForm = document.getElementById('bmiForm');
  const calcResultBox = document.getElementById('calcResultBox');
  const resultContent = document.getElementById('resultContent');
  const resultPlaceholder = document.querySelector('.result-placeholder');
  const genderBtns = document.querySelectorAll('.gender-btn');

  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const radio = btn.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const heightCm = parseFloat(document.getElementById('heightInput').value);
      const weightKg = parseFloat(document.getElementById('weightInput').value);
      const gender = document.querySelector('input[name="gender"]:checked').value;

      if (!heightCm || !weightKg) return;

      const heightM = heightCm / 100;
      const bmi = (weightKg / (heightM * heightM)).toFixed(1);

      let minLoss = 12;
      let maxLoss = 20;

      if (weightKg > 85) {
        minLoss = 18;
        maxLoss = 28;
      } else if (weightKg > 70) {
        minLoss = 14;
        maxLoss = 22;
      } else {
        minLoss = 10;
        maxLoss = 16;
      }

      if (gender === 'male') {
        minLoss += 2;
        maxLoss += 3;
      }

      let bmiStatus = '正常体型';
      let advice = '建议选择【30天基础体验营】，科学控卡与有氧塑形结合。';

      if (bmi >= 28) {
        bmiStatus = '重度肥胖状态';
        advice = '强烈建议选择【60天双期蜕变营】，全方位低冲击水上训练与减脂调理，预防关节压力！';
      } else if (bmi >= 24) {
        bmiStatus = '偏胖/超重状态';
        advice = '建议选择【30天封闭精炼营】，配合高低强度交替有氧与少油高蛋白膳食，高效瘦身！';
      }

      document.getElementById('bmiVal').innerText = bmi;
      document.getElementById('bmiStatusBadge').innerText = bmiStatus;
      document.getElementById('lossRange').innerText = `${minLoss} ~ ${maxLoss} 斤`;
      document.getElementById('planAdvice').innerText = advice;

      if (resultPlaceholder) resultPlaceholder.style.display = 'none';
      if (resultContent) resultContent.classList.remove('hidden');
    });
  }

  const applyPlanBtn = document.getElementById('applyPlanBtn');
  if (applyPlanBtn) {
    applyPlanBtn.addEventListener('click', () => {
      openBookingModal();
    });
  }

  // 8. Instant Client Voucher Card Generator (100% Pure Frontend)
  const bookModal = document.getElementById('bookModal');
  const closeBookModal = document.getElementById('closeBookModal');
  const bookingForm = document.getElementById('bookingForm');
  const voucherCardOutput = document.getElementById('voucherCardOutput');
  const openBookModalBtns = [
    document.getElementById('openBookModal'),
    document.getElementById('heroBookBtn'),
    document.getElementById('ctaBookBtn'),
    document.getElementById('floatBook'),
    document.getElementById('openTeenBookBtn')
  ];

  function openBookingModal() {
    if (bookModal) bookModal.classList.add('active');
  }

  function closeBookingModal() {
    if (bookModal) bookModal.classList.remove('active');
  }

  openBookModalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModal();
      });
    }
  });

  if (closeBookModal) {
    closeBookModal.addEventListener('click', closeBookingModal);
  }

  if (bookModal) {
    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeBookingModal();
    });
  }

  // Generate Voucher Card purely in client JS
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('voucherName').value || '贵宾学员';
      const userBase = document.getElementById('voucherBase').value || '福建43000平旗舰基地';
      const randomCode = 'MG-' + Math.floor(100000 + Math.random() * 900000);

      document.getElementById('vNameDisplay').innerText = `持卡人：${userName}`;
      document.getElementById('vBaseDisplay').innerText = `适用基地：${userBase}`;
      document.getElementById('vCodeNum').innerText = randomCode;

      if (voucherCardOutput) {
        voucherCardOutput.classList.remove('hidden');
      }
    });
  }

  const printVoucherBtn = document.getElementById('printVoucherBtn');
  if (printVoucherBtn) {
    printVoucherBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // WeChat Modal Alert
  const openWechatBtn = document.getElementById('openWechatModal');
  const floatWechatBtn = document.getElementById('floatWechat');
  const footerBookBtn = document.getElementById('footerBookBtn');

  function showWechatToast() {
    alert('📱 觅谷减肥健身训练营官方微信: MIGU_FIT2026\n已为您自动复制微信账号！直接打开微信搜索即可与体测导师即时聊天！');
  }

  if (openWechatBtn) openWechatBtn.addEventListener('click', showWechatToast);
  if (floatWechatBtn) floatWechatBtn.addEventListener('click', showWechatToast);
  if (footerBookBtn) footerBookBtn.addEventListener('click', showWechatToast);
});
