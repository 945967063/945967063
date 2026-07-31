<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import RainBackground from "../components/RainBackground.vue";
import RandomWallpaper from "../components/RandomWallpaper.vue";

interface FloatingHeart {
  id: number;
  symbol: string;
  style: Record<string, string>;
}

const startDate = new Date("2015-05-20T00:00:00");
const isWallpaperLoaded = ref(false);
const buttonText = ref("点击接收我的爱意 ♥");
const hearts = ref<FloatingHeart[]>([]);
const timer = ref({ days: "0", hours: "00", minutes: "00", seconds: "00" });

let timerId: number | undefined;
let feedbackTimerId: number | undefined;
let nextHeartId = 0;
const heartTimerIds = new Set<number>();

const updateTimer = () => {
  const elapsed = Math.max(0, Date.now() - startDate.getTime());
  timer.value = {
    days: Math.floor(elapsed / 86400000).toLocaleString("zh-CN"),
    hours: String(Math.floor((elapsed / 3600000) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((elapsed / 60000) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((elapsed / 1000) % 60)).padStart(2, "0"),
  };
};

const scheduleHeart = (
  index: number,
  reduceMotion: boolean
) => {
  const creationTimerId = window.setTimeout(() => {
    heartTimerIds.delete(creationTimerId);
    const id = nextHeartId++;
    const duration = reduceMotion ? 1.05 : 2.4 + Math.random() * 1.7;
    const travelX = -90 + Math.random() * 180;
    const travelY = reduceMotion
      ? -(45 + Math.random() * 65)
      : -(180 + Math.random() * window.innerHeight * 0.65);

    hearts.value.push({
      id,
      symbol: Math.random() > 0.28 ? "♥" : "♡",
      style: {
        left: `${4 + Math.random() * 92}vw`,
        top: `${8 + Math.random() * 86}vh`,
        fontSize: `${reduceMotion ? 18 + Math.random() * 8 : 18 + Math.random() * 24}px`,
        "--duration": `${duration}s`,
        "--travel-x": `${travelX}px`,
        "--travel-y": `${travelY}px`,
        "--heart-color": Math.random() > 0.35 ? "#ff6582" : "#ffd0da",
        "--turn": `${-35 + Math.random() * 70}deg`,
      },
    });

    const removalTimerId = window.setTimeout(() => {
      heartTimerIds.delete(removalTimerId);
      hearts.value = hearts.value.filter((heart) => heart.id !== id);
    }, duration * 1000 + 150);
    heartTimerIds.add(removalTimerId);
  }, reduceMotion ? index * 28 : index * 30);
  heartTimerIds.add(creationTimerId);
};

const createHearts = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heartCount = reduceMotion ? 18 : 52;

  for (let index = 0; index < heartCount; index += 1) {
    scheduleHeart(index, reduceMotion);
  }

  buttonText.value = "爱意已送达 ♥";
  if (feedbackTimerId !== undefined) window.clearTimeout(feedbackTimerId);
  feedbackTimerId = window.setTimeout(() => {
    buttonText.value = "点击接收更多爱意 ♥";
  }, 2200);
};

onMounted(() => {
  document.body.classList.add("love-route");
  updateTimer();
  timerId = window.setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  document.body.classList.remove("love-route");
  if (timerId !== undefined) window.clearInterval(timerId);
  if (feedbackTimerId !== undefined) window.clearTimeout(feedbackTimerId);
  heartTimerIds.forEach((id) => window.clearTimeout(id));
  heartTimerIds.clear();
});
</script>

<template>
  <div class="love-page">
    <RandomWallpaper @loaded="isWallpaperLoaded = true" />

    <Transition name="rain-fade">
      <div v-if="!isWallpaperLoaded" class="rain-background" aria-hidden="true">
        <RainBackground />
      </div>
    </Transition>

    <main class="story-shell">
      <section class="hero-stage" aria-labelledby="love-title">
        <div class="hero-copy">
          <p class="eyebrow">OUR STORY · SINCE 2015</p>
          <h1 id="love-title">
            <span>致我最亲爱的</span>
            <strong>老婆</strong><i aria-hidden="true">♥</i>
          </h1>
          <p class="hero-note">
            这不是一封写完就结束的情书，而是我们一起生活、一起变老的开始。
          </p>
        </div>

        <aside class="time-card" aria-labelledby="timer-title">
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
          SCROLL TO OUR MEMORIES
        </div>
      </section>

      <section class="memory-section" aria-labelledby="memory-title">
        <header class="section-heading">
          <div>
            <span>CHAPTER 01</span>
            <h2 id="memory-title">把心动，写进每一天</h2>
          </div>
          <p>不需要刻意定格，和你一起走过的每个普通日子，本身就是最好的纪念。</p>
        </header>

        <div class="memory-notes">
          <article class="memory-note">
            <div><span>01</span><small>THE DAY WE MET</small></div>
            <h3>初见</h3>
            <p>你出现以后，普通的一天，也有了值得记住的理由。</p>
          </article>
          <article class="memory-note">
            <div><span>02</span><small>EVERYDAY WITH YOU</small></div>
            <h3>相伴</h3>
            <p>最喜欢的不是远方，而是每天醒来，身边刚好有你。</p>
          </article>
          <article class="memory-note">
            <div><span>03</span><small>TO BE CONTINUED</small></div>
            <h3>余生</h3>
            <p>故事还很长，往后的春夏秋冬，我们继续慢慢写。</p>
          </article>
        </div>
      </section>

      <section class="letter-stage" aria-labelledby="letter-title">
        <p class="letter-index">LOVE LETTER · 2015—FOREVER</p>
        <div class="letter-copy">
          <span>CHAPTER 02</span>
          <h2 id="letter-title">亲爱的，</h2>
          <p>
            每天醒来看到你，是我一天中最开心的时刻。谢谢你包容我的小缺点，也谢谢你把我们的生活照顾得这么温暖。
          </p>
          <p>
            无论未来发生什么，我都会一直牵着你的手，和你一起走过每一个春夏秋冬。
          </p>
          <strong>永远爱你。</strong>
        </div>
      </section>

      <section class="final-stage">
        <p>THE BEST IS YET TO COME</p>
        <h2>余生很长，<br />请继续多多指教。</h2>
        <button class="love-btn" type="button" @click="createHearts">
          {{ buttonText }}
        </button>
        <span class="action-note">点击后，整片天空都会替我说爱你</span>
      </section>
    </main>

    <div class="heart-layer" aria-hidden="true">
      <span
        v-for="heart in hearts"
        :key="heart.id"
        class="floating-heart"
        :style="heart.style"
      >{{ heart.symbol }}</span>
    </div>
  </div>
</template>

<style src="../assets/love.css" scoped></style>
