<template>
  <canvas
    ref="canvasRef"
    class="rain-canvas"
    :width="canvasWidth"
    :height="canvasHeight"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(window.innerWidth);
const canvasHeight = ref(window.innerHeight);

class Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  thickness: number;

  constructor() {
    this.x = Math.random() * canvasWidth.value;
    this.y = Math.random() * canvasHeight.value - canvasHeight.value;
    const isMobile = window.innerWidth < 768;
    this.length = Math.random() * 15 + (isMobile ? 18 : 15);
    this.speed = Math.random() * 4 + 2;
    this.opacity = Math.random() * 0.6 + (isMobile ? 0.4 : 0.3);
    this.angle = Math.PI / 8;
    this.thickness = Math.random() * 0.8 + (isMobile ? 1.2 : 1);
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.angle) * this.speed * 0.5;
    if (this.y > canvasHeight.value) {
      this.y = -this.length;
      this.x = Math.random() * canvasWidth.value;
    }
    if (this.x > canvasWidth.value) {
      this.x = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - Math.sin(this.angle) * this.length,
      this.y - Math.cos(this.angle) * this.length
    );
    gradient.addColorStop(0, "#A8D8EA");
    gradient.addColorStop(0.5, "#B8E6B8");
    gradient.addColorStop(1, "#D4E6F1");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.sin(this.angle) * this.length,
      this.y - Math.cos(this.angle) * this.length
    );
    ctx.stroke();
    ctx.restore();
  }
}

const raindrops: Raindrop[] = [];
let animationId: number | null = null;

const initRain = () => {
  const isMobile = window.innerWidth < 768;
  const density = isMobile ? 6000 : 7000;
  const dropCount = Math.floor(
    (canvasWidth.value * canvasHeight.value) / density
  );
  raindrops.length = 0;
  for (let i = 0; i < dropCount; i++) {
    raindrops.push(new Raindrop());
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  raindrops.forEach((drop) => {
    drop.update();
    drop.draw(ctx);
  });
  animationId = requestAnimationFrame(animate);
};

const handleResize = () => {
  canvasWidth.value = window.innerWidth;
  canvasHeight.value = window.innerHeight;
  initRain();
};

onMounted(() => {
  initRain();
  animate();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.rain-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .rain-canvas {
    opacity: 0.7;
  }
}
</style>
