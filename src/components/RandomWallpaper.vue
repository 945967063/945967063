<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ loaded: [] }>();
const isLoaded = ref(false);
const wallpaperUrl = `https://img.lileyi.de/random?dir=random&type=img&orientation=auto&t=${Date.now()}`;

const handleLoad = () => {
  isLoaded.value = true;
  emit("loaded");
};
</script>

<template>
  <div class="wallpaper-background" aria-hidden="true">
    <img
      class="wallpaper-image"
      :class="{ loaded: isLoaded }"
      :src="wallpaperUrl"
      alt=""
      fetchpriority="high"
      @load="handleLoad"
    />
    <div class="wallpaper-overlay"></div>
  </div>
</template>

<style scoped>
.wallpaper-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #050508;
}

.wallpaper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.8s ease;
}

.wallpaper-image.loaded {
  opacity: 1;
}

.wallpaper-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at center,
      rgba(5, 5, 8, 0.12),
      rgba(5, 5, 8, 0.5)
    ),
    linear-gradient(rgba(5, 5, 8, 0.22), rgba(5, 5, 8, 0.42));
}

@media (prefers-reduced-motion: reduce) {
  .wallpaper-image {
    transition: none;
  }
}
</style>
