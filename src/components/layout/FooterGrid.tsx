"use client";

import GridMotion from "@/components/animations/GridMotion";

const ФРАЗЫ = [
  "vibe coding",
  "prompt →",
  "AI first",
  "cursor",
  "claude",
  "copilot",
  "ship it",
  ">_ init",
  "hooks",
  "skills",
  "rules",
  "$ npm run",
  "deploy",
  "debug",
  "refactor",
  "git push",
  "sudo",
  "ssh",
  "docker",
  "CI/CD",
  "tests",
  "lint",
  "build",
  "commit",
  "merge",
  "branch",
  "config",
  "0xFF41",
];

/** GridMotion фон для футера — показывается только на десктопе */
export function FooterGrid() {
  return (
    <div className="absolute inset-0 -z-10 opacity-20 overflow-hidden">
      <GridMotion items={ФРАЗЫ} />
    </div>
  );
}
