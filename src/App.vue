<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import RainBackground from "./components/RainBackground.vue";

// 加载状态管理
const isLoaded = ref(false);
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
      copyright: "© 2025 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
    };
  } else {
    return {
      name: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      description: "不折腾会死，我是这样子，我的代码也是这样子。",
      subtitle: "《哲学家》—— 维子",
      copyright: "© 2025 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
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
    <!-- 雨滴背景 -->
    <RainBackground />

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
  transform: translateY(40px) scale(0.98);
  transition: opacity 1s ease, transform 1s ease;
  z-index: 10;
  position: relative;
}

.main-content.fade-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

/* 个人信息区域 */
.hero-section {
  margin-bottom: 2rem;
}

/* 名字样式 - 带动画 */
.name {
  font-size: 3.5rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 30%,
    #f093fb 60%,
    #667eea 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: gradient-flow 8s ease infinite;
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
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 1rem;
  line-height: 1.9;
  font-weight: 300;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
}

/* 页脚 */
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.5rem;
  margin-top: 0.5rem;
}

.copyright {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.25);
  font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .name {
    font-size: 2.5rem;
  }

  .description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .minimal-page {
    padding: 1rem;
  }

  .name {
    font-size: 2rem;
  }

  .description {
    font-size: 0.95rem;
  }
}
</style>
