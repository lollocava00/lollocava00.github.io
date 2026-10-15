console.log("Hello, world!");

/* fade in elements when they are scrolled into view */
const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.fade-up').forEach(function(el) {
    revealObserver.observe(el);
});

/* highlight nav link when section is in view */
const navMap = {};
document.querySelectorAll('nav a[href^="#"]').forEach(function(a) {
    navMap[a.getAttribute('href').slice(1)] = a;
});
const sectionSpy = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('nav a.active').forEach(function(x) {
            x.classList.remove('active');
        });
        const link = navMap[entry.target.id];
        if (link) {
            link.classList.add('active');
        }
    });
}, { rootMargin: '-35% 0px -60% 0px' });
document.querySelectorAll('section[id]').forEach(function(s) {
    sectionSpy.observe(s);
});

/* scroll to anchor with smooth animation */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = a.getAttribute('href');
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        try { history.pushState(null, '', href); } catch (err) {}
        var offset = window.matchMedia('(max-width: 768px)').matches ? 66 : 20;
        var startY = window.pageYOffset;
        var endY = target.getBoundingClientRect().top + startY - offset;
        var startTime = Date.now();
        var timer = setInterval(function() {
            var t = Math.min((Date.now() - startTime) / 900, 1);
            var ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            window.scrollTo(0, startY + (endY - startY) * ease);
            if (t >= 1) clearInterval(timer);
        }, 16);
    });
});