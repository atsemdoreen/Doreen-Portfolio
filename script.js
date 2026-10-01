// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", false);
    })
);

// Dark / light mode (remembers the choice)
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
);

// Highlight the nav link for the section in view
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => observer.observe(s));

// Contact form validation
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
function check(id, message, test) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    const ok = test(field.value.trim());
    error.textContent = ok ? "" : message;
    field.setAttribute("aria-invalid", !ok);
    return ok;
}
form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = [
        check("name", "Enter your name.", v => v.length > 1),
        check("email", "Enter a valid email address.", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
        check("message", "Write a message of at least 10 characters.", v => v.length >= 10)
    ].every(Boolean);
    if (!valid) { status.textContent = ""; return; }

    // Opens the visitor's email app. Replace with Netlify Forms later for in-page sending.
    const name = encodeURIComponent(document.getElementById("name").value.trim());
    const body = encodeURIComponent(document.getElementById("message").value.trim());
    window.location.href = `mailto:YOUR-EMAIL@example.com?subject=Portfolio message from ${name}&body=${body}`;
    status.textContent = "Opening your email app to send the message.";
    form.reset();
});
