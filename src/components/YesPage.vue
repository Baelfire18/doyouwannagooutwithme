<script setup>
import { ref, onMounted } from 'vue'

const showContent = ref(false)

onMounted(() => {
  // Small delay so the fade-in from App.vue finishes first
  setTimeout(() => {
    showContent.value = true
  }, 100)
})
</script>

<template>
  <div class="yes-page">
    <Transition name="pop">
      <div v-if="showContent" class="content">
        <h1 class="title">Yeeeyyyy!!</h1>

        <div class="gif-wrapper">
          <img src="https://media.giphy.com/media/Yz2NW6XR6EvmU4uWpa/giphy.gif" alt="Celebration!" class="gif" />
        </div>

        <p class="subtitle">I knew you'd say yes!</p>
      </div>
    </Transition>

    <!-- Floating hearts background -->
    <div class="hearts" aria-hidden="true">
      <span v-for="i in 12" :key="i" class="heart" :style="heartStyle(i)">&#10084;</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    heartStyle(i) {
      const left = Math.random() * 100
      const delay = Math.random() * 5
      const duration = 4 + Math.random() * 4
      const size = 14 + Math.random() * 20
      return {
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        fontSize: `${size}px`,
      }
    },
  },
}
</script>

<style scoped>
.yes-page {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 1;
}

.title {
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.subtitle {
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.gif-wrapper {
  width: clamp(200px, 45vw, 320px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
}

.gif {
  width: 100%;
  display: block;
}

/* Pop-in transition */
.pop-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.7);
}

/* Floating hearts */
.hearts {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.heart {
  position: absolute;
  bottom: -30px;
  color: rgba(255, 255, 255, 0.35);
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(-110vh) rotate(360deg);
    opacity: 0;
  }
}
</style>
