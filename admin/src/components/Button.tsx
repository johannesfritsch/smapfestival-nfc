import { classNames } from "@/utils/css";
import React from "react";

export type ButtonProps = {
  caption: string;
  onClick: () => void;
  className?: string;
};

const Button = ({ caption, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames("inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto", className || "")}
    >
      {caption}
    </button>
  );
};

export default Button;
