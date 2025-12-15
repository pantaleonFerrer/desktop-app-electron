<template>
  <div class="p-6">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">System Users</h2>
      <p class="text-gray-600">List of users available on the system</p>
    </div>

    <div v-if="usersStore.loading" class="flex justify-center items-center h-64">
      <div class="text-gray-500">Loading users...</div>
    </div>

    <div v-else-if="usersStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ usersStore.error }}
    </div>

    <div v-else-if="!usersStore.hasUsers" class="text-gray-500 text-center py-8">
      No users found
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="(user, index) in usersStore.users"
        :key="index"
        :class="[
          'p-4 rounded-lg shadow-sm border transition-shadow',
          usersStore.isCurrentUser(user.Name)
            ? 'bg-blue-50 border-blue-300 shadow-md'
            : 'bg-white border-gray-200 hover:shadow-md'
        ]"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-gray-800">{{ user.Name || 'Unknown User' }}</h3>
              <span
                v-if="usersStore.isCurrentUser(user.Name)"
                class="px-2 py-1 text-xs bg-blue-600 text-white rounded-full font-medium"
              >
                Current User
              </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ user.Description || 'No description' }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-500">
              <span :class="user.Enabled ? 'text-green-600' : 'text-red-600'">
                {{ user.Enabled ? 'Enabled' : 'Disabled' }}
              </span>
              <span v-if="user.LastLogon">
                Last Logon: {{ formatDate(user.LastLogon) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUsersStore } from '../stores/users';

const usersStore = useUsersStore();

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Never';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
};

onMounted(() => {
  usersStore.fetchUsers();
});
</script>

