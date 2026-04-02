/**
 * Mood Board Plugin - React Preview Component
 */

import type { PreviewComponentProps } from "gui-chat-protocol/react";
import type { MoodBoardData, MoodBoardJsonData } from "../core/types";

type PreviewProps = PreviewComponentProps<MoodBoardData, MoodBoardJsonData>;

export function Preview({ result }: PreviewProps) {
  const data = result.data as MoodBoardData | null;

  if (!data) {
    return null;
  }

  const title = data.title || "Mood Board";
  const itemCount = data.items?.length || 0;

  return (
    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg text-center">
      <div className="text-2xl mb-1">🎨</div>
      <div className="text-purple-700 font-medium text-sm truncate">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{itemCount} elements</div>
    </div>
  );
}

export default Preview;
