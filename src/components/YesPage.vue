<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CSSProperties } from 'vue'

const showContent = ref<boolean>(false)

onMounted((): void => {
  // Small delay so the fade-in from App.vue finishes first
  setTimeout((): void => {
    showContent.value = true
  }, 100)
})

function heartStyle(_index: number): CSSProperties {
  const left: number = Math.random() * 100
  const delay: number = Math.random() * 5
  const duration: number = 4 + Math.random() * 4
  const size: number = 14 + Math.random() * 20
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`,
  }
}
</script>

<template>
  <div class="text-center flex flex-col items-center justify-center p-6 relative min-h-screen w-full overflow-hidden">
    <Transition name="pop">
      <div v-if="showContent" class="flex flex-col items-center gap-6 z-10">
        <h1 class="font-extrabold text-white text-4xl md:text-6xl drop-shadow-md">
          Yeeeyyyy!!
        </h1>

        <div class="w-52 sm:w-64 md:w-80 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://media.giphy.com/media/Yz2NW6XR6EvmU4uWpa/giphy.gif"
            alt="Celebration!"
            class="w-full block"
          />
        </div>

        <p class="font-bold text-white/90 text-base md:text-xl drop-shadow-sm">
          I knew you'd say yes!
        </p>
      </div>
    </Transition>

    <!-- Floating hearts background -->
    <div class="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <span
        v-for="i in 12"
        :key="i"
        class="absolute -bottom-8 text-white/35 animate-[float-up_linear_infinite]"
        :style="heartStyle(i)"
      >
        &#10084;
      </span>
    </div>
  </div>
</template>
