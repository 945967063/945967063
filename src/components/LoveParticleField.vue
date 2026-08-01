<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type ParticleKind = "heart" | "spark" | "ring";

interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationVelocity: number;
  life: number;
  maxLife: number;
  color: string;
  burst: boolean;
}

const colors = ["#ff4f9a", "#ff8bc7", "#f7b7ff", "#72e6ff", "#f5f7ff"];
const canvasRef = ref<HTMLCanvasElement | null>(null);
const particles: Particle[] = [];

let context: CanvasRenderingContext2D | null = null;
let animationFrameId = 0;
let width = 0;
let height = 0;
let pixelRatio = 1;
let previousTime = 0;
let spawnAccumulator = 0;
let isMobile = false;
let reduceMotion = false;
let isVisible = true;

const particleLimit = () => (isMobile ? 64 : 110);

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const createIdleParticle = (initial = false): Particle => {
  const maxLife = 3.8 + Math.random() * 2.5;
  return {
    kind: Math.random() > 0.26 ? "heart" : "spark",
    x: Math.random() * width,
    y: initial ? Math.random() * height : height + 24,
    vx: -10 + Math.random() * 20,
    vy: -(28 + Math.random() * 38),
    size: isMobile ? 7 + Math.random() * 8 : 8 + Math.random() * 12,
    rotation: Math.random() * Math.PI * 2,
    rotationVelocity: -0.45 + Math.random() * 0.9,
    life: initial ? Math.random() * maxLife : maxLife,
    maxLife,
    color: randomColor(),
    burst: false,
  };
};

const addParticle = (particle: Particle) => {
  if (particles.length >= particleLimit()) particles.shift();
  particles.push(particle);
};

const drawHeart = (particle: Particle) => {
  if (!context) return;
  const scale = particle.size / 18;
  context.beginPath();
  context.moveTo(0, 5 * scale);
  context.bezierCurveTo(-13 * scale, -3 * scale, -8 * scale, -14 * scale, 0, -7 * scale);
  context.bezierCurveTo(8 * scale, -14 * scale, 13 * scale, -3 * scale, 0, 5 * scale);
  context.fill();
};

const drawSpark = (particle: Particle) => {
  if (!context) return;
  const radius = particle.size * 0.55;
  context.beginPath();
  context.moveTo(0, -radius);
  context.lineTo(radius * 0.28, -radius * 0.28);
  context.lineTo(radius, 0);
  context.lineTo(radius * 0.28, radius * 0.28);
  context.lineTo(0, radius);
  context.lineTo(-radius * 0.28, radius * 0.28);
  context.lineTo(-radius, 0);
  context.lineTo(-radius * 0.28, -radius * 0.28);
  context.closePath();
  context.fill();
};

const drawParticle = (particle: Particle) => {
  if (!context) return;
  const progress = 1 - particle.life / particle.maxLife;
  const fadeIn = Math.min(1, progress * 7);
  const fadeOut = Math.min(1, particle.life * (particle.burst ? 2.4 : 1.1));
  const alpha = Math.min(fadeIn, fadeOut) * (particle.burst ? 0.95 : 0.58);

  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation);
  context.globalAlpha = alpha;
  context.fillStyle = particle.color;
  context.strokeStyle = particle.color;

  if (!isMobile && particle.burst) {
    context.shadowBlur = 10;
    context.shadowColor = particle.color;
  }

  if (particle.kind === "ring") {
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(0, 0, particle.size * (0.4 + progress * 2.2), 0, Math.PI * 2);
    context.stroke();
  } else if (particle.kind === "heart") {
    drawHeart(particle);
  } else {
    drawSpark(particle);
  }
  context.restore();
};

const updateAndDraw = (delta: number) => {
  if (!context || !canvasRef.value) return;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const spawnRate = reduceMotion ? 0.8 : isMobile ? 3.2 : 5.5;
  spawnAccumulator += delta * spawnRate;
  while (spawnAccumulator >= 1) {
    addParticle(createIdleParticle());
    spawnAccumulator -= 1;
  }

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.life -= delta;
    if (particle.life <= 0 || particle.y < -80) {
      particles.splice(index, 1);
      continue;
    }
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.rotation += particle.rotationVelocity * delta;
    if (particle.burst && particle.kind !== "ring") particle.vy += 16 * delta;
    drawParticle(particle);
  }
};

const render = (time: number) => {
  animationFrameId = window.requestAnimationFrame(render);
  if (!isVisible) return;
  if (!previousTime) previousTime = time;
  const elapsed = time - previousTime;
  const frameInterval = reduceMotion ? 80 : isMobile ? 32 : 16;
  if (elapsed < frameInterval) return;
  previousTime = time;
  updateAndDraw(Math.min(0.05, elapsed / 1000));
};

const resize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  isMobile = window.matchMedia("(max-width: 650px)").matches;
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  width = window.innerWidth;
  height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

const burst = (x: number, y: number) => {
  const count = reduceMotion ? 6 : isMobile ? 14 : 22;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.18;
    const speed = (isMobile ? 72 : 90) + Math.random() * (isMobile ? 78 : 130);
    const maxLife = 1.15 + Math.random() * 0.55;
    addParticle({
      kind: index % 4 === 0 ? "spark" : "heart",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 12,
      size: (isMobile ? 14 : 17) + Math.random() * (isMobile ? 12 : 18),
      rotation: Math.random() * Math.PI * 2,
      rotationVelocity: -1.5 + Math.random() * 3,
      life: maxLife,
      maxLife,
      color: randomColor(),
      burst: true,
    });
  }

  const ringLife = 1.1;
  addParticle({
    kind: "ring",
    x,
    y,
    vx: 0,
    vy: 0,
    size: isMobile ? 54 : 68,
    rotation: 0,
    rotationVelocity: 0,
    life: ringLife,
    maxLife: ringLife,
    color: "#ff76b7",
    burst: true,
  });
};

const trail = (x: number, y: number) => {
  if (reduceMotion || !context) return;
  const maxLife = 0.85;
  addParticle({
    kind: Math.random() > 0.4 ? "spark" : "heart",
    x,
    y,
    vx: -9 + Math.random() * 18,
    vy: -(26 + Math.random() * 22),
    size: 8 + Math.random() * 8,
    rotation: Math.random() * Math.PI * 2,
    rotationVelocity: -1 + Math.random() * 2,
    life: maxLife,
    maxLife,
    color: randomColor(),
    burst: true,
  });
};

const handleVisibilityChange = () => {
  isVisible = document.visibilityState === "visible";
  previousTime = 0;
};

onMounted(() => {
  context = canvasRef.value?.getContext("2d", { alpha: true }) ?? null;
  resize();
  const initialCount = isMobile ? 14 : 24;
  for (let index = 0; index < initialCount; index += 1) addParticle(createIdleParticle(true));
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  animationFrameId = window.requestAnimationFrame(render);
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrameId);
  window.removeEventListener("resize", resize);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  particles.length = 0;
  context = null;
});

defineExpose({ burst, trail });
</script>

<template>
  <canvas ref="canvasRef" class="love-particle-field" aria-hidden="true"></canvas>
</template>

<style scoped>
.love-particle-field {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  contain: strict;
}
</style>
