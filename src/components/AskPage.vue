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
  <div ref="container" class="text-center flex flex-col items-center gap-6 p-6">
    <h1
      class="font-extrabold text-white leading-tight text-[clamp(1.8rem,5vw,2.8rem)] [text-shadow:0_2px_10px_rgba(0,0,0,0.15)]"
    >
      Do you wanna go out with me?
    </h1>

    <div class="w-[clamp(180px,40vw,280px)] aspect-square rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtZ2JiZDR0a3lvMWF4OG8yc3p6Ymdvd3g2d245amdveDhyYmx6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif"
        alt="Cute bear asking you out"
        class="w-full h-full object-cover block"
      />
    </div>

    <div class="flex gap-5 justify-center items-center">
      <button
        class="font-nunito text-lg font-bold py-3.5 px-10 border-none rounded-full cursor-pointer transition-[transform,box-shadow] duration-200 ease-in-out hover:scale-105 active:scale-[0.97] bg-gradient-to-br from-[#6c3483] to-[#512894] text-white shadow-[0_4px_15px_rgba(81,40,148,0.4)] hover:shadow-[0_6px_25px_rgba(81,40,148,0.55)]"
        @click="handleYes"
      >
        Yes
      </button>

      <button
        v-if="!hasEscaped"
        ref="noBtn"
        class="font-nunito text-lg font-bold py-3.5 px-10 border-none rounded-full cursor-pointer transition-[transform,box-shadow] duration-200 ease-in-out hover:scale-105 active:scale-[0.97] bg-white text-[#7d3c98] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
        @mouseenter="escapeButton('mouseenter')"
        @click="escapeButton('click')"
        @touchstart.prevent="escapeButton('touchstart')"
      >
        No
      </button>
    </div>

    <!-- Once escaped, the No button becomes fixed-position and keeps running away -->
    <button
      v-if="hasEscaped"
      ref="noBtn"
      class="btn-no-escaped fixed z-100 font-nunito text-lg font-bold py-3.5 px-10 border-none rounded-full cursor-pointer hover:scale-105 active:scale-[0.97] bg-white text-[#7d3c98] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
      :style="{
        left: noPosition.x + 'px',
        top: noPosition.y + 'px',
      }"
      @mouseenter="escapeButton('mouseenter')"
      @click="escapeButton('click')"
      @touchstart.prevent="escapeButton('touchstart')"
    >
      No
    </button>
  </div>
</template>
