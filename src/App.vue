<script setup>
import { ref } from 'vue'
import AskPage from './components/AskPage.vue'
import YesPage from './components/YesPage.vue'

const saidYes = ref(false)

function onYes() {
  saidYes.value = true
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <YesPage v-if="saidYes" />
    <AskPage v-else @yes="onYes" />
  </Transition>
</template>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c3a1d0 0%, #9b59b6 50%, #7d3c98 100%);
  overflow: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
