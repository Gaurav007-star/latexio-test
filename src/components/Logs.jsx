import React, { useEffect, useState } from "react";
import { BiMessageAltError } from "react-icons/bi";
import { CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const Logs = ({ isLoading, statusMessage, errorLog,}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errorLog) {
      setOpen(true); 
    }
  }, [errorLog]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="icon-section relative bg-transparent border-none outline-none shadow-none m-0 p-0"
          disabled={isLoading}
        >
          <BiMessageAltError
            className={`w-[22px] h-[22px] font-semibold max-[1025px]:mr-2 flex items-center ${
              isLoading
                ? "text-primary cursor-not-allowed"
                : "text-icon hover:scale-105 transition-transform cursor-pointer duration-200"
            }`}
            title="errors"
          />
          {errorLog && (
            <div className="circle absolute top-1 max-[1025px]:top-0 right-0 max-[1025px]:right-2 w-[10px] h-[10px] bg-red-400 rounded-full animate-pulse" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className={`z-[2000]`}>
        <SheetHeader>
          <SheetTitle>Error Logs</SheetTitle>
          <SheetDescription>
            <CardContent>
              {statusMessage && (
                <div className="w-full h-[85vh] mt-5 p-1 border bg-[#F5F5F5] rounded overflow-y-auto text-xs">
                  <h6 className="font-semibold text-red-700">Log Output:</h6>
                  <pre className="text-red-800 whitespace-pre-wrap break-words">
                    {statusMessage}
                  </pre>
                </div>
              )}
            </CardContent>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Logs;
