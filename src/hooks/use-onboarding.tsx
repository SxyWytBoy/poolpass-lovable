
import { useState, useEffect } from 'react';
import { OnboardingService, OnboardingStep, HostApplication } from '@/services/onboarding-service';

export const useOnboarding = (waitlistId?: string) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [application, setApplication] = useState<HostApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOnboardingProgress = async () => {
    if (!waitlistId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const progressData = await OnboardingService.getOnboardingProgress(waitlistId);
      setSteps(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load onboarding progress');
    } finally {
      setIsLoading(false);
    }
  };

  const completeStep = async (stepId: string, stepData?: any) => {
    try {
      await OnboardingService.completeOnboardingStep(stepId, stepData);
      await loadOnboardingProgress(); // Refresh the data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete step');
      return false;
    }
  };

  useEffect(() => {
    if (waitlistId) {
      loadOnboardingProgress();
    }
  }, [waitlistId]);

  const currentStep = steps.find(step => !step.is_completed);
  const completedSteps = steps.filter(step => step.is_completed).length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const isComplete = completedSteps === totalSteps && totalSteps > 0;

  return {
    steps,
    application,
    currentStep,
    completedSteps,
    totalSteps,
    progressPercentage,
    isComplete,
    isLoading,
    error,
    loadOnboardingProgress,
    completeStep
  };
};
