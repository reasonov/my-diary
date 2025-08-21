import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { format, parseISO } from 'date-fns'

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    entries: [],
    tags: [],
    searchQuery: '',
    currentFilePath: null
  }),

  getters: {
    filteredEntries: (state) => {
      if (!state.searchQuery) {
        return [...state.entries].sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        )
      }

      const query = state.searchQuery.toLowerCase()
      return state.entries
        .filter(entry =>
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some(tag => tag.toLowerCase().includes(query)) ||
          format(parseISO(entry.date), 'dd.MM.yyyy').includes(query)
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    },

    allTags: (state) => {
      const tagSet = new Set()
      state.entries.forEach(entry => {
        entry.tags.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    }
  },

  actions: {
    addEntry(content, tags) {
      const newEntry = {
        id: uuidv4(),
        content,
        tags,
        date: new Date().toISOString()
      }
      this.entries.unshift(newEntry)
      this.saveToStorage()
    },

    updateEntry(id, content, tags) {
      const entryIndex = this.entries.findIndex(entry => entry.id === id)
      if (entryIndex !== -1) {
        this.entries[entryIndex] = {
          ...this.entries[entryIndex],
          content,
          tags
        }
        this.saveToStorage()
      }
    },

    deleteEntry(id) {
      this.entries = this.entries.filter(entry => entry.id !== id)
      this.saveToStorage()
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    // Сохранение в localStorage как fallback
    saveToStorage() {
      localStorage.setItem('diaryEntries', JSON.stringify(this.entries))
    },

    // Загрузка из localStorage как fallback
    loadFromStorage() {
      const savedEntries = localStorage.getItem('diaryEntries')
      if (savedEntries) {
        this.entries = JSON.parse(savedEntries)
      }
    },

    // Сохранение в файл
    async saveToFile() {
      try {
        const data = {
          entries: this.entries,
          savedAt: new Date().toISOString()
        }

        // Проверяем поддержку File System Access API
        if ('showSaveFilePicker' in window) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: `diary-${format(new Date(), 'yyyy-MM-dd')}.json`,
            types: [{
              description: 'JSON файл дневника',
              accept: { 'application/json': ['.json'] }
            }]
          })

          const writable = await fileHandle.createWritable()
          await writable.write(JSON.stringify(data, null, 2))
          await writable.close()

          this.currentFilePath = fileHandle.name
          return true
        } else {
          // Fallback для старых браузеров
          this.downloadFile()
          return true
        }
      } catch (error) {
        console.error('Ошибка сохранения файла:', error)
        // Fallback
        this.downloadFile()
        return false
      }
    },

    // Загрузка из файла
    async loadFromFile() {
      try {
        // Проверяем поддержку File System Access API
        if ('showOpenFilePicker' in window) {
          const [fileHandle] = await window.showOpenFilePicker({
            types: [{
              description: 'JSON файл дневника',
              accept: { 'application/json': ['.json'] }
            }]
          })

          const file = await fileHandle.getFile()
          const contents = await file.text()
          const data = JSON.parse(contents)

          if (data.entries) {
            this.entries = data.entries
            this.saveToStorage() // Сохраняем в localStorage как резерв
            this.currentFilePath = fileHandle.name
            return true
          }
        }
        return false
      } catch (error) {
        console.error('Ошибка загрузки файла:', error)
        return false
      }
    },

    // Fallback метод для скачивания файла
    downloadFile() {
      const data = {
        entries: this.entries,
        savedAt: new Date().toISOString()
      }

      const dataStr = JSON.stringify(data, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

      const exportFileDefaultName = `diary-${format(new Date(), 'yyyy-MM-dd')}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    },

    // Новый метод для создания нового дневника
    newDiary() {
      if (confirm('Вы уверены, что хотите создать новый дневник? Все несохраненные изменения будут потеряны.')) {
        this.entries = []
        this.currentFilePath = null
        this.saveToStorage()
        return true
      }
      return false
    }
  }
})