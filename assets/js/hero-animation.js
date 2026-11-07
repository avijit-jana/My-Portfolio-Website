/**
 * Hero Background Animation using Three.js
 * Creates a dynamic particle system with connecting lines (Neural Network / Data visualization)
 */

(function () {
    function initHeroAnimation() {
        const container = document.getElementById('hero-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        let renderer;
        let width = container.offsetWidth || 380;
        let height = container.offsetHeight || 380;

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

        // --- Configuration ---
        const config = {
            maxParticles: 100,
            maxDistance: 150,
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

        // --- Setup Three.js ---
        const scene = new THREE.Scene();
        const safeAspect = height > 0 ? width / height : 1;
        const camera = new THREE.PerspectiveCamera(75, safeAspect, 0.1, 1000);
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        camera.position.z = 300;

        // --- Particles & Lines Setup ---
        const particlesData = [];
        const positions = new Float32Array(config.maxParticles * 3);
        
        // We'll use a single geometry for the line segments
        const lineGeometry = new THREE.BufferGeometry();
        const maxConnections = (config.maxParticles * config.maxParticles) / 2;
        const linePositions = new Float32Array(maxConnections * 2 * 3);
        const lineColors = new Float32Array(maxConnections * 2 * 3);

        // Color extraction
        const r = ((config.lineColor >> 16) & 255) / 255;
        const g = ((config.lineColor >> 8) & 255) / 255;
        const b = (config.lineColor & 255) / 255;

        // Initialize Particles
        for (let i = 0; i < config.maxParticles; i++) {
            const x = (Math.random() - 0.5) * 600;
            const y = (Math.random() - 0.5) * 600;
            const z = (Math.random() - 0.5) * 600;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * config.speed,
                    (Math.random() - 0.5) * config.speed,
                    (Math.random() - 0.5) * config.speed
                )
            });
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

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

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lineMesh);

        // --- Animation Logic ---
        function animate() {
            requestAnimationFrame(animate);

            let vertexPos = 0;
            let colorPos = 0;

            // Smoothly interpolate mouse target
            mouse.x += (mouse.targetX - mouse.x) * config.mouseInfluence;
            mouse.y += (mouse.targetY - mouse.y) * config.mouseInfluence;

            // Subtle camera rotation based on mouse
            camera.position.x = mouse.x * 50;
            camera.position.y = -mouse.y * 50;
            camera.lookAt(scene.position);

            // Update positions
            for (let i = 0; i < config.maxParticles; i++) {
                positions[i * 3] += particlesData[i].velocity.x;
                positions[i * 3 + 1] += particlesData[i].velocity.y;
                positions[i * 3 + 2] += particlesData[i].velocity.z;

                // Bounce off "walls"
                if (Math.abs(positions[i * 3]) > 300) particlesData[i].velocity.x *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 300) particlesData[i].velocity.y *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 300) particlesData[i].velocity.z *= -1;

                // Connect lines
                for (let j = i + 1; j < config.maxParticles; j++) {
                    const dx = positions[i * 3] - positions[j * 3];
                    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                    const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz;

                    if (distSq < config.maxDistance * config.maxDistance) {
                        const dist = Math.sqrt(distSq);
                        const opacity = 1.0 - dist / config.maxDistance;

                        // Line positions
                        linePositions[vertexPos++] = positions[i * 3];
                        linePositions[vertexPos++] = positions[i * 3 + 1];
                        linePositions[vertexPos++] = positions[i * 3 + 2];
                        linePositions[vertexPos++] = positions[j * 3];
                        linePositions[vertexPos++] = positions[j * 3 + 1];
                        linePositions[vertexPos++] = positions[j * 3 + 2];

                        // Vertex colors with distance-based opacity
                        lineColors[colorPos++] = r * opacity;
                        lineColors[colorPos++] = g * opacity;
                        lineColors[colorPos++] = b * opacity;
                        lineColors[colorPos++] = r * opacity;
                        lineColors[colorPos++] = g * opacity;
                        lineColors[colorPos++] = b * opacity;
                    }
                }
            }

            // Update geometries
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, vertexPos), 3));
            lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0, colorPos), 3));
            
            pointCloud.geometry.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        }

        // --- Interaction with passive listeners ---
        window.addEventListener('mousemove', (e) => {
            const w = window.innerWidth || document.documentElement.clientWidth || 1;
            const h = window.innerHeight || document.documentElement.clientHeight || 1;
            mouse.targetX = (e.clientX / w) * 2 - 1;
            mouse.targetY = (e.clientY / h) * 2 - 1;
        }, { passive: true });

        // Handle Resize
        window.addEventListener('resize', () => {
            if (!container || !renderer || !camera) return;
            width = container.offsetWidth || 380;
            height = container.offsetHeight || 380;
            camera.aspect = height > 0 ? width / height : 1;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, { passive: true });

        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroAnimation);
    } else {
        initHeroAnimation();
    }
})();
