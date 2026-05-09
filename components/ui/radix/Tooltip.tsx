"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

export function AppTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="
              z-50
              rounded-md bg-slate-900 px-2 py-1
              text-xs text-white
              shadow-lg
              data-[state=delayed-open]:animate-in
              data-[state=closed]:animate-out
            "
          >
            {content}
            <Tooltip.Arrow className="fill-slate-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
