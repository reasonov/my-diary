<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 class="text-2xl font-bold text-gray-900">Мой Дневник</h2>

      <div class="flex flex-wrap gap-2">
        <button @click="newDiary" class="btn-secondary flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Новый
        </button>

        <button @click="loadFromFile" class="btn-secondary flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            ></path>
          </svg>
          Открыть
        </button>

        <button @click="saveToFile" class="btn-primary flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            ></path>
          </svg>
          Сохранить
        </button>
      </div>
    </div>

    <div class="mb-8">
      <NewEntryForm @entry-added="onEntryAdded" />
    </div>

    <div class="mb-6">
      <SearchBar @search="onSearch" />
    </div>

    <div v-if="diaryStore.entries.length > 0" class="mb-4 text-sm text-gray-600">
      Всего записей: {{ diaryStore.entries.length }}
      <span v-if="diaryStore.currentFilePath"> | Файл: {{ diaryStore.currentFilePath }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DiaryEntryCard
        v-for="entry in diaryStore.filteredEntries"
        :key="entry.id"
        :entry="entry"
        @delete-entry="onDeleteEntry"
      />
    </div>

    <div v-if="diaryStore.filteredEntries.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">Записей не найдено</h3>
      <p class="text-gray-500">Попробуйте изменить поисковый запрос или создайте новую запись</p>
    </div>
  </div>
</template>

<script setup>
import { useDiaryStore } from '../stores/diary'
import NewEntryForm from '../components/NewEntryForm.vue'
import DiaryEntryCard from '../components/DiaryEntryCard.vue'
import SearchBar from '../components/SearchBar.vue'

const diaryStore = useDiaryStore()

const onEntryAdded = () => {
  // Сброс формы или другие действия
}

const onSearch = (query) => {
  diaryStore.setSearchQuery(query)
}

const onDeleteEntry = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    diaryStore.deleteEntry(id)
  }
}

const saveToFile = async () => {
  const success = await diaryStore.saveToFile()
  if (success) {
    alert('Дневник успешно сохранен!')
  }
}

const loadFromFile = async () => {
  const success = await diaryStore.loadFromFile()
  if (success) {
    alert('Дневник успешно загружен!')
  } else {
    alert('Не удалось загрузить файл. Проверьте формат файла.')
  }
}

const newDiary = () => {
  diaryStore.newDiary()
}
</script>
