import * as THREE from 'three';
import { IntroScene } from './intro.js';
import { ProductScene } from './products.js';

class App {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.introCanvas = document.getElementById('intro-canvas');
        this.introScene = new IntroScene(this.introCanvas);
        this.productScenes = [];
        this.cartCount = 0;
        this.cartCountElement = document.querySelector('.cart-count');

        this.init();
    }

    async init() {
        // Intro Scene Removed for Static Photo Mode
        // this.introScene.init();

        // Initialize Product Scenes
        const products = ['mango', 'pomegranate', 'chocolate'];
        products.forEach(type => {
            const canvas = document.getElementById(`canvas-${type}`);
            if (canvas) {
                const scene = new ProductScene(canvas, type);
                scene.init();
                this.productScenes.push(scene);
            }
        });

        // Simulate asset loading
        await this.loadAssets();

        // Hide loading screen
        this.hideLoading();

        // Event Listeners
        window.addEventListener('resize', () => this.onResize());
        this.setupUIInteractions();
    }

    async loadAssets() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    hideLoading() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            // Trigger intro animation start
            this.introScene.playIntro();
        }, 500);
    }

    onResize() {
        // this.introScene.onResize(); // Disabled for static mode
        this.productScenes.forEach(scene => scene.onResize());
    }

    setupUIInteractions() {
        // Mobile Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // Smooth Scroll for Anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Watch Intro Button
        const watchBtn = document.getElementById('watch-intro');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.introScene.replay();
            });
        }

        // Add to Cart Functionality
        const cartButtons = document.querySelectorAll('.add-to-cart');
        console.log('Found cart buttons:', cartButtons.length);

        cartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Add to cart clicked');
                this.addToCart(e.currentTarget);
            });
        });
    }

    addToCart(btn) {
        this.cartCount++;
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.cartCount;

            // Cart Icon Animation
            if (this.cartCountElement.parentElement) {
                this.cartCountElement.parentElement.classList.add('bump');
                setTimeout(() => {
                    this.cartCountElement.parentElement.classList.remove('bump');
                }, 300);
            }
        }

        // Button Feedback
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.classList.add('added');

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('added');
        }, 2000);

        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('added');
        }, 2000);
    }
}

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
