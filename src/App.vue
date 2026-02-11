<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AskPage from './components/AskPage.vue'
import YesPage from './components/YesPage.vue'
import { initTracker } from './services/tracker'

const saidYes = ref<boolean>(false)

function onYes(): void {
  saidYes.value = true
}

// Start fetching IP + geolocation early so data is ready for the first event
onMounted((): void => {
  initTracker()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <YesPage v-if="saidYes" />
    <AskPage v-else @yes="onYes" />
  </Transition>
</template>
