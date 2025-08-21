<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
    <input
      v-model="searchQuery"
      @input="onSearch"
      type="text"
      class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      placeholder="Поиск по записям, тегам или дате..."
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')

const onSearch = () => {
  emit('search', searchQuery.value)
}
</script>
