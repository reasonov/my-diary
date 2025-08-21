<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Мой Дневник</h1>
          </div>
          <nav class="flex space-x-4">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                $route.name === 'home'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Записи
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-gray-500">
          <p>Личный дневник • Данные сохраняются в выбранном файле</p>
          <p class="mt-1">Ваш браузер: {{ browserSupport }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDiaryStore } from './stores/diary'

const diaryStore = useDiaryStore()

const browserSupport = computed(() => {
  if ('showSaveFilePicker' in window) {
    return 'Поддерживает сохранение файлов ✅'
  }
  return 'Используется режим загрузки файлов ⚠️'
})

onMounted(() => {
  diaryStore.loadFromStorage()
})
</script>
