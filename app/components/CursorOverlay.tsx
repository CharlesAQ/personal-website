"use client";

import TargetCursor from "./TargetCursor/TargetCursor";

export default function CursorOverlay() {
  return (
    <TargetCursor
      targetSelector=".cursor-target"
      cursorColor="#0a0a0a"
      cursorColorOnTarget="#404040"
      spinDuration={2.5}
    />
  );
}
