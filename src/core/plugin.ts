/**
 * Mood Board Plugin Core
 */

import type {
  ToolPluginCore,
  ToolContext,
  ToolResult,
} from "gui-chat-protocol";
import type {
  MoodBoardData,
  MoodBoardArgs,
  MoodBoardJsonData,
  MoodBoardItem,
} from "./types";
import { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";

export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";

// Predefined color palettes for different themes
const THEME_PALETTES: Record<string, string[]> = {
  vibrant: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"],
  minimal: ["#2C3E50", "#ECF0F1", "#95A5A6", "#BDC3C7", "#34495E", "#FFFFFF"],
  vintage: ["#D4A373", "#CCD5AE", "#E9EDC9", "#FEFAE0", "#FAEDCD", "#A8DADC"],
  modern: ["#6366F1", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B", "#10B981"],
  nature: ["#2D5016", "#52734D", "#91C788", "#FEFFDE", "#DDFFBC", "#BFEDC1"],
  ocean: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E", "#48CAE4"],
};

// Emoji sets for different moods
const MOOD_EMOJIS: Record<string, string[]> = {
  happy: ["😊", "🌟", "✨", "🎉", "💫", "🌈"],
  calm: ["🌿", "🍃", "☁️", "🌙", "💭", "🕊️"],
  creative: ["🎨", "💡", "🎭", "🖌️", "📐", "🎬"],
  energy: ["⚡", "🔥", "💪", "🚀", "⭐", "💥"],
  love: ["❤️", "💕", "💖", "🌹", "💝", "🥰"],
  nature: ["🌸", "🌺", "🌻", "🍀", "🌴", "🌊"],
};

function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getThemeColors(theme: string): string[] {
  return THEME_PALETTES[theme] || THEME_PALETTES.modern;
}

function getEmojisForMood(mood: string): string[] {
  const lowerMood = mood.toLowerCase();
  for (const [key, emojis] of Object.entries(MOOD_EMOJIS)) {
    if (lowerMood.includes(key)) {
      return emojis;
    }
  }
  return MOOD_EMOJIS.creative;
}

function calculateItemPosition(
  index: number,
  total: number,
  boardWidth: number,
  boardHeight: number
): { x: number; y: number } {
  const cols = Math.ceil(Math.sqrt(total));
  const row = Math.floor(index / cols);
  const col = index % cols;
  const cellWidth = boardWidth / cols;
  const cellHeight = boardHeight / Math.ceil(total / cols);

  // Add some randomness for organic feel
  const jitterX = (Math.random() - 0.5) * 20;
  const jitterY = (Math.random() - 0.5) * 20;

  return {
    x: col * cellWidth + cellWidth / 2 + jitterX,
    y: row * cellHeight + cellHeight / 2 + jitterY,
  };
}

function createMoodBoard(
  title: string,
  theme: string,
  concepts: string[]
): MoodBoardData {
  const boardWidth = 800;
  const boardHeight = 600;
  const colors = getThemeColors(theme);
  const items: MoodBoardItem[] = [];

  // Add color swatches
  colors.slice(0, 4).forEach((color, index) => {
    const pos = calculateItemPosition(index, concepts.length + 8, boardWidth, boardHeight);
    items.push({
      id: generateId(),
      type: "color",
      content: color,
      x: pos.x,
      y: pos.y,
      width: 80,
      height: 80,
      rotation: (Math.random() - 0.5) * 10,
    });
  });

  // Add concept texts
  concepts.forEach((concept, index) => {
    const pos = calculateItemPosition(index + 4, concepts.length + 8, boardWidth, boardHeight);
    items.push({
      id: generateId(),
      type: "text",
      content: concept,
      label: concept,
      x: pos.x,
      y: pos.y,
      width: 120,
      height: 40,
      rotation: (Math.random() - 0.5) * 8,
    });
  });

  // Add mood emojis
  const emojis = getEmojisForMood(theme);
  emojis.slice(0, 4).forEach((emoji, index) => {
    const pos = calculateItemPosition(concepts.length + 4 + index, concepts.length + 8, boardWidth, boardHeight);
    items.push({
      id: generateId(),
      type: "emoji",
      content: emoji,
      x: pos.x,
      y: pos.y,
      width: 60,
      height: 60,
      rotation: (Math.random() - 0.5) * 15,
    });
  });

  return {
    title,
    theme,
    items,
    backgroundColor: colors[colors.length - 1] + "20", // Light tint of last color
  };
}

function addItemToBoard(
  board: MoodBoardData,
  itemType: "color" | "text" | "emoji",
  content: string,
  label?: string,
  mood?: string
): MoodBoardData {
  const newItem: MoodBoardItem = {
    id: generateId(),
    type: itemType,
    content,
    label,
    mood,
    x: 400 + (Math.random() - 0.5) * 200,
    y: 300 + (Math.random() - 0.5) * 200,
    width: itemType === "color" ? 80 : itemType === "emoji" ? 60 : 120,
    height: itemType === "color" ? 80 : itemType === "emoji" ? 60 : 40,
    rotation: (Math.random() - 0.5) * 10,
  };

  return {
    ...board,
    items: [...board.items, newItem],
  };
}

function updateBoardTheme(board: MoodBoardData, theme: string): MoodBoardData {
  const colors = getThemeColors(theme);
  let colorIndex = 0;

  const updatedItems = board.items.map((item) => {
    if (item.type === "color") {
      const color = colors[colorIndex % colors.length];
      colorIndex++;
      return { ...item, content: color };
    }
    return item;
  });

  return {
    ...board,
    theme,
    items: updatedItems,
    backgroundColor: colors[colors.length - 1] + "20",
  };
}

export const executeMoodBoard = async (
  _context: ToolContext,
  args: MoodBoardArgs
): Promise<ToolResult<MoodBoardData, MoodBoardJsonData>> => {
  const { action } = args;

  let boardData: MoodBoardData;
  let message: string;
  let instructions: string;

  switch (action) {
    case "create": {
      if (!args.title) {
        return {
          toolName: TOOL_NAME,
          message: "Title is required for creating a mood board",
          instructions: "Ask the user for a title and theme.",
        };
      }
      boardData = createMoodBoard(
        args.title,
        args.theme || "modern",
        args.concepts || []
      );
      message = `Created mood board "${args.title}" with ${boardData.items.length} elements`;
      instructions =
        "Tell the user the mood board has been created. Ask if they want to add more elements or change the theme.";
      break;
    }

    case "add_item": {
      if (!args.existingBoard || !args.itemType || !args.itemContent) {
        return {
          toolName: TOOL_NAME,
          message: "Existing board, item type, and content are required",
          instructions: "Ask the user what type of item to add.",
        };
      }
      boardData = addItemToBoard(
        args.existingBoard as MoodBoardData,
        args.itemType,
        args.itemContent,
        args.itemLabel,
        args.itemMood
      );
      message = `Added ${args.itemType} to the mood board`;
      instructions =
        "Confirm the item was added. Ask if they want to add more or adjust the layout.";
      break;
    }

    case "update_theme": {
      if (!args.existingBoard || !args.theme) {
        return {
          toolName: TOOL_NAME,
          message: "Existing board and new theme are required",
          instructions: "Ask the user which theme they prefer.",
        };
      }
      boardData = updateBoardTheme(
        args.existingBoard as MoodBoardData,
        args.theme
      );
      message = `Updated mood board theme to "${args.theme}"`;
      instructions =
        "Confirm the theme was changed. Ask if they like the new look.";
      break;
    }

    case "rearrange": {
      if (!args.existingBoard) {
        return {
          toolName: TOOL_NAME,
          message: "Existing board is required for rearranging",
          instructions: "The mood board data is missing.",
        };
      }
      boardData = args.existingBoard as MoodBoardData;
      message = "Mood board rearranged";
      instructions = "The mood board has been refreshed.";
      break;
    }

    default:
      return {
        toolName: TOOL_NAME,
        message: `Unknown action: ${action}`,
        instructions: "Invalid action specified.",
      };
  }

  const jsonData: MoodBoardJsonData = {
    itemCount: boardData.items.length,
    theme: boardData.theme,
    items: boardData.items.map((item) => ({
      id: item.id,
      type: item.type,
      label: item.label,
    })),
  };

  return {
    toolName: TOOL_NAME,
    message,
    title: boardData.title,
    data: boardData,
    jsonData,
    instructions,
    updating: action !== "create",
  };
};

export const pluginCore: ToolPluginCore<
  MoodBoardData,
  MoodBoardJsonData,
  MoodBoardArgs
> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeMoodBoard,
  generatingMessage: "Creating mood board...",
  isEnabled: () => true,
  systemPrompt: SYSTEM_PROMPT,
};
