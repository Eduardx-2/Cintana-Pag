function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("open");
}

(function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let w, h, nodes;

    const ACCENT = "127, 216, 88"; // rgb of --accent
    const LINE = "38, 48, 42"; // rgb of --line

    const MOUSE_RADIUS = 220;
    const LINK_DIST = 170;
    const MAX_NODES = 260; // límite para que no se sature al hacer clic muchas veces

    const mouse = { x: -9999, y: -9999, active: false };

    function makeNode(x, y, born) {
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            born: !!born,
            age: 0,
        };
    }

    function resize() {
        const prevW = w, prevH = h;
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;

        if (!nodes) {
            const count = Math.min(130, Math.floor((w * h) / 12000));
            nodes = Array.from({ length: count }, () =>
                makeNode(Math.random() * w, Math.random() * h)
            );
        } else if (prevW && prevH) {
            // reubica proporcionalmente al redimensionar, conserva las bolitas creadas por clic
            const sx = w / prevW, sy = h / prevH;
            for (const n of nodes) {
                n.x *= sx;
                n.y *= sy;
            }
        }
    }

    function addNodeAt(x, y) {
        nodes.push(makeNode(x, y, true));
        if (nodes.length > MAX_NODES) {
            // quita las bolitas base más antiguas primero para no crecer sin límite
            const idx = nodes.findIndex((n) => !n.born);
            if (idx !== -1) nodes.splice(idx, 1);
            else nodes.shift();
        }
    }

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    window.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    // Clic izquierdo sobre el canvas: agrega una bolita nueva con el mismo comportamiento
    canvas.addEventListener("click", (e) => {
        if (e.button !== 0) return;
        addNodeAt(e.clientX, e.clientY);
    });

    // Soporte táctil: un toque también agrega una bolita
    canvas.addEventListener(
        "touchstart",
        (e) => {
            const t = e.touches[0];
            if (!t) return;
            mouse.x = t.clientX;
            mouse.y = t.clientY;
            mouse.active = true;
            addNodeAt(t.clientX, t.clientY);
        },
        { passive: true }
    );

    function step() {
        ctx.clearRect(0, 0, w, h);

        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;

            if (n.age < 1) n.age += 0.06; // pequeño efecto de aparición para las nuevas

            if (mouse.active) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0.01) {
                    const force = (1 - dist / MOUSE_RADIUS) * 1.1;
                    n.x += (dx / dist) * force;
                    n.y += (dy / dist) * force;
                }
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    const alpha = (1 - dist / LINK_DIST) * 1.4 * Math.min(a.age, b.age);
                    ctx.strokeStyle = `rgba(${LINE}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        if (mouse.active) {
            for (const n of nodes) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - dist / MOUSE_RADIUS) * 0.8 * n.age})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
            ctx.fillStyle = `rgba(${ACCENT}, 1)`;
            ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        for (const n of nodes) {
            const r = n.born ? 2.6 * n.age : 2;
            ctx.fillStyle = `rgba(${ACCENT}, ${0.85 * n.age})`;
            ctx.shadowColor = `rgba(${ACCENT}, ${0.6 * n.age})`;
            ctx.shadowBlur = n.born ? 8 : 4;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0;

        requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    resize();
    step();
})();