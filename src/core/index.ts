/**
 * Mood Board Plugin - Core (Framework-agnostic)
 */

export type {
  MoodBoardData,
  MoodBoardArgs,
  MoodBoardJsonData,
  MoodBoardItem,
} from "./types";

export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SYSTEM_PROMPT,
  executeMoodBoard,
  pluginCore,
} from "./plugin";

export { samples } from "./samples";
