<template>
  <div class="diary-card">
    <div class="p-6">
      <form @submit.prevent="submitEntry">
        <div class="mb-4">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Текст записи
          </label>
          <textarea
            id="content"
            v-model="content"
            rows="6"
            class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Что произошло сегодня? О чём вы думаете?"
            required
          ></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Теги</label>
          <div class="flex flex-wrap mb-2">
            <span
              v-for="tag in selectedTags"
              :key="tag"
              class="tag-removable"
              @click="removeTag(tag)"
            >
              {{ tag }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </span>
          </div>
          <div class="flex">
            <input
              v-model="newTag"
              @keyup.enter="addTag"
              type="text"
              class="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Добавить тег..."
            />
            <button @click="addTag" type="button" class="btn-secondary rounded-l-none">
              Добавить
            </button>
          </div>
          <div class="mt-2">
            <div class="text-xs text-gray-500 mb-1">Предложенные теги:</div>
            <div class="flex flex-wrap">
              <button
                v-for="tag in suggestedTags"
                :key="tag"
                type="button"
                @click="selectSuggestedTag(tag)"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-2 hover:bg-gray-200"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn-primary" :disabled="!content.trim()">
            Добавить запись
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiaryStore } from '../stores/diary'

const emit = defineEmits(['entryAdded'])

const diaryStore = useDiaryStore()

const content = ref('')
const newTag = ref('')
const selectedTags = ref([])

const suggestedTags = computed(() => {
  const commonTags = ['работа', 'личное', 'мысли', 'планы', 'важное', 'идеи', 'настроение']
  const existingTags = diaryStore.allTags

  // Объединяем общие теги с существующими, убираем дубликаты
  const allTags = [...new Set([...commonTags, ...existingTags])]

  // Возвращаем только те, которые еще не выбраны
  return allTags.filter((tag) => !selectedTags.value.includes(tag)).slice(0, 8)
})

const addTag = () => {
  if (newTag.value.trim() && !selectedTags.value.includes(newTag.value.trim())) {
    selectedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag)
}

const selectSuggestedTag = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
}

const submitEntry = () => {
  if (content.value.trim()) {
    diaryStore.addEntry(content.value.trim(), [...selectedTags.value])
    content.value = ''
    selectedTags.value = []
    emit('entryAdded')
  }
}
</script>
