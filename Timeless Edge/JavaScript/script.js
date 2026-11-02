// ---------- Menu Toggle ----------
/*const toggleBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navbar');

toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
});

nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        nav.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
    }
});
*/
const toggleBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navbar");

if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", isOpen);
    });

    nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            nav.classList.remove("open");
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            nav.classList.remove("open");
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    });
}

//<--- Menu Toggle and Navigation Bar Functionality --->

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
let map = null;

function initMap() {
    if (typeof L == 'undefined' || !document.getElementById('map')) return;

    if (!map) {
        const soweto = [-26.22866324218676, 27.84137812481032];
        map = L.map('map').setView(soweto, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; contributors'
        }).addTo(map);

        L.marker(soweto).addTo(map)
            .bindPopup("<strong>Timeless Edge</strong><br>Dobsonville, Soweto")
            .openPopup();
    }else {
        map.invalidateSize();
    }  
}
function showTab(panelId) {
    tabButtons.forEach(btn => {
        const active = btn.dataset.tab === panelId;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active);
    });

    tabPanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === panelId);
    });

    if (panelId === "map-panel") initMap();
}

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => showTab(btn.dataset.tab));
    });


// ---------- Gallery ----------
const galleryPhotos = [
  { src: "Images/picture1.jpg", alt: "Red Timeless Edge hoodie" },
  { src: "Images/picture2.jpg", alt: "Black Timeless Edge hoodie" },
  { src: "Images/picture3.jpg", alt: "Timeless Edge caps" },
  { src: "Images/home page background.jpg", alt: "Timeless Edge logo" }
];

const galleryEl = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-image");
const lbCaption = document.getElementById("lb-caption");

if (galleryEl && lightbox && lbImg && lbCaption) {
  let current = 0;

  // Build the photo buttons (placed before the video so the video stays last)
  const video = galleryEl.querySelector("video");
  galleryPhotos.forEach((photo, i) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.dataset.index = i;

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";

    button.append(img);
    galleryEl.insertBefore(button, video);   // if there's no video, this appends
  });

  function showImage(index) {
    current = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[current];
    lbImg.src = photo.src;
    lbImg.alt = photo.alt;
    lbCaption.textContent = `${photo.alt} (${current + 1} of ${galleryPhotos.length})`;
  }

  // One click listener for all photos (event delegation)
  galleryEl.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    showImage(Number(item.dataset.index));
    lightbox.showModal();
  });

  lightbox.querySelector(".lb-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lb-prev").addEventListener("click", () => showImage(current - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => showImage(current + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.open) return;
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
  });
}

// ---------- Contact form: validate, then submit with AJAX ----------
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const cfStatus = document.getElementById("cf-status");
  const cfMessage = document.getElementById("cf-message");
  const cfCount = document.getElementById("cf-count");
  const submitBtn = contactForm.querySelector(".submit-btn");
  const fallbackEmail = contactForm.dataset.fallbackEmail;

  const messages = {
    name: {
      valueMissing: "Please enter your name.",
      tooShort: "Your name must be at least 2 characters.",
      patternMismatch: "Use letters, spaces, hyphens or apostrophes only."
    },
    email: {
      valueMissing: "Please enter your email address.",
      typeMismatch: "Enter a valid email, like name@example.com."
    },
    phone: {
      valueMissing: "Please enter your phone number.",
      patternMismatch: "Use a South African number: 0670703550 or +27670703550."
    },
    type: { valueMissing: "Please choose a message type." },
    message: {
      valueMissing: "Please type your message.",
      tooShort: "Your message must be at least 10 characters."
    }
  };

  function validateField(field) {
    const wrapper = field.closest(".field");
    const errorEl = document.getElementById(`cf-${field.name}-error`);
    let text = "";

    if (!field.validity.valid) {
      const set = messages[field.name] || {};
      const key = Object.keys(set).find(k => field.validity[k]);
      text = key ? set[key] : field.validationMessage;
    }

    errorEl.textContent = text;
    wrapper.classList.toggle("invalid", text !== "");
    field.setAttribute("aria-invalid", text !== "");
    return text === "";
  }

  // Only the visible fields (skips the hidden spam trap)
  const fields = Array.from(contactForm.querySelectorAll(".field input, .field select, .field textarea"));

  fields.forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("invalid")) validateField(field);
    });
  });

  cfMessage.addEventListener("input", () => {
    cfCount.textContent = `${cfMessage.value.length} / ${cfMessage.maxLength}`;
  });

  // Backup: build an email the visitor can send from their own email app
  function mailtoLink(data) {
    const subject = `[${data.get("type")}] Message from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Message type: ${data.get("type")}`,
      "",
      "Message:",
      data.get("message")
    ].join("\r\n");
    return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    fields.forEach(f => {
      if (f.type !== "select-one") f.value = f.value.trim();
    });

    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      cfStatus.textContent = "Please fix the highlighted fields.";
      contactForm.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
      return;
    }

    const data = new FormData(contactForm);
    data.append("_subject", `[${data.get("type")}] Message from ${data.get("name")}`);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    cfStatus.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      contactForm.reset();
      cfCount.textContent = `0 / ${cfMessage.maxLength}`;
      cfStatus.textContent = "Thank you! Your message was sent. We'll get back to you soon.";
    } catch (error) {
      console.error("Form submit failed:", error);
      cfStatus.textContent = "Sorry, we couldn't send your message. ";

      const link = document.createElement("a");
      link.href = mailtoLink(data);
      link.textContent = "Send it from your email app instead.";
      cfStatus.append(link);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}

// ---------- Services: search, filter, sort ----------
const searchInput = document.getElementById("service-search");
const categorySelect = document.getElementById("service-category");
const sortSelect = document.getElementById("service-sort");
const serviceList = document.querySelector(".services-section");
const countEl = document.getElementById("service-count");
const noResults = document.getElementById("no-results");

if (searchInput && categorySelect && sortSelect && serviceList) {
  const cards = Array.from(serviceList.querySelectorAll(".card"));

  function updateServices() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;

    // 1. Filter by search text and category
    const visible = cards.filter(card => {
      const matchesText = card.textContent.toLowerCase().includes(query);
      const matchesCategory = category === "all" || card.dataset.category === category;
      return matchesText && matchesCategory;
    });

    // 2. Sort the matches
    const title = card => card.querySelector("h3").textContent;
    const price = card => Number(card.dataset.price);

    visible.sort((a, b) => {
      switch (sort) {
        case "name-asc":   return title(a).localeCompare(title(b));
        case "name-desc":  return title(b).localeCompare(title(a));
        case "price-asc":  return price(a) - price(b);
        case "price-desc": return price(b) - price(a);
        default:           return cards.indexOf(a) - cards.indexOf(b); // original order
      }
    });

    // 3. Update the page
    cards.forEach(card => card.hidden = !visible.includes(card));
    visible.forEach(card => serviceList.append(card));   // re-appending reorders them

    if (countEl) countEl.textContent = `${visible.length} of ${cards.length} shown`;
    if (noResults) noResults.hidden = visible.length > 0;
  }

  searchInput.addEventListener("input", updateServices);
  categorySelect.addEventListener("change", updateServices);
  sortSelect.addEventListener("change", updateServices);

  updateServices();
}

// ---------- Enquiry form: validate, then submit with AJAX ----------
const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
  const statusEl = document.getElementById("eq-status");
  const detailsEl = document.getElementById("eq-details");
  const countEl = document.getElementById("eq-count");
  const sendBtn = enquiryForm.querySelector(".submit-btn");
  const fallbackEmail = enquiryForm.dataset.fallbackEmail;

  // Pre-select a product from a link like enquiry.html?product=winter
  const productNames = {
    summer: "Summer Collection",
    winter: "Winter Wear",
    accessories: "Accessories"
  };
  const wanted = new URLSearchParams(location.search).get("product");
  if (productNames[wanted]) enquiryForm.elements.product.value = productNames[wanted];

  const messages = {
    name: {
      valueMissing: "Please enter your name.",
      tooShort: "Your name must be at least 2 characters.",
      patternMismatch: "Use letters, spaces, hyphens or apostrophes only."
    },
    email: {
      valueMissing: "Please enter your email address.",
      typeMismatch: "Enter a valid email, like name@example.com."
    },
    phone: {
      valueMissing: "Please enter your phone number.",
      patternMismatch: "Use a South African number: 0670703550 or +27670703550."
    },
    enquiry_type: { valueMissing: "Please choose a type of enquiry." },
    product: { valueMissing: "Please choose a product." },
    quantity: {
      valueMissing: "Please enter a quantity.",
      badInput: "Quantity must be a number.",
      rangeUnderflow: "The minimum quantity is 1.",
      rangeOverflow: "For more than 500, please use the Contact page."
    },
    contact_method: { valueMissing: "Please choose how we should reply." },
    details: {
      valueMissing: "Please describe your enquiry.",
      tooShort: "Please write at least 10 characters."
    },
    consent: { valueMissing: "Please tick the box so we can contact you." }
  };

  function validateEnquiryField(field) {
    const wrapper = field.closest(".field");
    const errorEl = document.getElementById(`eq-${field.name}-error`);
    let text = "";

    if (field.type === "radio") {
      // A radio group is valid when any option in it is chosen
      const chosen = enquiryForm.querySelector(`input[name="${field.name}"]:checked`);
      if (!chosen) text = messages[field.name].valueMissing;
    } else if (!field.validity.valid) {
      const set = messages[field.name] || {};
      const key = Object.keys(set).find(k => field.validity[k]);
      text = key ? set[key] : field.validationMessage;
    }

    errorEl.textContent = text;
    wrapper.classList.toggle("invalid", text !== "");
    field.setAttribute("aria-invalid", text !== "");
    return text === "";
  }

  // Visible fields only (skips the hidden spam trap)
  const fields = Array.from(enquiryForm.querySelectorAll(".field input, .field select, .field textarea"));

  fields.forEach(field => {
    field.addEventListener("blur", () => validateEnquiryField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("invalid")) validateEnquiryField(field);
    });
  });

  detailsEl.addEventListener("input", () => {
    countEl.textContent = `${detailsEl.value.length} / ${detailsEl.maxLength}`;
  });

  function enquiryMailto(data) {
    const subject = `[Enquiry: ${data.get("product")}] from ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Enquiry type: ${data.get("enquiry_type")}`,
      `Product: ${data.get("product")}`,
      `Quantity: ${data.get("quantity")}`,
      `Preferred reply: ${data.get("contact_method")}`,
      "",
      "Details:",
      data.get("details")
    ].join("\r\n");
    return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Trim text-like fields so spaces alone don't count as input
    fields.forEach(f => {
      if (["text", "email", "tel"].includes(f.type) || f.tagName === "TEXTAREA") {
        f.value = f.value.trim();
      }
    });

    const allValid = fields.map(validateEnquiryField).every(Boolean);
    if (!allValid) {
      statusEl.textContent = "Please fix the highlighted fields.";
      enquiryForm.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
      return;
    }

    const data = new FormData(enquiryForm);
    data.append("_subject", `[Enquiry: ${data.get("product")}] from ${data.get("name")}`);

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    statusEl.textContent = "";

    try {
      const response = await fetch(enquiryForm.action, {
        method: enquiryForm.method,
        body: data,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("HTTP " + response.status);

      enquiryForm.reset();
      countEl.textContent = `0 / ${detailsEl.maxLength}`;
      statusEl.textContent = "Thank you! Your enquiry was sent. We'll reply soon.";
    } catch (error) {
      console.error("Enquiry failed:", error);
      statusEl.textContent = "Sorry, we couldn't send your enquiry. ";
      const link = document.createElement("a");
      link.href = enquiryMailto(data);
      link.textContent = "Send it from your email app instead.";
      statusEl.append(link);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send enquiry";
    }
  });
}
// ---------- Polish: header shadow + scroll reveal ----------
const siteHeader = document.querySelector("header");

if (siteHeader) {
  const onScroll = () => siteHeader.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

const revealEls = document.querySelectorAll(".card, .container2, .gallery-item, .contact-form-section, main h1");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);   // animate once
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;   // gentle stagger
    revealObserver.observe(el);
  });
}