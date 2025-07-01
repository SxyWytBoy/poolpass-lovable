
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Check, X, Clock, Building2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { OnboardingService } from '@/services/onboarding-service';

interface PendingApplication {
  waitlist_id: string;
  business_name: string;
  contact_name: string;
  email: string;
  location: string;
  pool_type: string[];
  current_use: string[];
  interest_level: string[];
  crm_provider: string | null;
  created_at: string;
  onboarding_status: string;
}

const HostApplicationsAdmin: React.FC = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<PendingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PendingApplication | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadPendingApplications();
  }, []);

  const loadPendingApplications = async () => {
    try {
      const data = await OnboardingService.getPendingApplications();
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load pending applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (application: PendingApplication) => {
    try {
      // For now, we'll need to create a user account or link to existing one
      // In a real implementation, this would involve user authentication flow
      await OnboardingService.approveHostApplication(application.waitlist_id, 'temp-user-id');
      
      toast({
        title: "Application approved!",
        description: `${application.business_name} has been approved and can start onboarding.`,
      });
      
      // Refresh the list
      loadPendingApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    try {
      await OnboardingService.rejectHostApplication(selectedApplication.waitlist_id, rejectionReason);
      
      toast({
        title: "Application rejected",
        description: `${selectedApplication.business_name} has been rejected.`,
      });
      
      setShowRejectDialog(false);
      setSelectedApplication(null);
      setRejectionReason('');
      loadPendingApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Host Applications</h2>
          <p className="text-muted-foreground">
            Review and approve new host applications
          </p>
        </div>
        <Badge variant="secondary">
          {applications.length} pending
        </Badge>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending applications</h3>
              <p className="text-muted-foreground">
                All host applications have been reviewed
              </p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.waitlist_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {application.business_name}
                      <Badge className={getStatusColor(application.onboarding_status)}>
                        {application.onboarding_status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {application.contact_name} • {application.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Email: {application.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {application.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Pool Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Type: {application.pool_type.join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Current Use: {application.current_use.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Interest Level</h4>
                  <div className="flex gap-2">
                    {application.interest_level.map((level) => (
                      <Badge key={level} variant="outline">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {application.crm_provider && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">CRM Provider</h4>
                    <Badge variant="secondary">{application.crm_provider}</Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedApplication(application)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleApprove(application)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowRejectDialog(true);
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedApplication?.business_name}'s application.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostApplicationsAdmin;
