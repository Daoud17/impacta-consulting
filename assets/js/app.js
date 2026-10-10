
/* =========================================================
   IMPACTA CONSULTING - MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    function updateHeader() {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMenu() {
        menuToggle.classList.add("active");
        mobileMenu.classList.add("open");
        header.classList.add("menu-active");

        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        mobileMenu.setAttribute("aria-hidden", "false");
        mobileMenu.inert = false;
    }

    function closeMenu() {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("open");
        header.classList.remove("menu-active");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        mobileMenu.setAttribute("aria-hidden", "true");
        mobileMenu.inert = true;
    }

    // Menu starts closed
    closeMenu();

    // Toggle hamburger
    menuToggle.addEventListener("click", () => {
        if (mobileMenu.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when a navigation link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Close when clicking outside the header/menu
    document.addEventListener("click", event => {
        const isOpen = mobileMenu.classList.contains("open");

        if (
            isOpen &&
            !mobileMenu.contains(event.target) &&
            !header.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Close when switching to desktop layout
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

});



/* =====================================================
   IMPACTA CONTACT FORM VALIDATION
===================================================== */

const impactaForm = document.getElementById("impactaContactForm");
const impactaSuccess = document.getElementById("impactaFormSuccess");

if (impactaForm && impactaSuccess) {

    const fields = impactaForm.querySelectorAll(
        "input, textarea"
    );

    // Hide success message when the user edits the form
    fields.forEach(field => {
        field.addEventListener("input", () => {
            impactaSuccess.hidden = true;
        });
    });

    impactaForm.addEventListener("submit", event => {

        event.preventDefault();

        // Browser validation
        if (!impactaForm.checkValidity()) {
            impactaForm.reportValidity();
            return;
        }

        // Prevent whitespace-only submissions
        const fullName = document.getElementById("contactFullName");
        const subject = document.getElementById("contactSubject");
        const message = document.getElementById("contactMessage");
        const phone = document.getElementById("contactPhone");

        const textFields = [fullName, subject, message];

        for (const field of textFields) {

            const trimmed = field.value.trim();

            if (trimmed.length < Number(field.minLength || 1)) {
                field.setCustomValidity(
                    "Please enter valid information."
                );

                field.reportValidity();
                field.setCustomValidity("");
                field.focus();
                return;
            }
        }

        // Phone number must contain 7-15 digits
        const phoneDigits = phone.value.replace(/\D/g, "");

        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            phone.setCustomValidity(
                "Please enter a valid phone number."
            );

            phone.reportValidity();
            phone.setCustomValidity("");
            phone.focus();
            return;
        }

        // Frontend validation completed successfully
        impactaSuccess.hidden = false;

        // Clear form fields
        impactaForm.reset();

        // Show confirmation
        impactaSuccess.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });
}



/* =========================================================
   HOME - GROWTH COUNTERS & SCROLL EFFECTS
========================================================= */

const growthSection = document.querySelector(".home-growth-section");

if (growthSection) {

    const revealItems = growthSection.querySelectorAll(".growth-reveal");
    const counters = growthSection.querySelectorAll(".growth-counter");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealAll = () => {
        revealItems.forEach(item => {
            item.classList.add("growth-visible");
        });
    };

    const animateCounter = (counter) => {

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target) || target < 0) {
            return;
        }

        if (reducedMotion) {
            counter.textContent = target.toLocaleString();
            return;
        }

        const duration = 1800;
        const startTime = performance.now();

        const update = (currentTime) => {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out animation
            const eased = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(target * eased);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    };

    const startGrowthAnimation = () => {

        revealAll();

        counters.forEach(counter => {
            animateCounter(counter);
        });
    };

    if ("IntersectionObserver" in window) {

        const growthObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        startGrowthAnimation();
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.2
            }
        );

        growthObserver.observe(growthSection);

    } else {

        startGrowthAnimation();

    }

}


/* =========================================================
   HOME - CLIENT FEEDBACK SLIDER
========================================================= */

const feedbackSection = document.querySelector(
    ".home-feedback-section"
);

if (feedbackSection) {

    const slides = Array.from(
        feedbackSection.querySelectorAll(".home-feedback-slide")
    );

    const dots = Array.from(
        feedbackSection.querySelectorAll(".home-feedback-dot")
    );

    const prevButton = feedbackSection.querySelector(
        ".home-feedback-prev"
    );

    const nextButton = feedbackSection.querySelector(
        ".home-feedback-next"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentSlide = 0;
    let feedbackInterval = null;

    const slideDuration = 3000;

    /* SHOW SELECTED SLIDE */

    function showFeedbackSlide(index) {

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {

            const active = i === currentSlide;

            slide.classList.toggle("active", active);
            slide.setAttribute("aria-hidden", String(!active));

        });

        dots.forEach((dot, i) => {

            const active = i === currentSlide;

            dot.classList.toggle("active", active);

            if (active) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }

        });

    }

    /* STOP AUTOPLAY */

    function stopFeedbackAutoplay() {

        if (feedbackInterval !== null) {
            clearInterval(feedbackInterval);
            feedbackInterval = null;
        }

    }

    /* START AUTOPLAY */

    function startFeedbackAutoplay() {

        stopFeedbackAutoplay();

        if (reducedMotion || slides.length < 2) {
            return;
        }

        feedbackInterval = setInterval(() => {

            if (!document.hidden) {
                showFeedbackSlide(currentSlide + 1);
            }

        }, slideDuration);

    }

    /* MANUAL NAVIGATION */

    prevButton.addEventListener("click", () => {

        showFeedbackSlide(currentSlide - 1);
        startFeedbackAutoplay();

    });

    nextButton.addEventListener("click", () => {

        showFeedbackSlide(currentSlide + 1);
        startFeedbackAutoplay();

    });

    /* DOT NAVIGATION */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showFeedbackSlide(index);
            startFeedbackAutoplay();

        });

    });

    /* PAUSE ON HOVER OR KEYBOARD FOCUS */

    feedbackSection.addEventListener(
        "mouseenter",
        stopFeedbackAutoplay
    );

    feedbackSection.addEventListener(
        "mouseleave",
        startFeedbackAutoplay
    );

    feedbackSection.addEventListener(
        "focusin",
        stopFeedbackAutoplay
    );

    feedbackSection.addEventListener("focusout", event => {

        if (!feedbackSection.contains(event.relatedTarget)) {
            startFeedbackAutoplay();
        }

    });

    /* INITIALIZE */

    if (slides.length > 0) {
        showFeedbackSlide(0);
        startFeedbackAutoplay();
    }

}




/* =========================================================
   SERVICES - EXPANDABLE STRATEGY CARDS
========================================================= */

const strategyCards = document.querySelectorAll(
    ".services-strategy-card"
);

if (strategyCards.length > 0) {

    strategyCards.forEach(card => {

        const button = card.querySelector(
            ".services-strategy-toggle"
        );

        const details = card.querySelector(
            ".services-strategy-details"
        );

        const symbol = card.querySelector(
            ".services-strategy-symbol"
        );

        button.addEventListener("click", () => {

            const wasOpen = card.classList.contains("is-open");

            // Close every card
            strategyCards.forEach(otherCard => {

                otherCard.classList.remove("is-open");

                const otherButton = otherCard.querySelector(
                    ".services-strategy-toggle"
                );

                const otherDetails = otherCard.querySelector(
                    ".services-strategy-details"
                );

                const otherSymbol = otherCard.querySelector(
                    ".services-strategy-symbol"
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                otherDetails.inert = true;

                otherSymbol.textContent = "+";

            });

            // Open selected card if it was previously closed
            if (!wasOpen) {

                card.classList.add("is-open");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

                details.inert = false;

                symbol.textContent = "−";

            }

        });

    });

}




/* =========================================================
   SERVICES - PERFORMANCE ENHANCEMENT CARDS
========================================================= */

const performanceCards = document.querySelectorAll(
    ".services-performance-card"
);

if (performanceCards.length > 0) {

    performanceCards.forEach(card => {

        const button = card.querySelector(
            ".services-performance-toggle"
        );

        const details = card.querySelector(
            ".services-performance-details"
        );

        const symbol = card.querySelector(
            ".services-performance-symbol"
        );

        button.addEventListener("click", () => {

            const wasOpen = card.classList.contains("is-open");

            // Close all Performance Enhancement cards
            performanceCards.forEach(otherCard => {

                otherCard.classList.remove("is-open");

                const otherButton = otherCard.querySelector(
                    ".services-performance-toggle"
                );

                const otherDetails = otherCard.querySelector(
                    ".services-performance-details"
                );

                const otherSymbol = otherCard.querySelector(
                    ".services-performance-symbol"
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                otherDetails.inert = true;

                otherSymbol.textContent = "+";

            });

            // Open the selected card
            if (!wasOpen) {

                card.classList.add("is-open");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

                details.inert = false;

                symbol.textContent = "−";

            }

        });

    });

}



/* =========================================================
   SERVICES - FINANCIAL MANAGEMENT EXPANDABLE CARDS
========================================================= */

const financialCards = document.querySelectorAll(
    ".services-financial-card"
);

if (financialCards.length > 0) {

    financialCards.forEach(card => {

        const button = card.querySelector(
            ".services-financial-toggle"
        );

        const details = card.querySelector(
            ".services-financial-details"
        );

        const symbol = card.querySelector(
            ".services-financial-symbol"
        );

        button.addEventListener("click", () => {

            const wasOpen = card.classList.contains("is-open");

            // Close all financial cards
            financialCards.forEach(otherCard => {

                otherCard.classList.remove("is-open");

                const otherButton = otherCard.querySelector(
                    ".services-financial-toggle"
                );

                const otherDetails = otherCard.querySelector(
                    ".services-financial-details"
                );

                const otherSymbol = otherCard.querySelector(
                    ".services-financial-symbol"
                );

                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                otherDetails.inert = true;

                otherSymbol.textContent = "+";

            });

            // Open selected card
            if (!wasOpen) {

                card.classList.add("is-open");

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

                details.inert = false;

                symbol.textContent = "−";

            }

        });

    });

}
