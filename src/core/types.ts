/**
 * Mood Board Plugin - Type Definitions
 */

/** An item on the mood board */
export interface MoodBoardItem {
  id: string;
  type: "color" | "text" | "emoji";
  content: string; // hex for color, text content, or emoji
  label?: string;
  mood?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

/** Data stored in result.data (for UI display) */
export interface MoodBoardData {
  title: string;
  theme?: string;
  items: MoodBoardItem[];
  backgroundColor?: string;
}

/** JSON data returned in result.jsonData */
export interface MoodBoardJsonData {
  itemCount: number;
  theme?: string;
  items: Array<{ id: string; type: string; label?: string }>;
}

/** Arguments passed to the tool */
export interface MoodBoardArgs {
  action: "create" | "add_item" | "update_theme" | "rearrange";
  title?: string;
  theme?: string;
  concepts?: string[];
  existingBoard?: MoodBoardData;
  itemType?: "color" | "text" | "emoji";
  itemContent?: string;
  itemLabel?: string;
  itemMood?: string;
}
