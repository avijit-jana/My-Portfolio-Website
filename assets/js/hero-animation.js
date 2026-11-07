/**
 * Hero Background Animation using Three.js
 * Ultra-smooth, zero-allocation particle system with connecting lines (Neural Network / Data visualization)
 * Performance optimizations:
 * - Single-allocation Float32Array buffers with DynamicDrawUsage and setDrawRange (0 GC pressure)
 * - IntersectionObserver pausing when off-screen (0 CPU/GPU waste while browsing other sections)
 * - Page Visibility API pausing when browser tab is inactive
 * - Responsive particle budget (capped on mobile to prevent GPU thermal throttling)
 * - Throttled mouse & resize handlers with requestAnimationFrame
 * - Reduced motion accessibility support
 */

(function () {
    function initHeroAnimation() {
        const container = document.getElementById('hero-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        // Respect user accessibility preference
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = container.offsetWidth || 380;
        let height = container.offsetHeight || 380;
        let renderer;

        try {
            renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: true,
                powerPreference: "high-performance"
            });
        } catch (e) {
            console.warn('WebGL initialization skipped:', e.message);
            return;
        }

        // --- Adaptive Performance Configuration ---
        const isMobile = (window.innerWidth || 380) < 768;
        const config = {
            maxParticles: isMobile ? 45 : 75,
            maxDistance: isMobile ? 130 : 145,
            particleColor: 0x6366f1, // Indigo-500
            lineColor: 0x818cf8,     // Indigo-400
            particleSize: 2.5,
            speed: 0.15,
            mouseInfluence: 0.05
        };

        // --- Mouse State ---
        const mouse = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0
        };

        // --- Setup Three.js Scene & Camera ---
        const scene = new THREE.Scene();
        const safeAspect = height > 0 ? width / height : 1;
        const camera = new THREE.PerspectiveCamera(75, safeAspect, 0.1, 1000);
        camera.position.z = 300;
        
        // Cap pixel ratio at 1.5 to save massive GPU fillrate on high-DPI screens without visual loss
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // --- Particles & Lines Setup (Zero-GC Preallocation) ---
        const particlesData = [];
        const positions = new Float32Array(config.maxParticles * 3);
        
        // Maximum possible pairs: N * (N - 1) / 2
        const maxConnections = (config.maxParticles * (config.maxParticles - 1)) / 2;
        const linePositions = new Float32Array(maxConnections * 2 * 3);
        const lineColors = new Float32Array(maxConnections * 2 * 3);

        // Base line color components
        const r = ((config.lineColor >> 16) & 255) / 255;
        const g = ((config.lineColor >> 8) & 255) / 255;
        const b = (config.lineColor & 255) / 255;

        // Initialize Particles
        for (let i = 0; i < config.maxParticles; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

            particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * config.speed,
                    (Math.random() - 0.5) * config.speed,
                    (Math.random() - 0.5) * config.speed
                )
            });
        }

        // Particle Point Cloud
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesPosAttr = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
        particlesGeometry.setAttribute('position', particlesPosAttr);

        const particlesMaterial = new THREE.PointsMaterial({
            color: config.particleColor,
            size: config.particleSize,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: true,
            opacity: 0.8
        });

        const pointCloud = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(pointCloud);

        // Single Dynamic Line Geometry
        const lineGeometry = new THREE.BufferGeometry();
        const linePosAttr = new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage);
        const lineColAttr = new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage);
        
        lineGeometry.setAttribute('position', linePosAttr);
        lineGeometry.setAttribute('color', lineColAttr);

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineMesh);

        // If reduced motion is requested, render once and finish
        if (prefersReducedMotion) {
            renderer.render(scene, camera);
            return;
        }

        // --- Lifecycle & Visibility State ---
        let isVisible = true;
        let animId = null;

        function startLoop() {
            if (!animId && isVisible && !document.hidden) {
                animId = requestAnimationFrame(animate);
            }
        }

        function stopLoop() {
            if (animId) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }

        // --- Animation Loop ---
        const maxDistSq = config.maxDistance * config.maxDistance;

        function animate() {
            if (!isVisible || document.hidden) {
                animId = null;
                return;
            }

            animId = requestAnimationFrame(animate);

            let vertexPos = 0;
            let colorPos = 0;

            // Smoothly interpolate mouse target
            mouse.x += (mouse.targetX - mouse.x) * config.mouseInfluence;
            mouse.y += (mouse.targetY - mouse.y) * config.mouseInfluence;

            // Subtle camera rotation based on mouse
            camera.position.x = mouse.x * 50;
            camera.position.y = -mouse.y * 50;
            camera.lookAt(scene.position);

            // Update particle positions
            for (let i = 0; i < config.maxParticles; i++) {
                const i3 = i * 3;
                positions[i3] += particlesData[i].velocity.x;
                positions[i3 + 1] += particlesData[i].velocity.y;
                positions[i3 + 2] += particlesData[i].velocity.z;

                // Bounce off boundaries
                if (Math.abs(positions[i3]) > 300) particlesData[i].velocity.x *= -1;
                if (Math.abs(positions[i3 + 1]) > 300) particlesData[i].velocity.y *= -1;
                if (Math.abs(positions[i3 + 2]) > 300) particlesData[i].velocity.z *= -1;

                // Connect lines
                for (let j = i + 1; j < config.maxParticles; j++) {
                    const j3 = j * 3;
                    const dx = positions[i3] - positions[j3];
                    const dy = positions[i3 + 1] - positions[j3 + 1];
                    const dz = positions[i3 + 2] - positions[j3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < maxDistSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity = 1.0 - dist / config.maxDistance;

                        // Vertex 1
                        linePositions[vertexPos++] = positions[i3];
                        linePositions[vertexPos++] = positions[i3 + 1];
                        linePositions[vertexPos++] = positions[i3 + 2];

                        // Vertex 2
                        linePositions[vertexPos++] = positions[j3];
                        linePositions[vertexPos++] = positions[j3 + 1];
                        linePositions[vertexPos++] = positions[j3 + 2];

                        // Vertex colors
                        const c = r * opacity;
                        const cg = g * opacity;
                        const cb = b * opacity;

                        lineColors[colorPos++] = c;
                        lineColors[colorPos++] = cg;
                        lineColors[colorPos++] = cb;
                        lineColors[colorPos++] = c;
                        lineColors[colorPos++] = cg;
                        lineColors[colorPos++] = cb;
                    }
                }
            }

            // GPU buffer updates with zero memory allocation
            lineGeometry.setDrawRange(0, vertexPos / 3);
            linePosAttr.needsUpdate = true;
            lineColAttr.needsUpdate = true;
            particlesPosAttr.needsUpdate = true;
            
            renderer.render(scene, camera);
        }

        // --- Passive Interaction Listeners ---
        window.addEventListener('mousemove', (e) => {
            if (!isVisible) return;
            const w = window.innerWidth || 1;
            const h = window.innerHeight || 1;
            mouse.targetX = (e.clientX / w) * 2 - 1;
            mouse.targetY = (e.clientY / h) * 2 - 1;
        }, { passive: true });

        // Throttled Resize with RAF
        let resizeTicking = false;
        window.addEventListener('resize', () => {
            if (resizeTicking) return;
            resizeTicking = true;
            requestAnimationFrame(() => {
                resizeTicking = false;
                if (!container || !renderer || !camera) return;
                width = container.offsetWidth || 380;
                height = container.offsetHeight || 380;
                camera.aspect = height > 0 ? width / height : 1;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            });
        }, { passive: true });

        // IntersectionObserver to pause loop when scrolled out of view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
                if (isVisible) {
                    startLoop();
                } else {
                    stopLoop();
                }
            }, { threshold: 0.05 });
            observer.observe(container);
        }

        // Page Visibility API to pause loop when tab is backgrounded
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopLoop();
            } else if (isVisible) {
                startLoop();
            }
        }, { passive: true });

        // Kick off loop
        startLoop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroAnimation);
    } else {
        initHeroAnimation();
    }
})();
