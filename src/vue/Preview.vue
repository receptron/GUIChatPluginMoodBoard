<template>
  <div class="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-center">
    <div class="text-2xl mb-1">🎨</div>
    <div class="text-purple-700 font-medium text-sm truncate">
      {{ title }}
    </div>
    <div class="text-xs text-gray-500 mt-1">
      {{ itemCount }} elements
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { MoodBoardData } from "../core/types";

const props = defineProps<{
  result: ToolResult<MoodBoardData>;
}>();

const data = computed(() => props.result.data as MoodBoardData | null);
const title = computed(() => data.value?.title || "Mood Board");
const itemCount = computed(() => data.value?.items?.length || 0);
</script>
