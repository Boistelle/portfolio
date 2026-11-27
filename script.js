
/* =====================================================
   MOTION DESIGN PORTFOLIO — 3D OBJECTS
   Cube bleu / Sphère rouge / Prisme vert
===================================================== */

if (typeof THREE === "undefined") {
    console.error("Three.js n'est pas chargé dans index.html");
} else {
    const container = document.getElementById("objectsScene");

    if (container) {
        // -------------------------------------------------
        // SCÈNE
        // -------------------------------------------------

        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            -window.innerHeight / 2,
            1,
            2000
        );

        camera.position.z = 800;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.NoToneMapping;
        renderer.toneMappingExposure = 1;

        container.appendChild(renderer.domElement);

        // -------------------------------------------------
        // ENVIRONNEMENT POUR LES REFLETS
        // -------------------------------------------------

        const envCanvas = document.createElement("canvas");
        envCanvas.width = 1024;
        envCanvas.height = 512;

        const ctx = envCanvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.25, "#777777");
        gradient.addColorStop(0.5, "#181818");
        gradient.addColorStop(0.75, "#999999");
        gradient.addColorStop(1, "#ffffff");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);

        // Grandes sources lumineuses réfléchies
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(100, 80, 220, 35);
        ctx.fillRect(480, 40, 100, 220);
        ctx.fillRect(780, 100, 180, 45);

        ctx.fillStyle = "#aaaaaa";
        ctx.fillRect(350, 300, 180, 25);
        ctx.fillRect(850, 350, 100, 80);

        const environmentTexture = new THREE.CanvasTexture(envCanvas);
        environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
        environmentTexture.encoding = THREE.sRGBEncoding;

        scene.environment = environmentTexture;

        // -------------------------------------------------
        // ÉCLAIRAGE
        // -------------------------------------------------

        scene.add(new THREE.AmbientLight(0xffffff, 0.65));

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
        mainLight.position.set(-250, 400, 500);
        scene.add(mainLight);

        const topLight = new THREE.PointLight(0xffffff, 45, 1100);
        topLight.position.set(0, 350, 300);
        scene.add(topLight);

        const blueLight = new THREE.PointLight(0x0055ff, 35, 650);
        blueLight.position.set(-350, 100, 180);
        scene.add(blueLight);

        const redLight = new THREE.PointLight(0xff0033, 35, 650);
        redLight.position.set(350, -100, 180);
        scene.add(redLight);

        const greenLight = new THREE.PointLight(0x00ff55, 35, 650);
        greenLight.position.set(0, -300, 180);
        scene.add(greenLight);

        // -------------------------------------------------
        // MATÉRIAUX — COULEURS SATURÉES ET REFLETS
        // -------------------------------------------------

        // CUBE — BLEU RGB
        const blueMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0000ff,
            metalness: 0.25,
            roughness: 0.08,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1,
            clearcoatRoughness: 0.025,
            reflectivity: 1,
            envMapIntensity: 1.2
        });

        // SPHÈRE — ROUGE RGB
        const redMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            metalness: 0.25,
            roughness: 0.08,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1,
            clearcoatRoughness: 0.025,
            reflectivity: 1,
            envMapIntensity: 1.2
        });

        // PRISME — VERT RGB
        const greenMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00,
            metalness: 0.25,
            roughness: 0.08,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1,
            clearcoatRoughness: 0.025,
            reflectivity: 1,
            envMapIntensity: 1.2
        });

        // -------------------------------------------------
        // CRÉATION DES 3 FORMES 3D
        // -------------------------------------------------

        // CUBE BLEU
        const cubeGeometry = new THREE.BoxGeometry(115, 115, 115);
        const cube = new THREE.Mesh(cubeGeometry, blueMaterial);
        scene.add(cube);

        // SPHÈRE ROUGE
        const sphereGeometry = new THREE.SphereGeometry(72, 96, 96);
        const sphere = new THREE.Mesh(sphereGeometry, redMaterial);
        scene.add(sphere);

        // PRISME TRIANGULAIRE VERT
        const prismGeometry = new THREE.CylinderGeometry(
            75, 75, 100, 3, 1, false
        );

        const prism = new THREE.Mesh(prismGeometry, greenMaterial);
        prism.rotation.x = Math.PI / 2;
        scene.add(prism);

        // -------------------------------------------------
        // PHYSIQUE ET MOUVEMENT
        // -------------------------------------------------

        const mouse = {
            x: 0,
            y: 0
        };

        const objects = [
            {
                mesh: cube,
                x: -170,
                y: 80,
                vx: 0,
                vy: 0,
                offsetX: -110,
                offsetY: 80,
                radius: 82,
                rotationX: 0.009,
                rotationY: 0.012,
                rotationZ: 0.004,
                z: -10,
                scale: 0
            },
            {
                mesh: sphere,
                x: 130,
                y: -40,
                vx: 0,
                vy: 0,
                offsetX: 130,
                offsetY: -70,
                radius: 72,
                rotationX: 0.007,
                rotationY: 0.011,
                rotationZ: 0.006,
                z: 15,
                scale: 0
            },
            {
                mesh: prism,
                x: 0,
                y: -180,
                vx: 0,
                vy: 0,
                offsetX: -100,
                offsetY: -100,
                radius: 82,
                rotationX: 0.011,
                rotationY: 0.008,
                rotationZ: 0.009,
                z: 0,
                scale: 0
            }
        ];

        objects.forEach((obj) => {
            obj.mesh.position.set(obj.x, obj.y, obj.z);
            obj.mesh.scale.setScalar(0);
        });

        // Apparition avec rebond
        objects.forEach((obj, index) => {
            if (typeof gsap !== "undefined") {
                gsap.to(obj, {
                    scale: 1,
                    duration: 1.4,
                    delay: 0.3 + index * 0.25,
                    ease: "elastic.out(1, 0.55)",
                    onUpdate: () => {
                        obj.mesh.scale.setScalar(obj.scale);
                    }
                });
            } else {
                obj.scale = 1;
                obj.mesh.scale.setScalar(1);
            }
        });

        // -------------------------------------------------
        // SOURIS
        // -------------------------------------------------

        window.addEventListener("mousemove", (event) => {
            mouse.x = event.clientX - window.innerWidth / 2;
            mouse.y = window.innerHeight / 2 - event.clientY;
        });

        // -------------------------------------------------
        // COLLISIONS ENTRE LES FORMES
        // -------------------------------------------------

        function handleCollisions() {
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    const a = objects[i];
                    const b = objects[j];

                    let dx = b.x - a.x;
                    let dy = b.y - a.y;

                    let distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = a.radius + b.radius;

                    if (distance < minDistance) {
                        if (distance < 0.001) {
                            dx = 1;
                            dy = 0;
                            distance = 1;
                        }

                        const nx = dx / distance;
                        const ny = dy / distance;

                        // Écarte les formes pour éviter qu'elles se traversent
                        const overlap = minDistance - distance;
                        const correction = overlap * 0.52;

                        a.x -= nx * correction;
                        a.y -= ny * correction;

                        b.x += nx * correction;
                        b.y += ny * correction;

                        // Impulsion de collision
                        const relativeVelocityX = b.vx - a.vx;
                        const relativeVelocityY = b.vy - a.vy;

                        const velocityAlongNormal =
                            relativeVelocityX * nx +
                            relativeVelocityY * ny;

                        if (velocityAlongNormal < 0) {
                            const restitution = 0.9;
                            const impulse =
                                -(1 + restitution) * velocityAlongNormal / 2;

                            a.vx -= impulse * nx;
                            a.vy -= impulse * ny;

                            b.vx += impulse * nx;
                            b.vy += impulse * ny;
                        }
                    }
                }
            }
        }

        // -------------------------------------------------
        // ANIMATION
        // -------------------------------------------------

        let previousTime = 0;

        function animate(time) {
            requestAnimationFrame(animate);

            const delta = previousTime
                ? Math.min((time - previousTime) / 16.67, 2)
                : 1;

            previousTime = time;

            const width = window.innerWidth;
            const height = window.innerHeight;

            // Chaque forme suit la précédente avec un retard physique
            objects.forEach((obj, index) => {
                let targetX;
                let targetY;

                if (index === 0) {
                    targetX = mouse.x + obj.offsetX;
                    targetY = mouse.y + obj.offsetY;
                } else {
                    const previous = objects[index - 1];

                    targetX = previous.x + obj.offsetX;
                    targetY = previous.y + obj.offsetY;
                }

                // Ressort + inertie
                const spring = 0.012;
                const damping = 0.91;

                obj.vx += (targetX - obj.x) * spring * delta;
                obj.vy += (targetY - obj.y) * spring * delta;

                obj.vx *= Math.pow(damping, delta);
                obj.vy *= Math.pow(damping, delta);

                obj.x += obj.vx * delta;
                obj.y += obj.vy * delta;

                // Rotation indépendante
                obj.mesh.rotation.x +=
                    obj.rotationX * delta + obj.vy * 0.00008;

                obj.mesh.rotation.y +=
                    obj.rotationY * delta + obj.vx * 0.00008;

                obj.mesh.rotation.z += obj.rotationZ * delta;
            });

            // Résolution des collisions
            handleCollisions();

            // Limites de l'écran + rebond
            objects.forEach((obj) => {
                const limitX = width / 2 - obj.radius;
                const limitY = height / 2 - obj.radius;

                if (obj.x > limitX) {
                    obj.x = limitX;
                    obj.vx = -Math.abs(obj.vx) * 0.85;
                }

                if (obj.x < -limitX) {
                    obj.x = -limitX;
                    obj.vx = Math.abs(obj.vx) * 0.85;
                }

                if (obj.y > limitY) {
                    obj.y = limitY;
                    obj.vy = -Math.abs(obj.vy) * 0.85;
                }

                if (obj.y < -limitY) {
                    obj.y = -limitY;
                    obj.vy = Math.abs(obj.vy) * 0.85;
                }

                obj.mesh.position.set(obj.x, obj.y, obj.z);
            });

            renderer.render(scene, camera);
        }

        requestAnimationFrame(animate);

        // -------------------------------------------------
        // RESPONSIVE
        // -------------------------------------------------

        window.addEventListener("resize", () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = -height / 2;

            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }
}

// =====================================================
// INTRO GSAP
// =====================================================

if (typeof gsap !== "undefined") {
    const intro = gsap.timeline();

    intro.to(".hero-text", {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power4.out",
        delay: 0.3
    });

    intro.from(".header", {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "power3.out"
    }, "-=1");
}

// =====================================================
// TITRE MACHINE À ÉCRIRE
// =====================================================

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

if (line1 && line2) {
    const text1 = "MOTION";
    const text2 = "DESIGNER";

    let index1 = 0;
    let index2 = 0;

    function typeFirstLine() {
        if (index1 < text1.length) {
            line1.textContent += text1.charAt(index1);
            index1++;
            setTimeout(typeFirstLine, 100);
        } else {
            setTimeout(typeSecondLine, 250);
        }
    }

    function typeSecondLine() {
        if (index2 < text2.length) {
            line2.textContent += text2.charAt(index2);
            index2++;
            setTimeout(typeSecondLine, 100);
        }
    }

    setTimeout(typeFirstLine, 1200);
}

// =====================================================
// MODAL VIMEO
// =====================================================

const showreelButton = document.getElementById("openShowreel");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const vimeoPlayer = document.getElementById("vimeoPlayer");

if (showreelButton && modal && closeModal && vimeoPlayer) {

    showreelButton.addEventListener("click", () => {
        modal.classList.add("active");

        vimeoPlayer.src =
            "https://player.vimeo.com/video/671901247?autoplay=1";
    });

    function stopVideo() {
        modal.classList.remove("active");
        vimeoPlayer.src = "";
    }

    closeModal.addEventListener("click", stopVideo);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            stopVideo();
        }
    });
}
