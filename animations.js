// Wait for GSAP and ScrollTrigger to be loaded
const initAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Parallax
    gsap.to(".hero-section", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 200,
        opacity: 0
    });

    // Product Reveals
    document.querySelectorAll('.product-container').forEach((container, index) => {
        const direction = index % 2 === 0 ? -100 : 100;

        gsap.from(container.querySelector('.glass-panel'), {
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            x: direction,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        });

        gsap.from(container.querySelector('.product-details'), {
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1.5,
            delay: 0.2,
            ease: "power3.out"
        });
    });

    // Benefits List Stagger
    document.querySelectorAll('.benefits-list').forEach(list => {
        gsap.from(list.children, {
            scrollTrigger: {
                trigger: list,
                start: "top 85%",
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    });

    // Footer Parallax
    gsap.from("footer", {
        scrollTrigger: {
            trigger: "footer",
            start: "top bottom",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1
    });
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}
