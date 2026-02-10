<script setup lang="ts">
import { ref } from 'vue'
import AskPage from './components/AskPage.vue'
import YesPage from './components/YesPage.vue'

const saidYes = ref<boolean>(false)

function onYes(): void {
  saidYes.value = true
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <YesPage v-if="saidYes" />
    <AskPage v-else @yes="onYes" />
  </Transition>
</template>
