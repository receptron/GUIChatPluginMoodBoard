/**
 * Mood Board Tool Definition
 */

import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "createMoodBoard";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Create or update a visual mood board to capture inspiration, themes, and aesthetics. Use colors, emojis, and text to represent moods, concepts, and ideas visually.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["create", "add_item", "update_theme", "rearrange"],
        description:
          "Action to perform: create (new mood board), add_item (add element), update_theme (change style), rearrange (reorganize)",
      },
      title: {
        type: "string",
        description: "Title of the mood board (required for create action)",
      },
      theme: {
        type: "string",
        description: "Overall theme (e.g., 'minimal', 'vibrant', 'vintage', 'modern')",
      },
      concepts: {
        type: "array",
        items: { type: "string" },
        description: "Concepts, keywords, or moods to visualize on the board",
      },
      existingBoard: {
        type: "object",
        description: "Current mood board state for updates",
      },
      itemType: {
        type: "string",
        enum: ["color", "text", "emoji"],
        description: "Type of item to add",
      },
      itemContent: {
        type: "string",
        description: "Content for the item (hex color, text, or emoji)",
      },
      itemLabel: {
        type: "string",
        description: "Optional label describing the item",
      },
      itemMood: {
        type: "string",
        description: "Mood or feeling associated with the item",
      },
    },
    required: ["action"],
  },
};

export const SYSTEM_PROMPT = `Use ${TOOL_NAME} to create visual mood boards when:
- The user wants to capture an aesthetic or vibe
- Exploring color palettes and themes
- Visualizing brand identity or style direction
- Collecting inspiration for a project
- Expressing emotions or moods visually

When creating a mood board:
- Start with colors that represent the core mood
- Add emojis for quick visual communication
- Include text for key concepts and words
- Consider balance and visual harmony

Color meanings:
- Warm colors (red, orange, yellow): energy, passion, warmth
- Cool colors (blue, green, purple): calm, nature, creativity
- Neutral colors (black, white, gray): sophistication, balance`;
