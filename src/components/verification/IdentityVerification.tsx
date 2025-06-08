
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

interface IdentityVerificationProps {
  verificationType: 'identity' | 'property' | 'insurance' | 'background';
  title: string;
  description: string;
}

const IdentityVerification = ({ verificationType, title, description }: IdentityVerificationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !files || files.length === 0) return;

    setIsSubmitting(true);

    try {
      // Create verification record
      const { data: verification, error: verificationError } = await supabase
        .from('identity_verifications')
        .insert({
          user_id: user.id,
          verification_type: verificationType,
          document_type: documentType,
          document_number: documentNumber,
          status: 'pending'
        })
        .select()
        .single();

      if (verificationError) throw verificationError;

      // Upload documents (in a real implementation, you'd upload to Supabase Storage)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate file upload - in production, upload to Supabase Storage
        const { error: uploadError } = await supabase
          .from('document_uploads')
          .insert({
            verification_id: verification.id,
            file_name: file.name,
            file_path: `/uploads/${verification.id}/${file.name}`,
            file_type: file.type,
            file_size: file.size
          });

        if (uploadError) throw uploadError;
      }

      setVerificationStatus('pending');
      toast({
        title: "Verification submitted",
        description: "Your documents have been uploaded for review. We'll notify you once verified.",
      });

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "Unable to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Upload className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="property_deed">Property Deed</SelectItem>
                <SelectItem value="insurance_policy">Insurance Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="documentNumber">Document Number</Label>
            <Input
              id="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Enter document number"
            />
          </div>

          <div>
            <Label htmlFor="documents">Upload Documents</Label>
            <Input
              id="documents"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload clear photos or scans of your documents (PNG, JPG, PDF)
            </p>
          </div>

          <Button
            type="submit"
            disabled={!documentType || !documentNumber || !files || files.length === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IdentityVerification;
