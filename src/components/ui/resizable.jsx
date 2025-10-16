import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  style,
  layout,
  onLayout,
  ...props
}) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      layout={layout}          // ✅ forward controlled layout
      onLayout={onLayout}      // ✅ forward onLayout callback
      style={{
        ...style,
        ["--panel-resize-handle-size"]: "1px",
      }}
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel(props) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({ withHandle = true, className, ...props }) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "group relative flex items-center justify-center",
        "data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=horizontal]:bg-transparent",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:bg-transparent",
        "after:absolute after:-inset-2 after:content-['']",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "z-10 flex h-6 w-6 items-center justify-center rounded-md border bg-background shadow"
          )}
        >
          <GripVerticalIcon className="size-4 opacity-70" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
