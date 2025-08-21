<template>
  <div class="diary-card">
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ formatDate(entry.date) }}
        </h3>
        <div class="flex space-x-2">
          <button
            @click="$router.push(`/entry/${entry.id}`)"
            class="text-gray-400 hover:text-primary-600"
            title="Просмотр"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          <button
            @click="$emit('deleteEntry', entry.id)"
            class="text-gray-400 hover:text-red-600"
            title="Удалить"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-gray-700 line-clamp-3 whitespace-pre-wrap">
          {{ entry.content }}
        </p>
      </div>

      <div class="flex flex-wrap">
        <span
          v-for="tag in entry.tags.slice(0, 3)"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
        <span
          v-if="entry.tags.length > 3"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 mr-2 mb-2"
        >
          +{{ entry.tags.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
})

defineEmits(['deleteEntry'])

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'd MMM yyyy', { locale: ru })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>