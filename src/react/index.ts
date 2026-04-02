/**
 * Mood Board Plugin - React Implementation
 */

import "../style.css";

import type { ToolPluginReact } from "gui-chat-protocol/react";
import type { MoodBoardData, MoodBoardArgs, MoodBoardJsonData } from "../core/types";
import { pluginCore } from "../core/plugin";
import { samples } from "../core/samples";
import { View } from "./View";
import { Preview } from "./Preview";

export const plugin: ToolPluginReact<MoodBoardData, MoodBoardJsonData, MoodBoardArgs> = {
  ...pluginCore,
  ViewComponent: View,
  PreviewComponent: Preview,
  samples,
};

export type { MoodBoardData, MoodBoardArgs, MoodBoardJsonData } from "../core/types";

export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SYSTEM_PROMPT,
  executeMoodBoard,
  pluginCore,
} from "../core/plugin";

export { samples } from "../core/samples";

export { View, Preview };

export default { plugin };
