import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    (<input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground bg-white my-2 dark:bg-input/30 border-1 border-black flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base text-black shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
        className
      )}
      {...props} />)
  );
}

export { Input }
