/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "../magicui/border-beam";

const DialogModal = ({
  Icon,
  isLoading,
  title,
  label,
  heading,
  headingClass,
  inputValue,
  setInputValue,
  submitHandler,
  btnName,
  ...props
}) => {
  const otherProperty = { ...props };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className={headingClass} disabled={isLoading}>
            {heading}
          </button>
        </DialogTrigger>

        <DialogTrigger asChild className={`group-hover:text-white`}>
          <button
            className="text-primary hover:text-[#6d6e71] flex items-center cursor-pointer"
            title="Add new page"
            disabled={isLoading}
          >
            {Icon && <Icon className={`${otherProperty.className}`} />}
          </button>
        </DialogTrigger>

        {/* DialogContent goes here */}
        <DialogContent className="sm:max-w-[425px] m-0 ">
          <DialogHeader>
            <DialogTitle className={`text-[16px] font-semibold text-center`}>
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid ">
            <div className="grid">
              <Input
                id={label}
                name={label}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={label}
                className={`border-icon`}
              />
            </div>
          </div>
          <DialogFooter >
            <DialogClose asChild>
              <button className="border border-icon rounded-full px-4 py-1 cursor-pointer hover:scale-105 transition-transform duration-200">Cancel</button>
            </DialogClose>
            <button className="cursor-pointer hover:scale-105 transition-transform duration-200 bg-shadow rounded-full px-4 py-1 text-primary" onClick={() => submitHandler(inputValue)}>
              {btnName}
            </button>
          </DialogFooter>
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={4}
            className="from-transparent via-secondary to-transparent"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogModal;
