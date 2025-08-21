import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiaryEntryView from '../views/DiaryEntryView.vue'

const router = createRouter({
  history: createWebHistory('/my-diary/'), // Замените на имя вашего репозитория
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/entry/:id',
      name: 'entry',
      component: DiaryEntryView,
      props: true,
    },
  ],
})

export default router
