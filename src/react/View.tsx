/**
 * Mood Board Plugin - React View Component
 */

import { useState, useEffect } from "react";
import type { ViewComponentProps } from "gui-chat-protocol/react";
import type { MoodBoardData, MoodBoardJsonData, MoodBoardItem } from "../core/types";
import { TOOL_NAME } from "../core/definition";

type ViewProps = ViewComponentProps<MoodBoardData, MoodBoardJsonData>;

const VIEW_BOX_WIDTH = 800;
const VIEW_BOX_HEIGHT = 600;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function View({ selectedResult, sendTextMessage }: ViewProps) {
  const [data, setData] = useState<MoodBoardData | null>(null);

  useEffect(() => {
    if (selectedResult?.toolName === TOOL_NAME && selectedResult.data) {
      setData(selectedResult.data as MoodBoardData);
    }
  }, [selectedResult]);

  const handleItemClick = (item: MoodBoardItem) => {
    if (sendTextMessage) {
      if (item.type === "color") {
        sendTextMessage(
          `Add more elements that complement the color ${item.content}`
        );
      } else if (item.type === "text") {
        sendTextMessage(
          `Expand on the concept "${item.content}" - add related moods and colors`
        );
      } else if (item.type === "emoji") {
        sendTextMessage(
          `Add more elements that match the mood of ${item.content}`
        );
      }
    }
  };

  if (!data) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-400">No mood board data</p>
      </div>
    );
  }

  return (
    <div
      className="size-full overflow-hidden"
      style={{ backgroundColor: data.backgroundColor || "#F9FAFB" }}
    >
      <div className="size-full relative">
        {/* Title and Theme */}
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-xl font-bold text-gray-800 bg-white/80 px-3 py-1 rounded-lg shadow">
            {data.title}
          </h2>
          {data.theme && (
            <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded mt-1 inline-block">
              {data.theme}
            </span>
          )}
        </div>

        {/* SVG Canvas */}
        <svg
          className="size-full"
          viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Items */}
          <g className="items">
            {data.items.map((item) => (
              <g
                key={item.id}
                transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation || 0})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => handleItemClick(item)}
              >
                {/* Color swatch */}
                {item.type === "color" && (
                  <rect
                    x={-item.width / 2}
                    y={-item.height / 2}
                    width={item.width}
                    height={item.height}
                    fill={item.content}
                    rx={8}
                    className="drop-shadow-lg"
                    stroke="white"
                    strokeWidth={3}
                  />
                )}

                {/* Emoji */}
                {item.type === "emoji" && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none pointer-events-none"
                    style={{ fontSize: `${item.width}px` }}
                  >
                    {item.content}
                  </text>
                )}

                {/* Text */}
                {item.type === "text" && (
                  <>
                    <rect
                      x={-item.width / 2}
                      y={-item.height / 2}
                      width={item.width}
                      height={item.height}
                      fill="white"
                      rx={4}
                      className="drop-shadow-md"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#374151"
                      className="text-sm font-medium select-none pointer-events-none"
                    >
                      {truncateText(item.content, 15)}
                    </text>
                  </>
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-sm text-gray-500 bg-white/80 px-3 py-2 rounded-lg inline-block">
            Click an item to explore related concepts
          </p>
        </div>
      </div>
    </div>
  );
}

export default View;
