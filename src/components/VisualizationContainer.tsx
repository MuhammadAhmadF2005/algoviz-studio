import { ReactNode } from "react";

interface VisualizationContainerProps {
  title: string;
  description: string;
  controls: ReactNode;
  children: ReactNode;
}

export const VisualizationContainer = ({
  title,
  description,
  controls,
  children,
}: VisualizationContainerProps) => {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="flex flex-wrap gap-2">{controls}</div>
      </div>

      <div className="bg-card rounded-lg border p-8 min-h-[400px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
