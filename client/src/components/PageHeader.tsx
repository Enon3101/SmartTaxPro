import React from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  size = "md",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-6";
      case "lg":
        return "py-12";
      case "md":
      default:
        return "py-8";
    }
  };

  return (
    <div className={`bg-muted/50 ${getSizeClasses()}`}>
      <div className="container">
        <h1 className={`font-bold tracking-tight ${size === "sm" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"}`}>
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};