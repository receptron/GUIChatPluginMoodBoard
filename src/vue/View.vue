<template>
  <div class="size-full overflow-hidden" :style="{ backgroundColor: data?.backgroundColor || '#F9FAFB' }">
    <div v-if="data" class="size-full relative">
      <!-- Title and Theme -->
      <div class="absolute top-4 left-4 z-10">
        <h2 class="text-xl font-bold text-gray-800 bg-white/80 px-3 py-1 rounded-lg shadow">
          {{ data.title }}
        </h2>
        <span v-if="data.theme" class="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded mt-1 inline-block">
          {{ data.theme }}
        </span>
      </div>

      <!-- SVG Canvas -->
      <svg
        ref="svgRef"
        class="size-full"
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Items -->
        <g class="items">
          <g
            v-for="item in data.items"
            :key="item.id"
            :transform="`translate(${item.x}, ${item.y}) rotate(${item.rotation || 0})`"
            class="cursor-pointer transition-transform duration-200 hover:scale-110"
            @click="handleItemClick(item)"
          >
            <!-- Color swatch -->
            <template v-if="item.type === 'color'">
              <rect
                :x="-item.width / 2"
                :y="-item.height / 2"
                :width="item.width"
                :height="item.height"
                :fill="item.content"
                rx="8"
                class="drop-shadow-lg"
                stroke="white"
                stroke-width="3"
              />
            </template>

            <!-- Emoji -->
            <template v-else-if="item.type === 'emoji'">
              <text
                text-anchor="middle"
                dominant-baseline="middle"
                class="select-none pointer-events-none"
                :style="{ fontSize: `${item.width}px` }"
              >
                {{ item.content }}
              </text>
            </template>

            <!-- Text -->
            <template v-else-if="item.type === 'text'">
              <rect
                :x="-item.width / 2"
                :y="-item.height / 2"
                :width="item.width"
                :height="item.height"
                fill="white"
                rx="4"
                class="drop-shadow-md"
              />
              <text
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#374151"
                class="text-sm font-medium select-none pointer-events-none"
              >
                {{ truncateText(item.content, 15) }}
              </text>
            </template>
          </g>
        </g>
      </svg>

      <!-- Instructions -->
      <div class="absolute bottom-4 left-4 right-4 text-center">
        <p class="text-sm text-gray-500 bg-white/80 px-3 py-2 rounded-lg inline-block">
          Click an item to explore related concepts
        </p>
      </div>
    </div>

    <div v-else class="size-full flex items-center justify-center">
      <p class="text-gray-400">No mood board data</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ToolResult } from "gui-chat-protocol";
import type { MoodBoardData, MoodBoardItem } from "../core/types";
import { TOOL_NAME } from "../core/definition";

const props = defineProps<{
  selectedResult: ToolResult<MoodBoardData>;
  sendTextMessage?: (text?: string) => void;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const data = ref<MoodBoardData | null>(null);

const viewBoxWidth = 800;
const viewBoxHeight = 600;

watch(
  () => props.selectedResult,
  (newResult) => {
    if (newResult?.toolName === TOOL_NAME && newResult.data) {
      data.value = newResult.data as MoodBoardData;
    }
  },
  { immediate: true }
);

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

function handleItemClick(item: MoodBoardItem) {
  if (props.sendTextMessage) {
    if (item.type === "color") {
      props.sendTextMessage(
        `Add more elements that complement the color ${item.content}`
      );
    } else if (item.type === "text") {
      props.sendTextMessage(
        `Expand on the concept "${item.content}" - add related moods and colors`
      );
    } else if (item.type === "emoji") {
      props.sendTextMessage(
        `Add more elements that match the mood of ${item.content}`
      );
    }
  }
}
</script>
