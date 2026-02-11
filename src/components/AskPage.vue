<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { EscapeTrigger } from '../types'
import type { Position } from '../types'

const emit = defineEmits<{
  yes: []
}>()

const noBtn = ref<HTMLButtonElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const noPosition = ref<Position>({ x: 0, y: 0 })
const hasEscaped = ref<boolean>(false)

function escapeButton(reason: EscapeTrigger): void {
  console.log(`[escapeButton] triggered by: ${reason}`)
  if (!noBtn.value || !container.value) return

  const btnRect: DOMRect = noBtn.value.getBoundingClientRect()

  // Calculate safe bounds so the button stays fully visible inside viewport
  const padding: number = 20
  const maxX: number = window.innerWidth - btnRect.width - padding
  const maxY: number = window.innerHeight - btnRect.height - padding

  let newX: number = 0
  let newY: number = 0
  let attempts: number = 0

  // Keep generating positions until we find one far enough from the current position
  do {
    newX = padding + Math.random() * (maxX - padding)
    newY = padding + Math.random() * (maxY - padding)
    attempts++
  } while (
    attempts < 50 &&
    Math.abs(newX - btnRect.left) < 150 &&
    Math.abs(newY - btnRect.top) < 150
  )

  if (!hasEscaped.value) {
    // First escape: pin the button at its current in-flow position,
    // then on the next frame move it to the random spot so the CSS transition kicks in.
    noPosition.value = { x: btnRect.left, y: btnRect.top }
    hasEscaped.value = true

    nextTick((): void => {
      requestAnimationFrame((): void => {
        noPosition.value = { x: newX, y: newY }
      })
    })
  } else {
    noPosition.value = { x: newX, y: newY }
  }
}

function handleYes(): void {
  emit('yes')
}

// Reset position on resize so the button doesn't end up offscreen
function handleResize(): void {
  if (hasEscaped.value) {
    escapeButton(EscapeTrigger.Resize)
  }
}

onMounted((): void => {
  window.addEventListener('resize', handleResize)
})

onUnmounted((): void => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="container" class="text-center flex flex-col items-center gap-6 p-6">
    <h1 class="font-extrabold text-white leading-tight text-3xl md:text-5xl drop-shadow-md">
      Do you wanna go out with me?
    </h1>

    <div class="w-48 sm:w-56 md:w-72 aspect-square rounded-2xl overflow-hidden shadow-2xl">
      <img
        src="../assets/ask.gif"
        alt="Cute bear asking you out" class="w-full h-full object-cover block" />
    </div>

    <div class="flex gap-5 justify-center items-center">
      <button
        class="font-nunito text-lg font-bold py-3.5 px-10 border-none rounded-full cursor-pointer transition-[transform,box-shadow] duration-200 ease-in-out hover:scale-105 active:scale-95 bg-gradient-to-br from-brand-deeper to-brand-deepest text-white shadow-lg shadow-brand-deepest/40 hover:shadow-xl hover:shadow-brand-deepest/50"
        @click="handleYes"
      >
        Yes
      </button>

      <!-- Invisible placeholder keeps the layout stable when No escapes -->
      <span
        v-if="hasEscaped"
        class="inline-block py-3.5 px-10 text-lg font-bold invisible"
        aria-hidden="true"
      >
        No
      </span>

      <!-- Single No button: starts in-flow next to Yes, becomes fixed once escaped -->
      <button
        ref="noBtn"
        class="btn-no-escaped font-nunito text-lg font-bold py-3.5 px-10 border-none rounded-full cursor-pointer hover:scale-105 active:scale-95 bg-white text-brand-dark shadow-md hover:shadow-lg"
        :class="hasEscaped ? 'fixed z-100' : 'relative'"
        :style="hasEscaped ? { left: noPosition.x + 'px', top: noPosition.y + 'px' } : {}"
        @mouseenter="escapeButton(EscapeTrigger.MouseEnter)"
        @click="escapeButton(EscapeTrigger.Click)"
        @touchstart.prevent="escapeButton(EscapeTrigger.TouchStart)"
      >
        No
      </button>
    </div>
  </div>
</template>
