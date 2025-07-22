// Global variables
let currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const slides = document.getElementById("slides");
const dots = document.getElementById("dots");
const countryName = document.getElementById("countryName");
const countryTime = document.getElementById("countryTime");
const timezoneInfo = document.getElementById("timezone-info");
const playPauseBtn = document.getElementById("playPauseBtn");

const total = slides.children.length;
let index = 0;
let autoplayInterval;
let isAutoplay = true;

// Clock functionality
function updateClock() {
    const now = new Date();

    try {
        const timeFormat = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: currentZone,
        });

        const dateFormat = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
            timeZone: currentZone,
        });

        document.getElementById("clock").textContent = timeFormat.format(now);
        document.getElementById("date").textContent = dateFormat.format(now);

        // Update timezone info
        const currentSlide = slides.children[index];
        const zoneName = currentSlide.dataset.zone;
        const countryNameText = currentSlide.dataset.country;

        timezoneInfo.textContent = `${countryNameText} Time (${zoneName})`;
        countryName.textContent = countryNameText;
        countryTime.textContent = `Time Zone: ${zoneName}`;
    } catch (error) {
        console.error("Error updating clock:", error);
        document.getElementById("clock").textContent = "Error";
        document.getElementById("date").textContent = "Unable to load time";
    }
}

// Slideshow functionality
function createDots() {
    dots.innerHTML = "";
    for (let i = 0; i < total; i++) {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dot.onclick = () => showSlide(i);
        dot.setAttribute(
            "aria-label",
            `Show ${slides.children[i].dataset.country}`
        );
        dots.appendChild(dot);
    }
}

function showSlide(i) {
    index = ((i % total) + total) % total;

    // Update slide position
    slides.style.transform = `translateX(-${index * 320}px)`;

    // Update dots
    document.querySelector(".dots .active")?.classList.remove("active");
    dots.children[index].classList.add("active");

    // Update timezone
    currentZone = slides.children[index].dataset.zone;
    updateClock();

    // Reset autoplay
    if (isAutoplay) {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        showSlide(index + 1);
    }, 4000);
}

function toggleAutoplay() {
    isAutoplay = !isAutoplay;
    if (isAutoplay) {
        startAutoplay();
        playPauseBtn.textContent = "Pause";
    } else {
        clearInterval(autoplayInterval);
        playPauseBtn.textContent = "Play";
    }
}

// Touch/swipe functionality
let startX = 0;
let isDragging = false;

slides.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    isDragging = true;
    slides.style.cursor = "grabbing";
});

slides.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
});

slides.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    slides.style.cursor = "grab";

    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) {
        showSlide(index + (dx < 0 ? 1 : -1));
    }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            showSlide(index - 1);
            break;
        case "ArrowRight":
            showSlide(index + 1);
            break;
        case " ":
            e.preventDefault();
            toggleAutoplay();
            break;
    }
});

// Background animation
function createBackgroundAnimation() {
    const bgAnimation = document.getElementById("bgAnimation");
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 6 + "s";
        particle.style.animationDuration = Math.random() * 3 + 3 + "s";
        bgAnimation.appendChild(particle);
    }
}

// Initialize everything
function init() {
    createDots();
    createBackgroundAnimation();
    updateClock();
    startAutoplay();

    setInterval(updateClock, 1000);

    // Show initial slide
    showSlide(0);
}

// Start when page loads
document.addEventListener("DOMContentLoaded", init);

// Handle visibility change (pause when tab is hidden)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearInterval(autoplayInterval);
    } else if (isAutoplay) {
        startAutoplay();
    }
});