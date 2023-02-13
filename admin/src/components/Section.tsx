import React from "react";

export type SectionProps = {
  title: string;
  description: string;
  button?: React.ReactNode;
};

const Section = ({ title, description, button }: SectionProps) => {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-700">{description}</p>
      </div>
      {button && (
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">{button}</div>
      )}
    </div>
  );
};

export default Section;
