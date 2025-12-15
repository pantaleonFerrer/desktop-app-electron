<template>
  <div class="p-6">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Installed Apps</h2>
      <p class="text-gray-600">List of applications installed on the system</p>
    </div>

    <div v-if="appsStore.loading" class="flex justify-center items-center h-64">
      <div class="text-gray-500">Loading apps...</div>
    </div>

    <div v-else-if="appsStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ appsStore.error }}
    </div>

    <div v-else-if="!appsStore.hasApps" class="text-gray-500 text-center py-8">
      No apps found
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="(app, index) in appsStore.apps"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ app.DisplayName || 'Unknown App' }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ app.Publisher || 'Unknown Publisher' }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-500">
              <span v-if="app.DisplayVersion">Version: {{ app.DisplayVersion }}</span>
              <span v-if="app.InstallDate">Installed: {{ formatDate(app.InstallDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppsStore } from '../stores/apps';

const appsStore = useAppsStore();

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Unknown';
  if (dateStr.length === 8) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

onMounted(() => {
  appsStore.fetchApps();
});
</script>

