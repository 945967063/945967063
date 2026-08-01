<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  animate,
  createAnimatable,
  createScope,
  createTimeline,
  stagger,
  utils,
  type Scope,
} from "animejs";
import RainBackground from "../components/RainBackground.vue";
import RandomWallpaper from "../components/RandomWallpaper.vue";
import LoveParticleField from "../components/LoveParticleField.vue";

interface LoveParticleFieldHandle {
  burst: (x: number, y: number) => void;
  trail: (x: number, y: number) => void;
}

const startDate = new Date("2015-05-20T00:00:00");
const loveResponses = ["LOVE YOU", "心动 +1", "永远爱你", "余生是你"];
const lovePageRef = ref<HTMLElement | null>(null);
const particleFieldRef = ref<LoveParticleFieldHandle | null>(null);
const isWallpaperLoaded = ref(false);
const timer = ref({ days: "0", hours: "00", minutes: "00", seconds: "00" });

let timerId: number | undefined;
let animeScope: Scope | undefined;

const updateTimer = () => {
  const elapsed = Math.max(0, Date.now() - startDate.getTime());
  timer.value = {
    days: Math.floor(elapsed / 86400000).toLocaleString("zh-CN"),
    hours: String(Math.floor((elapsed / 3600000) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((elapsed / 60000) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((elapsed / 1000) % 60)).padStart(2, "0"),
  };
};

const handleWallpaperLoaded = () => {
  isWallpaperLoaded.value = true;
};

const setupRomanticInteractions = () => {
  const root = lovePageRef.value;
  if (!root) return;

  animeScope = createScope({
    root,
    mediaQueries: {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      finePointer: "(hover: hover) and (pointer: fine)",
    },
  }).add((scope) => {
    const reduceMotion = scope?.matches.reduceMotion ?? false;
    const finePointer = scope?.matches.finePointer ?? false;
    const heroStage = root.querySelector<HTMLElement>(".hero-stage");
    const timeCard = root.querySelector<HTMLElement>(".time-card");
    const heroCopy = root.querySelector<HTMLElement>(".hero-copy");
    const interactionLayer = root.querySelector<HTMLElement>(".interaction-layer");

    root.classList.add("is-interactive");

    if (reduceMotion) {
      return () => root.classList.remove("is-interactive");
    }

    utils.set(".hero-stage", { opacity: 0, scale: 0.985 });
    utils.set(".eyebrow", { opacity: 0, y: 22 });
    utils.set(".hero-copy h1 > span", { opacity: 0, y: 24 });
    utils.set(".title-char", { opacity: 0, y: 64, rotate: 7 });
    utils.set(".hero-note, .forever-line", { opacity: 0, y: 24 });
    utils.set(".time-card", { opacity: 0, y: 36, scale: 0.94 });
    utils.set(".scroll-hint, .interaction-hint", { opacity: 0, y: 14 });
    utils.set(".love-reactor", { opacity: 0, scale: 0.62 });

    createTimeline({ defaults: { ease: "outExpo" } })
      .add(".hero-stage", { opacity: 1, scale: 1, duration: 1200 }, 0)
      .add(".eyebrow", { opacity: 1, y: 0, duration: 800 }, 180)
      .add(".hero-copy h1 > span", { opacity: 1, y: 0, duration: 850 }, 260)
      .add(
        ".title-char",
        { opacity: 1, y: 0, rotate: 0, duration: 1050, delay: stagger(105) },
        320,
      )
      .add(".hero-note, .forever-line", { opacity: 1, y: 0, duration: 900, delay: stagger(100) }, 560)
      .add(".time-card", { opacity: 1, y: 0, scale: 1, duration: 1100 }, 430)
      .add(".love-reactor", { opacity: 1, scale: 1, duration: 1200, ease: "outElastic(1, .55)" }, 680)
      .add(".scroll-hint, .interaction-hint", { opacity: 1, y: 0, duration: 800 }, 900);

    animate(".reactor-orbit-one", {
      rotate: "1turn",
      duration: 7800,
      loop: true,
      ease: "linear",
    });
    animate(".reactor-orbit-two", {
      rotate: "-1turn",
      duration: 5600,
      loop: true,
      ease: "linear",
    });
    animate(".reactor-core", {
      scale: [1, 1.16, 1],
      duration: 1450,
      loop: true,
      ease: "inOutSine",
    });
    animate(".interaction-hint", {
      y: [0, -4, 0],
      duration: 2200,
      delay: 1500,
      loop: true,
      ease: "inOutSine",
    });

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".section-heading, .memory-note, .letter-stage, .final-stage > *",
      ),
    );
    utils.set(revealTargets, { opacity: 0, y: 46 });
    utils.set(".memory-note", { scale: 0.96 });

    const revealElement = (element: HTMLElement) => {
      const memoryIndex = element.classList.contains("memory-note")
        ? Array.from(element.parentElement?.children ?? []).indexOf(element)
        : 0;
      animate(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 950,
        delay: memoryIndex * 105,
        ease: "outExpo",
      });
    };

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealElement(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -5%" },
      );
      revealTargets.forEach((element) => observer?.observe(element));
    } else {
      revealTargets.forEach(revealElement);
    }

    const cardMotion = timeCard
      ? createAnimatable(timeCard, {
          x: { duration: 620, ease: "out(3)" },
          y: { duration: 620, ease: "out(3)" },
          rotate: { duration: 760, ease: "out(3)" },
        })
      : undefined;
    const copyMotion = heroCopy
      ? createAnimatable(heroCopy, {
          x: { duration: 720, ease: "out(3)" },
          y: { duration: 720, ease: "out(3)" },
        })
      : undefined;

    const createLoveResponse = (x: number, y: number) => {
      if (!interactionLayer) return;
      const response = document.createElement("span");
      response.className = "love-response";
      response.textContent = loveResponses[Math.floor(Math.random() * loveResponses.length)];
      response.style.left = `${x}px`;
      response.style.top = `${y}px`;
      interactionLayer.appendChild(response);
      animate(response, {
        y: -96,
        scale: [0.72, 1.08, 1],
        opacity: [0, 1, 1, 0],
        duration: 1650,
        ease: "outExpo",
        onComplete: () => response.remove(),
      });
    };

    let lastTrailTime = 0;
    const handlePointerMove = (event: PointerEvent) => {
      if (finePointer && heroStage && heroStage.contains(event.target as Node)) {
        const rect = heroStage.getBoundingClientRect();
        const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
        const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
        heroStage.style.setProperty("--pointer-x", `${(normalizedX + 0.5) * 100}%`);
        heroStage.style.setProperty("--pointer-y", `${(normalizedY + 0.5) * 100}%`);
        cardMotion?.x(normalizedX * 14);
        cardMotion?.y(normalizedY * 10);
        cardMotion?.rotate(normalizedX * 1.4);
        copyMotion?.x(normalizedX * -6);
        copyMotion?.y(normalizedY * -4);
      }

      if (!finePointer || event.timeStamp - lastTrailTime < 82) return;
      lastTrailTime = event.timeStamp;
      particleFieldRef.value?.trail(event.clientX, event.clientY);
    };

    const resetHeroMotion = () => {
      cardMotion?.x(0);
      cardMotion?.y(0);
      cardMotion?.rotate(0);
      copyMotion?.x(0);
      copyMotion?.y(0);
      heroStage?.style.removeProperty("--pointer-x");
      heroStage?.style.removeProperty("--pointer-y");
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      particleFieldRef.value?.burst(event.clientX, event.clientY);
      createLoveResponse(event.clientX, event.clientY);
      animate(".love-reactor", {
        scale: [1, 1.2, 1],
        rotate: [0, 2, 0],
        duration: 850,
        ease: "outElastic(1, .5)",
      });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerdown", handlePointerDown);
    heroStage?.addEventListener("pointerleave", resetHeroMotion);

    return () => {
      observer?.disconnect();
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerdown", handlePointerDown);
      heroStage?.removeEventListener("pointerleave", resetHeroMotion);
      interactionLayer?.replaceChildren();
      root.classList.remove("is-interactive");
    };
  });
};

onMounted(() => {
  document.body.classList.add("love-route");
  updateTimer();
  timerId = window.setInterval(updateTimer, 1000);
  setupRomanticInteractions();
});

onUnmounted(() => {
  document.body.classList.remove("love-route");
  if (timerId !== undefined) window.clearInterval(timerId);
  animeScope?.revert();
  animeScope = undefined;
});
</script>

<template>
  <div ref="lovePageRef" class="love-page">
    <RandomWallpaper @loaded="handleWallpaperLoaded" />

    <Transition name="rain-fade">
      <div v-if="!isWallpaperLoaded" class="rain-background" aria-hidden="true">
        <RainBackground />
      </div>
    </Transition>

    <div class="romantic-atmosphere" aria-hidden="true">
      <span class="ambient-orb orb-one"></span>
      <span class="ambient-orb orb-two"></span>
      <span class="sparkle sparkle-one">✦</span>
      <span class="sparkle sparkle-two">✧</span>
      <span class="sparkle sparkle-three">✦</span>
    </div>

    <div class="interaction-layer" aria-hidden="true"></div>
    <LoveParticleField ref="particleFieldRef" />

    <main class="story-shell">
      <section class="hero-stage" aria-labelledby="love-title">
        <div class="hero-aurora" aria-hidden="true"></div>
        <div class="tech-scan" aria-hidden="true"></div>
        <div class="system-status" aria-hidden="true">
          <span><i></i> LOVE SIGNAL · CONNECTED</span>
          <span>SINCE 2015 · ALWAYS</span>
        </div>
        <div class="love-reactor" aria-hidden="true">
          <span class="reactor-orbit reactor-orbit-one"><i>♥</i></span>
          <span class="reactor-orbit reactor-orbit-two"><i>✦</i></span>
          <span class="reactor-core">♥</span>
          <small>LOVE SIGNAL</small>
        </div>
        <div class="hero-copy">
          <p class="eyebrow">A LOVE LETTER · SINCE 2015</p>
          <h1 id="love-title">
            <span>致我唯一的终身搭档</span>
            <strong aria-label="老婆">
              <span class="title-char" aria-hidden="true">老</span>
              <span class="title-char" aria-hidden="true">婆</span>
            </strong><i aria-hidden="true">♥</i>
          </h1>
          <p class="hero-note">
            这不是一封写完就结束的情书，而是我们一起生活、一起变老的开始。
          </p>
          <p class="forever-line"><span aria-hidden="true"></span> YOU ARE MY FAVORITE FUTURE</p>
        </div>

        <aside class="time-card" aria-labelledby="timer-title">
          <span class="card-scan-line" aria-hidden="true"></span>
          <span class="panel-code">OURS · ∞</span>
          <div class="time-emblem" aria-hidden="true">♥</div>
          <p class="time-kicker">TOGETHER FOR</p>
          <h2 id="timer-title">我们已经相爱</h2>
          <div class="timer-grid" role="timer" aria-live="polite">
            <div class="time-unit"><strong>{{ timer.days }}</strong><span>天</span></div>
            <div class="time-unit"><strong>{{ timer.hours }}</strong><span>小时</span></div>
            <div class="time-unit"><strong>{{ timer.minutes }}</strong><span>分钟</span></div>
            <div class="time-unit"><strong>{{ timer.seconds }}</strong><span>秒</span></div>
          </div>
        </aside>

        <div class="scroll-hint" aria-hidden="true">
          <span></span>
          SCROLL TO OUR STORY
        </div>
        <div class="interaction-hint" aria-hidden="true">
          <span></span>
          轻触屏幕 · 让心动开花
        </div>
      </section>

      <section class="memory-section" aria-labelledby="memory-title">
        <header class="section-heading">
          <div>
            <span>OUR CONSTELLATION · 01</span>
            <h2 id="memory-title">爱落在每个平凡日子里</h2>
          </div>
          <p>我们把寻常的日子过成了星星。每一颗，都保存着与你有关的温柔片段。</p>
        </header>

        <div class="memory-notes">
          <article class="memory-note" data-code="MEM-001">
            <div><span>01</span><small>THE DAY WE MET</small></div>
            <h3>初见</h3>
            <p>你出现以后，普通的一天，也有了值得记住的理由。</p>
          </article>
          <article class="memory-note" data-code="MEM-002">
            <div><span>02</span><small>EVERYDAY WITH YOU</small></div>
            <h3>相伴</h3>
            <p>最喜欢的不是远方，而是每天醒来，身边刚好有你。</p>
          </article>
          <article class="memory-note" data-code="MEM-003">
            <div><span>03</span><small>TO BE CONTINUED</small></div>
            <h3>余生</h3>
            <p>故事还很长，往后的春夏秋冬，我们继续慢慢写。</p>
          </article>
        </div>
      </section>

      <section class="letter-stage" aria-labelledby="letter-title">
        <div class="terminal-bar" aria-hidden="true">
          <span><i></i><i></i><i></i></span>
          <p>PRIVATE LOVE LETTER</p>
          <b>ONLY FOR YOU</b>
        </div>
        <div class="letter-seal" aria-hidden="true">♥</div>
        <p class="letter-index">LOVE LETTER · 02</p>
        <div class="letter-copy">
          <span>TO MY ONE AND ONLY</span>
          <h2 id="letter-title">亲爱的，</h2>
          <p>
            每天醒来看到你，是我一天中最开心的时刻。谢谢你包容我的小缺点，也谢谢你把我们的生活照顾得这么温暖。
          </p>
          <p>
            无论未来发生什么，我都会一直牵着你的手，和你一起走过每一个春夏秋冬。
          </p>
          <strong>永远爱你。</strong>
          <small>写于我们相爱的每一天</small>
        </div>
      </section>

      <section class="final-stage">
        <span class="final-heart" aria-hidden="true">♥</span>
        <p>OUR STORY · TO BE CONTINUED</p>
        <h2>余生很长，<br />请继续多多指教。</h2>
        <span class="final-vow">ALWAYS WITH YOU · ALWAYS IN LOVE</span>
      </section>
    </main>

  </div>
</template>

<style src="../assets/love.css" scoped></style>
