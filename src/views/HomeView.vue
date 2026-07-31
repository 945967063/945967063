<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import RandomWallpaper from "../components/RandomWallpaper.vue";
import RainBackground from "../components/RainBackground.vue";

// 加载状态管理
const isLoaded = ref(false);
const isWallpaperLoaded = ref(false);
// 语言检测
const isEnglish = ref(false);

// 检测浏览器语言
const detectLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  isEnglish.value = !browserLang.startsWith("zh");
};

// 多语言内容
const content = computed(() => {
  if (isEnglish.value) {
    return {
      name: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      description:
        "Code is poetry, and I am the poet who never stops creating.",
      subtitle: "《Philosopher》—— 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      copyright: "© 2026 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
    };
  } else {
    return {
      name: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      description: "不折腾会死，我是这样子，我的代码也是这样子。",
      subtitle: "《哲学家》—— 维子",
      copyright: "© 2026 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
    };
  }
});

// 页面加载完成后触发动画
onMounted(() => {
  detectLanguage();
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div
    class="minimal-page"
    :class="{ loaded: isLoaded }"
    :lang="isEnglish ? 'en' : 'zh'"
  >
    <!-- 随机壁纸背景 -->
    <RandomWallpaper @loaded="isWallpaperLoaded = true" />

    <Transition name="rain-fade">
      <div v-if="!isWallpaperLoaded" class="rain-background" aria-hidden="true">
        <RainBackground />
      </div>
    </Transition>

    <!-- 加载动画 -->
    <div class="loading-overlay" :class="{ 'fade-out': isLoaded }">
      <div class="loading-content">
        <div class="loader"></div>
        <p class="loading-text">𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹</p>
      </div>
    </div>

    <main class="main-content" :class="{ 'fade-in': isLoaded }">
      <div class="container">
        <!-- 个人信息 -->
        <section class="hero-section">
          <h1 class="name">{{ content.name }}</h1>

          <p class="description">
            {{ content.description }}
          </p>

          <p class="subtitle">{{ content.subtitle }}</p>
        </section>

        <!-- 页脚 -->
        <footer class="footer">
          <p class="copyright">{{ content.copyright }}</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #fff;
  background: #050508;
  min-height: 100vh;
  overflow-x: hidden;
}

.minimal-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.rain-background {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.rain-fade-leave-active {
  transition: opacity 0.8s ease;
}

.rain-fade-leave-to {
  opacity: 0;
}

/* 加载动画覆盖层 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #050508;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}

.loading-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
}

.loading-content {
  text-align: center;
}

/* 加载动画圆环 */
.loader {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 英文字体优化 */
[lang="en"] .description {
  font-family: "Georgia", "Times New Roman", serif;
  font-style: italic;
}

[lang="en"] .name {
  letter-spacing: 3px;
}

/* 主内容淡入动画 */
.main-content {
  opacity: 0;
  transform: translateY(calc(-3vh + 32px)) scale(0.98);
  transition: opacity 1s ease, transform 1s ease;
  z-index: 10;
  position: relative;
}

.main-content.fade-in {
  opacity: 1;
  transform: translateY(-3vh) scale(1);
}

.container {
  max-width: 680px;
  width: 100%;
  text-align: center;
  position: relative;
  isolation: isolate;
}

.container::before {
  content: "";
  position: absolute;
  inset: -3.5rem -5.5rem;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(3, 6, 12, 0.66) 0%,
    rgba(3, 6, 12, 0.38) 45%,
    rgba(3, 6, 12, 0) 76%
  );
  filter: blur(4px);
}

/* 个人信息区域 */
.hero-section {
  margin-bottom: 2rem;
}

/* 名字样式 - 带动画 */
.name {
  font-size: clamp(3rem, 7vw, 4.5rem);
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 1.35rem;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f5e7ff 30%,
    #d8b4fe 65%,
    #fff7ff 100%
  );
  background-size: 180% 180%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.72))
    drop-shadow(0 12px 30px rgba(0, 0, 0, 0.48));
  animation: gradient-flow 10s ease infinite;
}

@keyframes gradient-flow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.description {
  max-width: 600px;
  margin: 0 auto 1.25rem;
  font-family: "Iowan Old Style", "Palatino Linotype", "Noto Serif SC", serif;
  font-size: 1.08rem;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.9;
  font-weight: 400;
  font-style: italic;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.92);
}

.subtitle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.66);
  font-style: italic;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.88);
}

.subtitle::before,
.subtitle::after {
  content: "";
  width: 22px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.48));
}

.subtitle::after {
  transform: rotate(180deg);
}

/* 页脚 */
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

.copyright {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.52);
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.85);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .name {
    font-size: clamp(2.75rem, 12vw, 3.4rem);
  }

  .description {
    font-size: 1rem;
  }

  .container::before {
    inset: -3rem -2rem;
  }
}

@media (max-width: 480px) {
  .minimal-page {
    padding: 1rem;
  }

  .name {
    font-size: 2.65rem;
  }

  .description {
    font-size: 0.95rem;
    line-height: 1.8;
  }

  .subtitle {
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  .subtitle::before,
  .subtitle::after {
    width: 14px;
  }
}

@media (max-height: 480px) {
  .minimal-page {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .main-content {
    transform: translateY(24px) scale(0.98);
  }

  .main-content.fade-in {
    transform: translateY(0) scale(1);
  }

  .container::before {
    inset: -1.5rem -4rem;
  }

  .hero-section {
    margin-bottom: 0.8rem;
  }

  .name {
    font-size: clamp(2.5rem, 14vh, 3.25rem);
    margin-bottom: 0.8rem;
  }

  .description {
    margin-bottom: 0.7rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .subtitle {
    font-size: 0.72rem;
  }

  .footer {
    margin-top: 0;
    padding-top: 0.65rem;
  }

  .copyright {
    font-size: 0.72rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rain-fade-leave-active {
    transition: none;
  }
}
</style>
