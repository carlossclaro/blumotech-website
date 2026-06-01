(function () {
  "use strict";

  const config = window.BLUMOTECH_CONFIG || {};

  /* Product pages: show content immediately (no invisible reveal blocks) */
  if (document.body.classList.contains("page-mmc")) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Testimonial from site-config */
  const testimonialEl = document.getElementById("testimonial-root");
  if (testimonialEl && config.testimonial) {
    const t = config.testimonial;
    const roleHtml = t.projectUrl
      ? '<a href="' + t.projectUrl + '" target="_blank" rel="noopener noreferrer">' + t.role + "</a>"
      : t.role;
    testimonialEl.innerHTML =
      '<blockquote class="testimonial__quote">' +
      t.quote +
      "</blockquote>" +
      '<p class="testimonial__author">' +
      t.author +
      "</p>" +
      '<p class="testimonial__role">' +
      roleHtml +
      "</p>";
  }

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const navMobile = document.getElementById("nav-mobile");
  const navLinks = document.querySelectorAll(".nav__links a, .nav__mobile a");

  function setMobileNavOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }
    if (navMobile) {
      navMobile.hidden = !isOpen;
    }
  }
  const backTop = document.getElementById("back-top");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const contactForm = document.getElementById("contact-form");
  const sendMessage = document.getElementById("sendmessage");
  const errorMessage = document.getElementById("errormessage");

  /* Scroll: nav + back to top + active section */
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    backTop.classList.toggle("is-visible", y > 500);

    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach(function (section) {
      const top = section.offsetTop - 120;
      if (y >= top) current = section.getAttribute("id");
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        link.classList.toggle("is-active", href === "#" + current);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMobileNavOpen(!nav.classList.contains("is-open"));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setMobileNavOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      setMobileNavOpen(false);
    }
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Portfolio filters */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      projectCards.forEach(function (card) {
        const cat = card.getAttribute("data-category");
        const show = filter === "all" || cat === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = "";
        }
      });
    });
  });

  /* Hero parallax (subtle) */
  const heroVisual = document.querySelector(".hero__visual");
  if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      heroVisual.style.transform = "translate(" + x + "px, " + y + "px)";
    });
  }

  /* Contact form */
  const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(input) {
    const group = input.closest(".form-group");
    const rule = input.getAttribute("data-rule");
    let err = false;
    let msg = input.getAttribute("data-msg") || "Invalid input";

    if (!rule) return true;

    if (rule.indexOf("required") >= 0 && !input.value.trim()) err = true;
    if (rule.indexOf("minlen:4") >= 0 && input.value.trim().length < 4) err = true;
    if (rule.indexOf("email") >= 0 && !emailExp.test(input.value)) err = true;

    group.classList.toggle("has-error", err);
    const validation = group.querySelector(".validation");
    if (validation) validation.textContent = err ? msg : "";
    return !err;
  }

  if (contactForm) {
    const formAction =
      config.formSubmitAction || "https://formsubmit.co/sales@blumotech.com";
    const formNext = document.getElementById("form-next");
    const formSubject = document.getElementById("form-subject");
    const thanksUrl =
      window.location.origin +
      window.location.pathname +
      "?contact=sent#contact";

    contactForm.setAttribute("action", formAction);
    if (formNext) formNext.value = thanksUrl;

  if (sendMessage && new URLSearchParams(window.location.search).get("contact") === "sent") {
      sendMessage.textContent = "Your message has been sent. Thank you!";
      sendMessage.classList.add("is-visible");
      if (window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + "#contact");
      }
    }

    contactForm.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", function (e) {
      let valid = true;
      contactForm.querySelectorAll("[data-rule]").forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        return;
      }

      const honey = contactForm.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        e.preventDefault();
        return;
      }

      const subjectInput = contactForm.querySelector('[name="subject"]');
      if (formSubject && subjectInput) {
        formSubject.value =
          "Blumotech contact: " + (subjectInput.value.trim() || "New inquiry");
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      /* Native POST to FormSubmit — no fetch, no CORS */
    });
  }

  /* Back to top */
  if (backTop) {
    backTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
