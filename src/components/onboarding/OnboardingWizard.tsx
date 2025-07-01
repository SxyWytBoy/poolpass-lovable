
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { OnboardingService, OnboardingStep } from '@/services/onboarding-service';
import CrmIntegration from '@/components/crm/CrmIntegration';

interface OnboardingWizardProps {
  waitlistId: string;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ waitlistId, onComplete }) => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOnboardingProgress();
  }, [waitlistId]);

  const loadOnboardingProgress = async () => {
    try {
      const data = await OnboardingService.getOnboardingProgress(waitlistId);
      setSteps(data);
      
      // Find the first incomplete step
      const firstIncomplete = data.findIndex(step => !step.is_completed);
      setCurrentStep(firstIncomplete >= 0 ? firstIncomplete : data.length - 1);
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
      toast({
        title: "Error",
        description: "Failed to load onboarding progress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeStep = async (stepData?: any) => {
    if (currentStep >= steps.length) return;

    try {
      const step = steps[currentStep];
      await OnboardingService.completeOnboardingStep(step.id, stepData);
      
      // Update local state
      const updatedSteps = [...steps];
      updatedSteps[currentStep] = {
        ...step,
        is_completed: true,
        completed_at: new Date().toISOString()
      };
      setSteps(updatedSteps);

      toast({
        title: "Step completed!",
        description: `${getStepTitle(step.step_name)} has been completed.`,
      });

      // Move to next step or complete onboarding
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing step:', error);
      toast({
        title: "Error",
        description: "Failed to complete step",
        variant: "destructive",
      });
    }
  };

  const getStepTitle = (stepName: string) => {
    const titles: { [key: string]: string } = {
      'profile_setup': 'Profile Setup',
      'identity_verification': 'Identity Verification',
      'crm_integration': 'CRM Integration',
      'pool_listing': 'Pool Listing',
      'payment_setup': 'Payment Setup',
      'final_review': 'Final Review'
    };
    return titles[stepName] || stepName;
  };

  const getStepDescription = (stepName: string) => {
    const descriptions: { [key: string]: string } = {
      'profile_setup': 'Complete your host profile with business information',
      'identity_verification': 'Verify your identity for security and trust',
      'crm_integration': 'Connect your hotel management system',
      'pool_listing': 'Create your first pool listing',
      'payment_setup': 'Set up payment processing',
      'final_review': 'Review and finalize your host account'
    };
    return descriptions[stepName] || stepName;
  };

  const renderStepContent = () => {
    if (currentStep >= steps.length) return null;

    const step = steps[currentStep];
    
    switch (step.step_name) {
      case 'profile_setup':
        return (
          <div className="space-y-4">
            <p>Complete your business profile to get started as a host.</p>
            <Button onClick={() => completeStep()}>
              Complete Profile Setup
            </Button>
          </div>
        );
      
      case 'identity_verification':
        return (
          <div className="space-y-4">
            <p>Verify your identity to build trust with guests.</p>
            <Button onClick={() => completeStep()}>
              Start Identity Verification
            </Button>
          </div>
        );
      
      case 'crm_integration':
        return (
          <div className="space-y-4">
            <p>Connect your hotel management system for seamless bookings.</p>
            <CrmIntegration />
            <Button onClick={() => completeStep()}>
              Skip CRM Integration
            </Button>
          </div>
        );
      
      case 'pool_listing':
        return (
          <div className="space-y-4">
            <p>Create your first pool listing to start accepting bookings.</p>
            <Button onClick={() => completeStep()}>
              Create Pool Listing
            </Button>
          </div>
        );
      
      case 'payment_setup':
        return (
          <div className="space-y-4">
            <p>Set up payment processing to receive payments from guests.</p>
            <Button onClick={() => completeStep()}>
              Set Up Payments
            </Button>
          </div>
        );
      
      case 'final_review':
        return (
          <div className="space-y-4">
            <p>Review your setup and activate your host account.</p>
            <Button onClick={() => completeStep()}>
              Activate Host Account
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <p>Complete this step to continue.</p>
            <Button onClick={() => completeStep()}>
              Mark as Complete
            </Button>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const completedSteps = steps.filter(step => step.is_completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Host Onboarding</CardTitle>
        <CardDescription>
          Complete these steps to start hosting on PoolPass
        </CardDescription>
        <Progress value={progressPercentage} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {completedSteps} of {steps.length} steps completed
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps sidebar */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  index === currentStep ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                {step.is_completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-sm">{getStepTitle(step.step_name)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getStepDescription(step.step_name)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current step content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep < steps.length ? getStepTitle(steps[currentStep].step_name) : 'Complete!'}
                </CardTitle>
                <CardDescription>
                  {currentStep < steps.length 
                    ? getStepDescription(steps[currentStep].step_name)
                    : 'All onboarding steps completed!'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingWizard;
