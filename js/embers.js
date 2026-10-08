(function () {
  const canvas = document.getElementById("embers");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: -9999, y: -9999, on: false };
  const sparks = [];
  const smoke = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let boost = 0;
  let lastScroll = window.scrollY;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeSpark(x, y, burst) {
    const speed = burst ? 0.8 + Math.random() * 1.8 : 0.15 + Math.random() * 0.55;
    sparks.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * (burst ? 1.4 : 0.35),
      vy: -speed,
      life: 1,
      fade: burst ? 0.012 + Math.random() * 0.018 : 0.0025 + Math.random() * 0.004,
      size: burst ? 1.4 + Math.random() * 1.6 : 0.7 + Math.random() * 1.3,
      heat: Math.random()
    });
  }

  function spawn(burst) {
    makeSpark(Math.random() * width, height - Math.random() * height * 0.25, burst);
  }

  function puff() {
    smoke.push({
      x: Math.random() * width,
      y: height * (0.45 + Math.random() * 0.55),
      r: 90 + Math.random() * 180,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.06 - Math.random() * 0.1,
      alpha: 0.03 + Math.random() * 0.025
    });
  }

  const baseCount = reduce ? 0 : (window.innerWidth < 720 ? 36 : 78);
  for (let i = 0; i < baseCount; i += 1) spawn(false);
  for (let i = 0; i < 6; i += 1) puff();

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.on = true;
    if (!reduce && Math.random() < 0.45) {
      makeSpark(event.clientX + (Math.random() - 0.5) * 24, event.clientY + 6, true);
    }
  });
  window.addEventListener("pointerleave", () => { pointer.on = false; });
  window.addEventListener("scroll", () => {
    boost = Math.min(1.4, boost + Math.abs(window.scrollY - lastScroll) / 280);
    lastScroll = window.scrollY;
  }, { passive: true });
  window.addEventListener("resize", resize);
  resize();

  function coalGlow(time) {
    const flicker = 0.82 + Math.sin(time * 0.0024) * 0.1 + Math.sin(time * 0.0061) * 0.05;
    const glow = ctx.createRadialGradient(width * 0.5, height + 30, 10, width * 0.5, height * 0.72, width * 0.62);
    glow.addColorStop(0, "rgba(196, 72, 18, " + (0.28 * flicker) + ")");
    glow.addColorStop(0.42, "rgba(224, 140, 48, " + (0.08 * flicker) + ")");
    glow.addColorStop(1, "rgba(12, 11, 9, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    const side = ctx.createRadialGradient(width * 0.08, height * 0.92, 0, width * 0.08, height * 0.92, width * 0.28);
    side.addColorStop(0, "rgba(224, 177, 90, " + (0.07 * flicker) + ")");
    side.addColorStop(1, "rgba(224, 177, 90, 0)");
    ctx.fillStyle = side;
    ctx.fillRect(0, 0, width, height);
  }

  function drawSmoke() {
    smoke.forEach((cloud) => {
      cloud.x += cloud.vx;
      cloud.y += cloud.vy;
      if (cloud.y < -cloud.r) {
        cloud.y = height + cloud.r * 0.3;
        cloud.x = Math.random() * width;
      }
      const fog = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
      fog.addColorStop(0, "rgba(168, 148, 128, " + cloud.alpha + ")");
      fog.addColorStop(1, "rgba(168, 148, 128, 0)");
      ctx.fillStyle = fog;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function colorOf(heat, life) {
    if (heat > 0.86) return "rgba(255, 236, 196, " + life + ")";
    if (heat > 0.5) return "rgba(240, 186, 92, " + life + ")";
    return "rgba(214, 96, 32, " + life + ")";
  }

  function drawSparks() {
    const cap = baseCount + Math.round(boost * 24);
    while (sparks.length < cap) spawn(false);
    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i];
      if (pointer.on) {
        const dx = spark.x - pointer.x;
        const dy = spark.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          spark.vx += (dx / (dist || 1)) * 0.09;
          spark.vy -= 0.045;
        }
      }
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.985;
      spark.life -= spark.fade;
      if (spark.life <= 0 || spark.y < -12 || spark.x < -20 || spark.x > width + 20) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = colorOf(spark.heat, Math.max(spark.life, 0));
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    if (sparks.length > cap + 40) sparks.splice(0, sparks.length - cap);
    boost *= 0.96;
  }

  function frame(time) {
    if (!document.hidden) {
      ctx.clearRect(0, 0, width, height);
      coalGlow(time);
      if (!reduce) {
        drawSmoke();
        drawSparks();
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  coalGlow(0);
  if (!reduce) requestAnimationFrame(frame);
})();
