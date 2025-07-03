import React from "react";

import { Slider, SliderProps } from "@/components/ui/slider";

export interface ImprovedSliderProps extends SliderProps {
  label?: string;
  description?: string;
  value: number[] | undefined;
  displayValue?: string;
}

/**
 * An improved slider component with better spacing to prevent text overlap
 */
export function ImprovedSlider({
  label,
  description,
  value,
  displayValue,
  className,
  ...props
}: ImprovedSliderProps) {
  return (
    <div className="space-y-4 mb-6">
      {label && <div className="text-sm font-medium mb-2">{label}</div>}
      <div className="flex items-center gap-4">
        <Slider 
          value={value} 
          className={`flex-1 ${className}`} 
          {...props} 
        />
        {displayValue && (
          <div className="w-16 text-center font-medium">
            {displayValue}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 pt-1">{description}</p>
      )}
    </div>
  );
}
