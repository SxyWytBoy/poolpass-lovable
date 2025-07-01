
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HostOnboarding: React.FC = () => {
  const { waitlistId } = useParams<{ waitlistId: string }>();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!waitlistId) {
    return <Navigate to="/host-dashboard" replace />;
  }

  const handleOnboardingComplete = () => {
    // Redirect to host dashboard or success page
    console.log('Onboarding completed!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <OnboardingWizard 
          waitlistId={waitlistId} 
          onComplete={handleOnboardingComplete}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default HostOnboarding;
