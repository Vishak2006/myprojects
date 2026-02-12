import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ProductScene {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.type = type;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bottle = null;
        this.floatingElements = [];
        this.clock = new THREE.Clock();
    }

    init() {
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 4;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Enhanced Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased from 0.6
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1.2);
        pointLight.position.set(2, 3, 4);
        this.scene.add(pointLight);

        // Rim Light (Backlight) to separate from dark background
        const rimLight = new THREE.PointLight(0xffffff, 1.5);
        rimLight.position.set(-2, 2, -3);
        this.scene.add(rimLight);

        // Create Bottle
        this.createBottle();

        // Create Particles/Floating Elements based on type
        this.createFloatingElements();

        // Controls (Static, no rotation)
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
        this.controls.autoRotate = false; // Static
        this.controls.enableRotate = false; // Disable user rotation too for "photo" feel

        this.animate();
    }

    createBottle() {
        // Simple Bottle Shape using LatheGeometry or Cylinder
        // Base
        const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);

        // Material based on type
        let color = 0xffffff;
        if (this.type === 'mango') color = 0xFFB84D;
        if (this.type === 'pomegranate') color = 0xFF0033; // Brighter Red
        if (this.type === 'chocolate') color = 0x8B4513; // Lighter/Richer Brown

        // Adjust opacity for darker liquids to be more visible
        const opacity = this.type === 'chocolate' ? 0.95 : 0.85;
        const metalness = this.type === 'chocolate' ? 0.3 : 0.1;

        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: metalness,
            roughness: 0.2,
            transmission: 0.2, // Less glass-like transmission to show color better
            thickness: 1.5,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide
        });

        this.bottle = new THREE.Mesh(geometry, material);
        this.scene.add(this.bottle);

        // Cap
        const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 1.35;
        this.bottle.add(cap);
    }

    createFloatingElements() {
        const count = 15;
        const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Bubbles/Particles

        let color = 0xffffff;
        if (this.type === 'mango') color = 0xFFD700;
        if (this.type === 'pomegranate') color = 0xFF0000;
        if (this.type === 'chocolate') color = 0x8B4513;

        const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });

        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Random position around bottle
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.2 + Math.random() * 0.5;
            const y = (Math.random() - 0.5) * 3;

            mesh.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );

            // Store custom data for animation
            mesh.userData = {
                angle: angle,
                radius: radius,
                y: y,
                speed: 0.5 + Math.random() * 0.5,
                yDir: Math.random() > 0.5 ? 1 : -1
            };

            this.scene.add(mesh);
            this.floatingElements.push(mesh);
        }
    }

    animate() {
        // Render once to create a static "photo"
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.canvas) return;
        const width = this.canvas.parentElement.clientWidth;
        const height = this.canvas.parentElement.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
