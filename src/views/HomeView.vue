<template>
  <div class="flex flex-col gap-4 items-center justify-center h-full">
    <h2 class="text-2xl font-bold text-gray-800 mb-8">Welcome</h2>
    <div class="flex gap-4">
      <router-link
        to="/apps"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
      >
        Apps
      </router-link>
      <router-link
        to="/users"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
      >
        Users
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

