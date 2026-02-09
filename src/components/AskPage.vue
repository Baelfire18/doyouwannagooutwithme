<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['yes'])

const noBtn = ref(null)
const container = ref(null)
const noPosition = ref({ x: 0, y: 0 })
const hasEscaped = ref(false)

function escapeButton(reason = 'unknown') {
  console.log(`[escapeButton] triggered by: ${reason}`)
  if (!noBtn.value || !container.value) return

  hasEscaped.value = true

  const containerRect = container.value.getBoundingClientRect()
  const btnRect = noBtn.value.getBoundingClientRect()

  // Calculate safe bounds so the button stays fully visible inside viewport
  const padding = 20
  const maxX = window.innerWidth - btnRect.width - padding
  const maxY = window.innerHeight - btnRect.height - padding

  let newX, newY
  let attempts = 0

  // Keep generating positions until we find one far enough from the cursor area
  do {
    newX = padding + Math.random() * (maxX - padding)
    newY = padding + Math.random() * (maxY - padding)
    attempts++
  } while (
    attempts < 50 &&
    Math.abs(newX - btnRect.left) < 150 &&
    Math.abs(newY - btnRect.top) < 150
  )

  noPosition.value = { x: newX, y: newY }
}

function handleYes() {
  emit('yes')
}

// Reset position on resize so the button doesn't end up offscreen
function handleResize() {
  if (hasEscaped.value) {
    escapeButton('resize')
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="container" class="ask-page">
    <h1 class="title">Do you wanna go out with me?</h1>

    <div class="gif-wrapper">
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDR0a3lvMWF4OG8yc3p6Ymdvd3g2d245amdveDhyYmx6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif"
        alt="Cute bear asking you out" class="gif" />
    </div>

    <div class="buttons">
      <button class="btn btn-yes" @click="handleYes">
        Yes
      </button>

      <button v-if="!hasEscaped" ref="noBtn" class="btn btn-no"
        @mouseenter="escapeButton('mouseenter')"
        @click="escapeButton('click')"
        @touchstart.prevent="escapeButton('touchstart')">
        No
      </button>
    </div>

    <!-- Once escaped, the No button becomes fixed-position and keeps running away -->
    <button v-if="hasEscaped" ref="noBtn" class="btn btn-no escaped" :style="{
      left: noPosition.x + 'px',
      top: noPosition.y + 'px',
    }"
      @mouseenter="escapeButton('mouseenter')"
      @click="escapeButton('click')"
      @touchstart.prevent="escapeButton('touchstart')">
      No
    </button>
  </div>
</template>

<style scoped>
.ask-page {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
}

.title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  line-height: 1.3;
}

.gif-wrapper {
  width: clamp(180px, 40vw, 280px);
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
}

.gif {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.btn {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 14px 40px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.97);
}

.btn-yes {
  background: linear-gradient(135deg, #6c3483, #512894);
  color: #fff;
  box-shadow: 0 4px 15px rgba(81, 40, 148, 0.4);
}

.btn-yes:hover {
  box-shadow: 0 6px 25px rgba(81, 40, 148, 0.55);
}

.btn-no {
  background: #fff;
  color: #7d3c98;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-no:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-no.escaped {
  position: fixed;
  z-index: 100;
  /* Smooth CSS transition for the movement */
  transition:
    left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
</style>
