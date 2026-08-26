<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import RandomWallpaper from "../components/RandomWallpaper.vue";
import RainBackground from "../components/RainBackground.vue";

gsap.registerPlugin(SplitText);

type ServiceId = "image" | "probe" | "mail" | "love" | "ledger";

interface Service {
  id: ServiceId;
  name: string;
  englishName: string;
  href: string;
  internal?: boolean;
}

const services: Service[] = [
  {
    id: "image",
    name: "图床",
    englishName: "Image Library",
    href: "https://img.lileyi.de/",
  },
  {
    id: "probe",
    name: "探针",
    englishName: "Pulse Monitor",
    href: "https://lileyi.de/",
  },
  {
    id: "mail",
    name: "邮箱",
    englishName: "Private Mail",
    href: "https://mail.lileyi.de/",
  },
  {
    id: "love",
    name: "情书",
    englishName: "For My Love",
    href: "/love",
    internal: true,
  },
  {
    id: "ledger",
    name: "人情往来",
    englishName: "Gift Ledger",
    href: "https://rq.lileyi.de/",
  },
];

const pageRef = ref<HTMLElement | null>(null);
const router = useRouter();
const isLoaded = ref(false);
const isWallpaperLoaded = ref(false);
const isEnglish = ref(false);

let pageContext: gsap.Context | undefined;
let motionMedia: gsap.MatchMedia | undefined;

const content = computed(() => {
  if (isEnglish.value) {
    return {
      eyebrow: "A quiet corner of the internet",
      name: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      description:
        "Code is poetry, and I am the poet who never stops creating.",
      subtitle: "《Philosopher》—— 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
      copyright: "© 2026 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
    };
  }

  return {
    eyebrow: "互联网里一处安静的角落",
    name: "𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹",
    description: "不折腾会死，我是这样子，我的代码也是这样子。",
    subtitle: "《哲学家》—— 维子",
    copyright: "© 2026 𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹 · China",
  };
});

const detectLanguage = () => {
  const browserLanguage = navigator.language || navigator.languages[0] || "zh";
  isEnglish.value = !browserLanguage.startsWith("zh");
};

const serviceName = (service: Service) =>
  isEnglish.value ? service.englishName : service.name;

const handleServiceClick = (service: Service, event: MouseEvent) => {
  if (service.internal) {
    event.preventDefault();
    void router.push(service.href);
  }
};

onMounted(async () => {
  detectLanguage();
  document.body.classList.add("home-route");
  await nextTick();
  await document.fonts?.ready;

  const root = pageRef.value;
  if (!root) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  pageContext = gsap.context(() => {
    if (reduceMotion) {
      gsap.set(".loading-overlay", { display: "none" });
      isLoaded.value = true;
      return;
    }

    const titleSplit = SplitText.create(".hero-title-inner", {
      type: "chars",
      mask: "chars",
      tag: "span",
      charsClass: "hero-title-char",
      aria: "auto",
    });

    const descriptionSplit = SplitText.create(".hero-description", {
      type: "lines",
      mask: "lines",
      tag: "span",
      linesClass: "hero-description-line",
      aria: "auto",
    });

    const buttonOrigins = isMobile
      ? [
          { x: -48, y: 0 },
          { x: 0, y: -42 },
          { x: 48, y: 0 },
          { x: -34, y: 48 },
          { x: 34, y: 48 },
        ]
      : [
          { x: -100, y: 0 },
          { x: 0, y: -72 },
          { x: 100, y: 0 },
          { x: -64, y: 78 },
          { x: 64, y: 78 },
        ];

    const intro = gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .fromTo(
        ".loading-text",
        { y: 8, autoAlpha: 0.35 },
        { y: 0, autoAlpha: 1, duration: 0.52 },
        0
      )
      .to(
        ".loading-content",
        { y: -12, autoAlpha: 0, duration: 0.46, ease: "power2.in" },
        0.62
      )
      .to(
        ".loading-overlay",
        { autoAlpha: 0, duration: 0.72, ease: "power2.inOut" },
        0.7
      );

    if (!isMobile) {
      intro.fromTo(
        ".wallpaper-shell",
        { scale: 1.08 },
        { scale: 1, duration: 1.8, ease: "power2.out" },
        0.48
      );
    }

    intro
      .fromTo(
        ".hero-eyebrow",
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.72 },
        0.88
      )
      .fromTo(
        titleSplit.chars,
        {
          yPercent: 110,
          rotation: 5,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: isMobile ? 0.7 : 0.88,
          stagger: isMobile ? 0.035 : 0.05,
          ease: "power4.out",
          clearProps: "transform,opacity,visibility",
        },
        0.92
      )
      .fromTo(
        ".hero-eyebrow span",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
        1.02
      )
      .fromTo(
        descriptionSplit.lines,
        { yPercent: 105, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: isMobile ? 0.58 : 0.72,
          stagger: 0.08,
          clearProps: "transform,opacity,visibility",
        },
        1.18
      )
      .fromTo(
        ".hero-subtitle",
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          clearProps: "transform,opacity,visibility",
        },
        1.28
      )
      .fromTo(
        ".home-link",
        {
          x: (index) => buttonOrigins[index]?.x ?? 0,
          y: (index) => buttonOrigins[index]?.y ?? 0,
          scale: 0.86,
          autoAlpha: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: isMobile ? 0.9 : 1.1,
          stagger: isMobile ? 0.08 : 0.11,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        },
        1.55
      )
      .fromTo(
        ".site-signature, .page-footer",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, stagger: 0.08 },
        1.28
      )
      .call(() => {
        isLoaded.value = true;
      })
      .set(".hero-title-char, .hero-description-line", {
        willChange: "auto",
      })
      .set(".loading-overlay", { display: "none" });
  }, root);

  motionMedia = gsap.matchMedia();
  motionMedia.add(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    () => {
      const wallpaper = root.querySelector<HTMLElement>(".wallpaper-shell");
      const hero = root.querySelector<HTMLElement>(".hero-container");
      if (!wallpaper || !hero) return;

      const wallpaperX = gsap.quickTo(wallpaper, "x", { duration: 1.2, ease: "power3.out" });
      const wallpaperY = gsap.quickTo(wallpaper, "y", { duration: 1.2, ease: "power3.out" });
      const heroX = gsap.quickTo(hero, "x", { duration: 0.9, ease: "power3.out" });
      const heroY = gsap.quickTo(hero, "y", { duration: 0.9, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        wallpaperX(x * 16);
        wallpaperY(y * 12);
        heroX(x * -7);
        heroY(y * -5);
      };

      const reset = () => {
        wallpaperX(0);
        wallpaperY(0);
        heroX(0);
        heroY(0);
      };

      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", reset);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", reset);
      };
    }
  );
});

onUnmounted(() => {
  document.body.classList.remove("home-route");
  motionMedia?.revert();
  pageContext?.revert();
});
</script>

<template>
  <div
    ref="pageRef"
    class="home-page"
    :class="{ 'is-loaded': isLoaded }"
    :lang="isEnglish ? 'en' : 'zh-CN'"
  >
    <div class="wallpaper-shell" aria-hidden="true">
      <RandomWallpaper @loaded="isWallpaperLoaded = true" />
    </div>

    <Transition name="rain-fade">
      <div v-if="!isWallpaperLoaded" class="rain-background" aria-hidden="true">
        <RainBackground />
      </div>
    </Transition>

    <div class="atmosphere" aria-hidden="true">
      <span class="atmosphere-glow"></span>
      <span class="atmosphere-grain"></span>
    </div>

    <div class="loading-overlay" aria-hidden="true">
      <div class="loading-content">
        <div class="loader"></div>
        <p class="loading-text">𝓣𝓸𝔀𝓮𝓻𝓢𝓲𝓹</p>
      </div>
    </div>

    <header class="site-signature" aria-label="Site identity">
      <span class="signature-mark">T/S</span>
      <span class="signature-copy">
        <b>www.lileyi.de</b>
        <small>Personal space · 2026</small>
      </span>
    </header>

    <main class="hero-content">
      <div class="hero-container">
        <section class="hero-section" aria-labelledby="home-title">
          <p class="hero-eyebrow">
            <span></span>
            {{ content.eyebrow }}
            <span></span>
          </p>

          <div class="hero-title-mask">
            <h1 id="home-title" class="hero-title-inner">{{ content.name }}</h1>
          </div>

          <p class="hero-description">{{ content.description }}</p>
          <p class="hero-subtitle">{{ content.subtitle }}</p>

          <nav class="home-links" aria-label="Personal services">
            <a
              v-for="service in services"
              :key="service.id"
              class="home-link"
              :href="service.href"
              :target="service.internal ? undefined : '_blank'"
              :rel="service.internal ? undefined : 'noopener noreferrer'"
              @click="handleServiceClick(service, $event)"
            >
              {{ serviceName(service) }}
            </a>
          </nav>
        </section>
      </div>
    </main>

    <footer class="page-footer">
      <p>{{ content.copyright }}</p>
      <p class="footer-status"><i></i> Somewhere online</p>
    </footer>

  </div>
</template>

<style>
:root {
  color-scheme: dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  min-width: 320px;
  background: #050508;
  color: #fff;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Microsoft YaHei", sans-serif;
}

body.home-route { overflow: hidden; }

button,
a { color: inherit; font: inherit; }

button { border: 0; }

.home-page {
  --ivory: #f8f5ff;
  --muted: rgba(244, 240, 255, 0.62);
  --line: rgba(255, 255, 255, 0.17);
  --lavender: #d8c8ff;
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  isolation: isolate;
  background: #050508;
  -webkit-user-select: none;
  user-select: none;
}

.wallpaper-shell {
  position: fixed;
  inset: -18px;
  z-index: 0;
  will-change: transform;
}

.wallpaper-shell .wallpaper-background { position: absolute; }

.rain-background {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.rain-fade-leave-active { transition: opacity 0.8s ease; }
.rain-fade-leave-to { opacity: 0; }

.atmosphere {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.atmosphere::before {
  position: absolute;
  inset: 0;
  content: "";
  background:
    linear-gradient(180deg, rgba(1, 1, 7, 0.24), transparent 28%, transparent 68%, rgba(1, 1, 6, 0.44)),
    radial-gradient(circle at 50% 43%, rgba(10, 8, 24, 0.1) 0, rgba(4, 3, 13, 0.36) 42%, rgba(2, 2, 7, 0.6) 100%);
}

.atmosphere-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  width: min(70vw, 900px);
  height: min(60vw, 640px);
  border-radius: 50%;
  background: rgba(147, 112, 219, 0.09);
  filter: blur(90px);
  transform: translateX(-50%);
}

.atmosphere-grain {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.75'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: #06060b;
}

.loading-content { text-align: center; }

.loader {
  width: 50px;
  height: 50px;
  margin: 0 auto 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #9e8aec;
  border-right-color: rgba(216, 200, 255, 0.46);
  border-radius: 50%;
  box-shadow: 0 0 28px rgba(142, 118, 201, 0.12);
  animation: loader-spin 1s linear infinite;
}

@keyframes loader-spin { to { transform: rotate(360deg); } }

.loading-text {
  margin: 0;
  color: transparent;
  background: linear-gradient(90deg, #8e76c9, #d8c8ff, #f2d9ff);
  background-clip: text;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 300;
  filter: drop-shadow(0 5px 18px rgba(99, 72, 158, 0.2));
}

.site-signature {
  position: fixed;
  top: clamp(1.4rem, 3.4vw, 3rem);
  left: clamp(1.35rem, 4vw, 4rem);
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.72);
}

.signature-mark {
  display: grid;
  width: 35px;
  height: 35px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 50%;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}

.signature-copy { display: grid; gap: 0.05rem; }

.signature-copy b {
  font-size: 0.69rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.signature-copy small {
  color: rgba(255, 255, 255, 0.54);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.63rem;
  font-style: italic;
  letter-spacing: 0.04em;
}

.hero-content {
  position: relative;
  z-index: 10;
  display: grid;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  place-items: center;
  padding: clamp(5.5rem, 10vh, 8rem) 1.5rem clamp(6.5rem, 11vh, 8rem);
  will-change: transform, opacity;
}

.hero-container {
  position: relative;
  width: min(100%, 760px);
  text-align: center;
  will-change: transform;
}

.hero-container::before {
  position: absolute;
  z-index: -1;
  inset: -5rem -8rem;
  border-radius: 50%;
  content: "";
  background: radial-gradient(ellipse at center, rgba(3, 3, 10, 0.62) 0, rgba(3, 3, 10, 0.34) 45%, transparent 74%);
  filter: blur(8px);
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.63);
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: 0.68rem;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.hero-eyebrow span {
  width: 25px;
  height: 1px;
  background: rgba(255, 255, 255, 0.35);
}

.hero-eyebrow span:first-child { transform-origin: right center; }
.hero-eyebrow span:last-child { transform-origin: left center; }

.hero-title-mask {
  overflow: hidden;
  padding: 0.12em 0.12em 0.18em;
  perspective: 600px;
}

.hero-title-inner {
  margin: 0;
  color: transparent;
  background: linear-gradient(125deg, #fff 4%, #f8efff 32%, #d4b9ff 66%, #fff 96%);
  background-size: 180% 180%;
  background-clip: text;
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.72)) drop-shadow(0 16px 34px rgba(0, 0, 0, 0.5));
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3.7rem, 8vw, 6.4rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: 0.01em;
}

.hero-title-char {
  display: inline-block;
  color: transparent;
  background: linear-gradient(125deg, #fff 4%, #f8efff 32%, #d4b9ff 66%, #fff 96%);
  background-clip: text;
  will-change: transform, opacity;
}

.hero-title-char-mask {
  display: inline-block;
  overflow: clip;
  vertical-align: bottom;
}

.hero-description-line-mask {
  display: block;
  overflow: clip;
}

.hero-description-line {
  display: block;
  will-change: transform, opacity;
}

.hero-description {
  max-width: 620px;
  margin: 1rem auto 1.15rem;
  color: rgba(255, 255, 255, 0.92);
  font-family: "Iowan Old Style", "Palatino Linotype", "Noto Serif SC", serif;
  font-size: clamp(0.98rem, 1.4vw, 1.1rem);
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.9;
  text-shadow: 0 2px 13px rgba(0, 0, 0, 0.92);
}

.hero-subtitle {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-right: auto;
  margin-left: auto;
  gap: 0.65rem;
  color: rgba(255, 255, 255, 0.59);
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: 0.76rem;
  font-style: italic;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.86);
}

.hero-subtitle::before,
.hero-subtitle::after {
  width: 18px;
  height: 1px;
  content: "";
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.46));
}

.hero-subtitle::after { transform: rotate(180deg); }

.home-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.58rem;
  width: min(100%, 360px);
  margin: 2rem auto 0;
}

.home-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  min-height: 44px;
  padding: 0.55rem 1.1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(8, 8, 15, 0.3);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.045), 0 9px 28px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.9);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 0.86rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.74);
  transition: color 0.32s ease, background 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease, transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.home-link:nth-child(n + 4) { min-width: 90px; }

.home-link::before {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(110deg, transparent 20%, rgba(225, 214, 255, 0.11) 50%, transparent 80%);
  opacity: 0;
  transform: translateX(-45%);
  transition: opacity 0.32s ease, transform 0.48s ease;
}

.home-link:hover,
.home-link:focus-visible {
  border-color: rgba(226, 215, 255, 0.88);
  background: rgba(31, 26, 42, 0.5);
  box-shadow: 0 0 0 1px rgba(207, 190, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 22px rgba(178, 146, 235, 0.08);
  outline: none;
  transform: translateY(-2px);
}

.home-link:hover::before,
.home-link:focus-visible::before {
  opacity: 1;
  transform: translateX(45%);
}

.home-link:active { transform: translateY(0) scale(0.97); }

.page-footer {
  position: fixed;
  z-index: 12;
  right: clamp(1.35rem, 4vw, 4rem);
  bottom: clamp(1.35rem, 3.4vw, 2.8rem);
  left: clamp(1.35rem, 4vw, 4rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.63rem;
  letter-spacing: 0.11em;
  text-shadow: 0 2px 9px rgba(0, 0, 0, 0.86);
  text-transform: uppercase;
}

.footer-status { display: flex; align-items: center; gap: 0.55rem; }

.footer-status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #d8c8ff;
  box-shadow: 0 0 10px #d8c8ff;
  animation: status-pulse 2.2s ease-in-out infinite;
}

@keyframes status-pulse { 50% { opacity: 0.4; transform: scale(0.7); } }

@media (max-width: 768px) {
  .site-signature { top: 1.25rem; left: 1.15rem; }
  .signature-copy small { display: none; }
  .wallpaper-shell,
  .hero-container { will-change: auto; }
  .hero-content { padding: 5.5rem 1.15rem 6rem; }
  .hero-container::before { inset: -4rem -2rem; }
  .hero-eyebrow { gap: 0.55rem; margin-bottom: 1rem; font-size: 0.57rem; letter-spacing: 0.12em; }
  .hero-eyebrow span { width: 15px; }
  .hero-title-inner { font-size: clamp(3rem, 15vw, 4.5rem); }
  .hero-description { max-width: 90%; font-size: 0.94rem; line-height: 1.78; }
  .hero-subtitle { font-size: 0.69rem; }
  .home-links { margin-top: 1.8rem; }
  .page-footer {
    right: 1.15rem;
    bottom: 1.2rem;
    left: 1.15rem;
    justify-content: center;
    text-align: center;
  }
  .footer-status { display: none; }
}

@media (max-width: 430px) {
  .signature-copy { display: none; }
  .hero-title-inner { font-size: 2.95rem; }
  .hero-description { max-width: 100%; font-size: 0.89rem; }
  .hero-subtitle::before,
  .hero-subtitle::after { width: 11px; }
  .home-links { width: min(100%, 348px); gap: 0.5rem; }
  .home-link { min-height: 42px; font-size: 0.82rem; }
}

@media (max-height: 650px) {
  .hero-content { padding-top: 4.3rem; padding-bottom: 4.8rem; }
  .hero-eyebrow { margin-bottom: 0.55rem; }
  .hero-title-inner { font-size: clamp(2.75rem, 12vh, 5rem); }
  .hero-description { margin: 0.6rem auto; line-height: 1.55; }
  .home-links { margin-top: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .home-page *,
  .home-page *::before,
  .home-page *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .rain-fade-leave-active { transition: none; }
}
</style>
