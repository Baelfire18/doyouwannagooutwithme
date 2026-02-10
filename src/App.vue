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
