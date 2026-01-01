/* =========================================================
   Rotating Text (Hero Subtitle) - Smooth & Slow
========================================================= */

const phrases = [
  "Build Your Digital Future",
  "Learn. Grow. Succeed.",
  "Professional Skills for a Digital World",
  "Upgrade Your Marketing Skills Today"
];

const rotatingText = document.getElementById("rotating-text");
let phraseIndex = 0;

// أول جملة
rotatingText.textContent = phrases[0];
rotatingText.classList.add("fade-slide");

setInterval(() => {
  phraseIndex = (phraseIndex + 1) % phrases.length;

  // إزالة الأنيميشن لإعادة تشغيله
  rotatingText.classList.remove("fade-slide");

  // trick بسيط لإعادة التفعيل
  void rotatingText.offsetWidth;

  rotatingText.textContent = phrases[phraseIndex];
  rotatingText.classList.add("fade-slide");

}, 3800); // أبطأ (3.8 ثواني)



/* =========================================================
   Interactive Background (Lines & Dots)
========================================================= */

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.querySelector(".hero").offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* ---------------- Mouse tracking (direction + speed) ---------------- */

const mouse = {
  x: null,
  y: null,
  vx: 0,
  vy: 0
};

let lastX = null;
let lastY = null;

window.addEventListener("mousemove", (e) => {
  if (lastX !== null && lastY !== null) {
    mouse.vx = e.clientX - lastX;
    mouse.vy = e.clientY - lastY;
  }

  mouse.x = e.clientX;
  mouse.y = e.clientY;

  lastX = e.clientX;
  lastY = e.clientY;
});


/* ---------------- Create dots ---------------- */

const dots = [];
const DOTS_COUNT = 65;

for (let i = 0; i < DOTS_COUNT; i++) {
  const vx = (Math.random() - 0.5) * 0.3;
  const vy = (Math.random() - 0.5) * 0.3;

  dots.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: vx,
    vy: vy,
    baseVx: vx,
    baseVy: vy
  });
}


/* ---------------- Animation loop ---------------- */

function animate() {
  ctx.clearRect(0, 0, w, h);

  dots.forEach((dot, i) => {
    /* Move dot */
    dot.x += dot.vx;
    dot.y += dot.vy;

    /* Bounce from edges */
    if (dot.x < 0 || dot.x > w) dot.vx *= -1;
    if (dot.y < 0 || dot.y > h) dot.vy *= -1;

    /* Draw dot */
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(30, 81, 123, 0.42)";
    ctx.fill();

    /* Draw lines between nearby dots */
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dot.x - dots[j].x;
      const dy = dot.y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = "rgba(1, 2, 2, 0.03)";
        ctx.stroke();
      }
    }

    /* Mouse influence (same direction, speed boost) */
    if (mouse.x !== null && mouse.y !== null) {
      const dx = dot.x - mouse.x;
      const dy = dot.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        dot.vx += mouse.vx * 0.029;
        dot.vy += mouse.vy * 0.029;
      }
    }

    /* Smooth return to base speed */
    dot.vx += (dot.baseVx - dot.vx) * 0.09;
    dot.vy += (dot.baseVy - dot.vy) * 0.09;
  });

  requestAnimationFrame(animate);
}

animate();

/* =========================================================
   Courses Slider (4 cards per slide)
========================================================= */

const track = document.querySelector(".courses-track");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

const cards = document.querySelectorAll(".course-card");
const cardsPerView = 4;

let currentIndex = 0;

function updateSlider() {
  const cardWidth = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - cardsPerView) {
    currentIndex += cardsPerView;
    updateSlider();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= cardsPerView;
    updateSlider();
  }
});

/* =========================================================
   Animate Courses Note on Scroll
========================================================= */

const coursesNote = document.querySelector(".courses-note");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        coursesNote.classList.add("show");
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(coursesNote);

/* =========================================================
   Why Us Cards Animation on Scroll
========================================================= */

const whyCards = document.querySelectorAll(".why-card");

const whyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 150); // stagger effect
      }
    });
  },
  { threshold: 0.3 }
);

whyCards.forEach(card => {
  whyObserver.observe(card);
});

/* =========================================================
   Testimonials Auto Slider
========================================================= */

const tTrack = document.querySelector(".testimonials-track");
const tCards = document.querySelectorAll(".testimonial-card");
const tPrev = document.querySelector(".testimonial-btn.prev");
const tNext = document.querySelector(".testimonial-btn.next");

let tIndex = 0;
let autoSlideInterval;

function updateTestimonials() {
  tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
}

function nextTestimonial() {
  tIndex = (tIndex + 1) % tCards.length;
  updateTestimonials();
}

function prevTestimonial() {
  tIndex = (tIndex - 1 + tCards.length) % tCards.length;
  updateTestimonials();
}

/* Buttons */
tNext.addEventListener("click", () => {
  nextTestimonial();
  restartAutoSlide();
});

tPrev.addEventListener("click", () => {
  prevTestimonial();
  restartAutoSlide();
});

/* Auto Slide */
function startAutoSlide() {
  autoSlideInterval = setInterval(nextTestimonial, 4500);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function restartAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

/* Pause on hover */
const testimonialsSection = document.querySelector(".testimonials");

testimonialsSection.addEventListener("mouseenter", stopAutoSlide);
testimonialsSection.addEventListener("mouseleave", startAutoSlide);

/* Start */
startAutoSlide();


/* =========================================================
   Contact Form Validation
========================================================= */

const form = document.querySelector(".contact-form");
const successMsg = document.querySelector(".form-success");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMsg.style.display = "block";
  form.reset();
});

/* =========================================================
   Footer Reveal on Scroll
========================================================= */

const footer = document.querySelector(".footer");

const footerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

footerObserver.observe(footer);

/* =========================================================
   Scroll To Top Button
========================================================= */

const scrollBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/* =========================================================
   Burger Menu
========================================================= */

/* ===== Burger Menu Fix ===== */

const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".menu");

burger.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});


/* =========================================================
   Active Menu Link on Scroll (FIX)
========================================================= */

const sections = document.querySelectorAll("section[id]");
const menuLinks = document.querySelectorAll(".menu-link");

function updateActiveMenu() {
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    menuLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});



/* =========================================================
   Courses Swipe (Mobile) - FIXED
========================================================= */

let startX = 0;
let endX = 0;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function getCardsPerMove() {
  return window.innerWidth <= 700 ? 1 : cardsPerView;
}


function handleSwipe() {
  const diff = startX - endX;
  const moveBy = getCardsPerMove();

  // swipe left → next
  if (diff > 50 && currentIndex < cards.length - moveBy) {
    currentIndex += moveBy;
    updateSlider();
  }

  // swipe right → prev
  if (diff < -50 && currentIndex > 0) {
    currentIndex -= moveBy;
    updateSlider();
  }
}

/* =========================================================
   Testimonials Swipe (Mobile)
========================================================= */

let tStartX = 0;
let tEndX = 0;

tTrack.addEventListener("touchstart", (e) => {
  tStartX = e.touches[0].clientX;
}, { passive: true });

tTrack.addEventListener("touchend", (e) => {
  tEndX = e.changedTouches[0].clientX;
  handleTestimonialSwipe();
});

function handleTestimonialSwipe() {
  const diff = tStartX - tEndX;

  // Swipe Left → Next
  if (diff > 50) {
    nextTestimonial();
    restartAutoSlide();
  }

  // Swipe Right → Previous
  if (diff < -50) {
    prevTestimonial();
    restartAutoSlide();
  }
}

const mobileCTA = document.querySelector(".mobile-cta");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    mobileCTA.style.display = "flex";
  } else {
    mobileCTA.style.display = "none";
  }
});

/* =========================================================
   Course Details Modal
========================================================= */

const courseCards = document.querySelectorAll(".course-card");
const courseModal = document.getElementById("courseModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDuration = document.getElementById("modal-duration");
const modalCertificate = document.getElementById("modal-certificate");
const modalLevel = document.getElementById("modal-level");
const modalWhatsapp = document.getElementById("modalWhatsapp");


courseCards.forEach(card => {
  card.addEventListener("click", () => {

    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.desc;
    modalDuration.textContent = card.dataset.duration;
    modalCertificate.textContent = card.dataset.certificate;
    modalLevel.textContent = card.dataset.level;

    // WhatsApp message
    const message = `Hello, I'm interested in the "${card.dataset.title}" course.`;
    modalWhatsapp.href =
      `https://wa.me/962786006759?text=${encodeURIComponent(message)}`;

    courseModal.classList.add("show");
  });
});

const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => {
  courseModal.classList.remove("show");
});

// إغلاق عند الضغط خارج المحتوى
courseModal.addEventListener("click", (e) => {
  if (e.target === courseModal) {
    courseModal.classList.remove("show");
  }
});


/* =========================================================
   Page Progress Indicator
========================================================= */

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + "%";
});

/* =========================================================
   Live Stats Count Up Animation
========================================================= */

const stats = document.querySelectorAll(".stat__num");
let statsStarted = false;

function animateStats() {
  if (statsStarted) return;
  statsStarted = true;

  stats.forEach(stat => {
    const target = parseFloat(stat.dataset.value);
    const suffix = stat.dataset.suffix || "";
    let current = 0;

    const increment = target / 150; // سرعة العد

    function update() {
      current += increment;

      if (current < target) {
        stat.textContent =
          (target % 1 !== 0
            ? current.toFixed(1)
            : Math.floor(current)) + suffix;

        requestAnimationFrame(update);
      } else {
        stat.textContent = target + suffix;
      }
    }

    update();
  });
}

/* Trigger when visible */
const heroCard = document.querySelector(".hero__card");

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
      }
    });
  },
  { threshold: 0.5 }
);

statsObserver.observe(heroCard);


/* =========================================================
   Career Quiz Logic
========================================================= */

const quizData = [
  {
    question: "What excites you most?",
    options: [
      { text: "Creating content & posts", path: "social" },
      { text: "Analyzing numbers & performance", path: "analytics" },
      { text: "Running paid ads", path: "ads" },
      { text: "Building brand identity", path: "branding" }
    ]
  },
  {
    question: "Your strongest skill is:",
    options: [
      { text: "Creativity & storytelling", path: "social" },
      { text: "Data & reports", path: "analytics" },
      { text: "Strategy & optimization", path: "ads" },
      { text: "Vision & consistency", path: "branding" }
    ]
  },
  {
    question: "You prefer work that is:",
    options: [
      { text: "Visual & engaging", path: "social" },
      { text: "Logical & measurable", path: "analytics" },
      { text: "Fast-paced & competitive", path: "ads" },
      { text: "Long-term & strategic", path: "branding" }
    ]
  },
  {
    question: "Your career goal:",
    options: [
      { text: "Social Media Specialist", path: "social" },
      { text: "Marketing Analyst", path: "analytics" },
      { text: "Performance Marketer", path: "ads" },
      { text: "Brand Manager", path: "branding" }
    ]
  }
];

const resultsMap = {
  social: {
    title: "You're perfect for Social Media Marketing 🚀",
    desc: "You thrive in creative environments and love engaging audiences.",
    link: "Social Media Advertising"
  },
  analytics: {
    title: "You're perfect for Analytics & Performance 📊",
    desc: "You make decisions based on data and insights.",
    link: "Analytics & Performance Tracking"
  },
  ads: {
    title: "You're perfect for Paid Advertising 🎯",
    desc: "You enjoy optimization, results, and ROI-focused work.",
    link: "Google Ads"
  },
  branding: {
    title: "You're perfect for Brand Strategy 🎨",
    desc: "You think long-term and build strong brand identities.",
    link: "Brand Strategy"
  }
};

let currentQuestion = 0;
const scores = {
  social: 0,
  analytics: 0,
  ads: 0,
  branding: 0
};

const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const currentStepEl = document.getElementById("current-step");
const totalStepsEl = document.getElementById("total-steps");
const resultBox = document.getElementById("quiz-result");
const resultTitle = document.getElementById("result-title");
const resultDesc = document.getElementById("result-desc");
const resultEnroll = document.getElementById("result-enroll");

totalStepsEl.textContent = quizData.length;

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  currentStepEl.textContent = currentQuestion + 1;

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;

    btn.onclick = () => {
      scores[opt.path]++;
      nextQuestion();
    };

    optionsEl.appendChild(btn);
  });
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelector(".quiz-box").style.display = "none";
  resultBox.style.display = "block";

  const finalPath = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const result = resultsMap[finalPath];

  resultTitle.textContent = result.title;
  resultDesc.textContent = result.desc;

  resultEnroll.href =
    "https://wa.me/962786006759?text=I%20want%20to%20enroll%20in%20" +
    encodeURIComponent(result.link);
}

loadQuestion();

/* =========================================================
   FAQ Accordion
========================================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {

    // Close others (optional – feel free to remove)
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});




