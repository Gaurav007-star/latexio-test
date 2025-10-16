
"use client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls = [],
}) => {
  return (
    <div className={cn("z-0 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((avatar, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <a
              href={avatar.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 hover:scale-105 transition"
                src={avatar.imageUrl}
                width={40}
                height={40}
                alt={avatar.title || `Avatar ${index + 1}`}
              />
            </a>
          </TooltipTrigger>
          <TooltipContent className={`bg-white text-black flex items-center justify-center`}>
            <p>{avatar.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {(numPeople ?? 0) > 0 && (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white 
          bg-black text-center text-xs font-medium text-white hover:bg-gray-600 
          dark:border-gray-800 dark:bg-white dark:text-black"
        >
          +{numPeople}
        </div>
      )}
    </div>
  );
};
