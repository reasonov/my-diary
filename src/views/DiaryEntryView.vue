<template>
  <div>
    <div class="mb-6">
      <button
        @click="$router.back()"
        class="flex items-center text-primary-600 hover:text-primary-800"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Назад
      </button>
    </div>

    <div v-if="entry" class="diary-card">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold text-gray-900">
            Запись от {{ formatDate(entry.date) }}
          </h2>
          <div class="flex space-x-2">
            <button
              @click="isEditing = !isEditing"
              class="btn-secondary"
            >
              {{ isEditing ? 'Отмена' : 'Редактировать' }}
            </button>
            <button
              @click="deleteEntry"
              class="btn-danger"
            >
              Удалить
            </button>
          </div>
        </div>

        <div v-if="!isEditing" class="prose max-w-none">
          <p class="text-gray-700 whitespace-pre-wrap">{{ entry.content }}</p>
        </div>

        <div v-else>
          <textarea
            v-model="editContent"
            rows="10"
            class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Введите текст записи..."
          ></textarea>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Теги</label>
            <div class="flex flex-wrap mb-2">
              <span
                v-for="tag in editTags"
                :key="tag"
                class="tag-removable"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
              >
              <button
                @click="addTag"
                class="btn-secondary rounded-l-none"
              >
                Добавить
              </button>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="isEditing = false"
              class="btn-secondary"
            >
              Отмена
            </button>
            <button
              @click="saveEntry"
              class="btn-primary"
            >
              Сохранить
            </button>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap">
            <span
              v-for="tag in entry.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">Запись не найдена</h3>
      <p class="text-gray-500 mt-2">Возможно, запись была удалена</p>
      <router-link to="/" class="mt-4 inline-block text-primary-600 hover:text-primary-800">
        Вернуться к списку записей
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiaryStore } from '../stores/diary'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const diaryStore = useDiaryStore()

const isEditing = ref(false)
const editContent = ref('')
const editTags = ref([])
const newTag = ref('')

const entry = computed(() => {
  return diaryStore.entries.find(e => e.id === route.params.id)
})

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'd MMMM yyyy в HH:mm', { locale: ru })
}

const addTag = () => {
  if (newTag.value.trim() && !editTags.value.includes(newTag.value.trim())) {
    editTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  editTags.value = editTags.value.filter(t => t !== tag)
}

const saveEntry = () => {
  if (entry.value) {
    diaryStore.updateEntry(entry.value.id, editContent.value, editTags.value)
    isEditing.value = false
  }
}

const deleteEntry = () => {
  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    if (entry.value) {
      diaryStore.deleteEntry(entry.value.id)
      router.push('/')
    }
  }
}

onMounted(() => {
  if (entry.value) {
    editContent.value = entry.value.content
    editTags.value = [...entry.value.tags]
  }
})
</script>