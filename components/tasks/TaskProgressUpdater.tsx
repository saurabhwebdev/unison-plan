"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskProgressUpdaterProps {
  taskId: string;
  currentProgress: number;
  onProgressUpdate: (taskId: string, newProgress: number) => Promise<void>;
  variant?: "inline" | "button";
  className?: string;
}

export function TaskProgressUpdater({
  taskId,
  currentProgress,
  onProgressUpdate,
  variant = "inline",
  className,
}: TaskProgressUpdaterProps) {
  const [progress, setProgress] = useState(currentProgress);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const quickProgress = [0, 25, 50, 75, 100];

  const handleQuickProgress = async (value: number) => {
    setProgress(value);
    setIsUpdating(true);
    try {
      await onProgressUpdate(taskId, value);
      setIsOpen(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSliderChange = (values: number[]) => {
    setProgress(values[0]);
  };

  const handleApply = async () => {
    if (progress === currentProgress) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onProgressUpdate(taskId, progress);
      setIsOpen(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setProgress(currentProgress);
    setIsOpen(false);
  };

  if (variant === "button") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("w-full sm:w-auto", className)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {currentProgress}%
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <ProgressEditor
            progress={progress}
            onSliderChange={handleSliderChange}
            onQuickProgress={handleQuickProgress}
            onApply={handleApply}
            onCancel={handleCancel}
            isUpdating={isUpdating}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full cursor-pointer transition-opacity hover:opacity-80",
            className
          )}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <ProgressEditor
          progress={progress}
          onSliderChange={handleSliderChange}
          onQuickProgress={handleQuickProgress}
          onApply={handleApply}
          onCancel={handleCancel}
          isUpdating={isUpdating}
        />
      </PopoverContent>
    </Popover>
  );
}

interface ProgressEditorProps {
  progress: number;
  onSliderChange: (values: number[]) => void;
  onQuickProgress: (value: number) => void;
  onApply: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}

function ProgressEditor({
  progress,
  onSliderChange,
  onQuickProgress,
  onApply,
  onCancel,
  isUpdating,
}: ProgressEditorProps) {
  const quickProgress = [0, 25, 50, 75, 100];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Update Progress</label>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="space-y-3">
        <label className="text-xs text-muted-foreground">
          Drag to adjust or tap a quick value
        </label>
        <Slider
          value={[progress]}
          onValueChange={onSliderChange}
          min={0}
          max={100}
          step={5}
          className="w-full"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Quick select</label>
        <div className="grid grid-cols-5 gap-2">
          {quickProgress.map((value) => (
            <Button
              key={value}
              variant={progress === value ? "default" : "outline"}
              size="sm"
              onClick={() => onQuickProgress(value)}
              disabled={isUpdating}
              className="h-9"
            >
              {value}%
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isUpdating}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onApply}
          disabled={isUpdating}
          className="flex-1"
        >
          {isUpdating ? "Updating..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}
