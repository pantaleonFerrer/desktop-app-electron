<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <div class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md drag-region">
      <div class="flex items-center gap-2">
        <button
          v-if="!isHome"
          @click="goBack"
          class="px-2 py-1 text-sm hover:bg-blue-700 rounded transition-colors no-drag"
          title="Go back"
        >
          ←
        </button>
        <h1 class="text-lg font-semibold">Desktop App</h1>
      </div>
      <div class="flex items-center gap-2">
        <router-link
          to="/"
          class="px-3 py-1 text-sm hover:bg-blue-700 rounded transition-colors no-drag"
        >
          Home
        </router-link>
        <button
          @click="closeApp"
          class="px-3 py-1 text-sm hover:bg-red-600 rounded transition-colors no-drag"
          title="Close app"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isHome = computed(() => route.path === '/');

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const closeApp = async () => {
  if (window.electronAPI) {
    await window.electronAPI.closeApp();
  }
};
</script>
