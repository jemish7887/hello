// =============================================
// ORIGINAL VIDEO HOVER (kept intact)
// =============================================
const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const hoverSign = document.querySelector('.hover-sign');

const videoList = [video1, video2, video3].filter(Boolean);

videoList.forEach(function(video) {
    video.addEventListener("mouseover", function() {
        video.play();
        if (hoverSign) hoverSign.classList.add("active");
    });
    video.addEventListener("mouseout", function() {
        video.pause();
        if (hoverSign) hoverSign.classList.remove("active");
    });
});

// Sidebar
menu.addEventListener("click", function() {
    sideBar.classList.remove("close-sidebar");
    sideBar.classList.add("open-sidebar");
});

closeIcon.addEventListener("click", function() {
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
});

// =============================================
// SMOOTH NAV SCROLL WITH ANIMATION
// =============================================

function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'nav-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);

    // Get header height to offset scroll
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 70;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

    window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
    });
}

// Attach to all nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            smoothScrollTo(href);

            // Close sidebar if open
            sideBar.classList.remove("open-sidebar");
            sideBar.classList.add("close-sidebar");

            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll(`.nav-link[href="${href}"]`).forEach(l => l.classList.add('active'));
        }
    });
});

// =============================================
// ACTIVE NAV ON SCROLL (highlight as you scroll)
// =============================================

const sections = [
    { id: 'hero-section',     href: '#hero-section'     },
    { id: 'about-section',    href: '#about-section'    },
    { id: 'projects-section', href: '#projects-section' },
    { id: 'skills-section',   href: '#skills-section'   },
    { id: 'contact-section',  href: '#contact-section'  },
];

function updateActiveNav() {
    const scrollY = window.scrollY;
    const header = document.querySelector('header');
    const offset = header ? header.offsetHeight + 40 : 110;

    let current = sections[0].href;

    sections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        if (el.getBoundingClientRect().top + window.scrollY - offset <= scrollY) {
            current = sec.href;
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// =============================================
// WEB3FORMS CONTACT FORM
// =============================================

const WEB3FORMS_ACCESS_KEY = "7568d170-9d57-4f92-b54a-244d64ec75f5";

async function sendEmail() {
    const name    = document.getElementById("from_name").value.trim();
    const email   = document.getElementById("reply_to").value.trim();
    const message = document.getElementById("message").value.trim();
    const btn     = document.getElementById("send-btn");

    // Basic validation
    if (!name || !email || !message) {
        alert("Please fill in all fields! ✏️");
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address! 📧");
        return;
    }

    // Button loading state
    btn.disabled = true;
    btn.innerHTML = "Sending... <i class='bx bx-loader-alt bx-spin'></i>";

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                name: name,
                email: email,
                message: message,
                // Optional: customize the subject line of the email you receive
                subject: `New message from ${name} via Portfolio`
            })
        });

        const data = await response.json();

        if (data.success) {
            btn.innerHTML = "Sent! ✅ <i class='bx bx-check'></i>";
            btn.style.background = "#28a745";

            // Clear the fields
            document.getElementById("from_name").value = "";
            document.getElementById("reply_to").value  = "";
            document.getElementById("message").value   = "";

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = "Send Message <i class='bx bx-mail-send'></i>";
                btn.style.background = "";
            }, 3000);
        } else {
            throw new Error(data.message || "Submission failed");
        }

    } catch (error) {
        console.error("Web3Forms error:", error);
        btn.innerHTML = "Failed ❌ Try Again";
        btn.style.background = "#dc3545";
        btn.disabled = false;

        setTimeout(() => {
            btn.innerHTML = "Send Message <i class='bx bx-mail-send'></i>";
            btn.style.background = "";
        }, 3000);
    }
}