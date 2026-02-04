import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepsProps {
  steps: { id: number; title: string; description: string }[];
  currentStep: number;
}

export function FormSteps({ steps, currentStep }: FormStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className={cn("flex-1", index !== steps.length - 1 && "pr-4 sm:pr-8")}>
            <div className="flex items-center">
              <div
                className={cn(
                  "step-indicator",
                  currentStep > step.id ? "completed" : currentStep === step.id ? "active" : "inactive"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={cn(
                  "text-sm font-medium",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index !== steps.length - 1 && (
                <div className="hidden sm:block flex-1 ml-4">
                  <div className={cn(
                    "h-0.5 rounded-full transition-colors",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
