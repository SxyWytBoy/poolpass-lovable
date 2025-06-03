
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(2, 'Location is required'),
  poolType: z.array(z.string()).min(1, 'Please select at least one pool type'),
  currentUse: z.array(z.string()).min(1, 'Please select at least one option'),
  interestLevel: z.array(z.string()).min(1, 'Please select your interest level'),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const HostWaitlist = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      contactName: '',
      email: '',
      location: '',
      poolType: [],
      currentUse: [],
      interestLevel: [],
      additionalInfo: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Host waitlist form data:', data);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const poolTypeOptions = [
    { id: 'indoor', label: 'Indoor' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'heated', label: 'Heated' },
    { id: 'private', label: 'Private-use only' },
  ];

  const currentUseOptions = [
    { id: 'guests-only', label: 'Guests only' },
    { id: 'events', label: 'Available for events' },
    { id: 'unused', label: 'Unused / not at full capacity' },
  ];

  const interestLevelOptions = [
    { id: 'curious', label: 'Just curious' },
    { id: 'interested', label: 'Interested in learning more' },
    { id: 'ready', label: 'Ready to be listed' },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center mt-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="text-6xl mb-4">🏨</div>
              <h2 className="text-2xl font-bold text-pool-dark mb-4">Thanks for registering interest!</h2>
              <p className="text-gray-600 mb-6">
                We'll be in touch to chat about how PoolPass can work with your venue.
              </p>
              <Link to="/waitlist">
                <Button className="bg-pool-primary hover:bg-pool-secondary">
                  Back to Landing Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-pool-dark">
                Add Your Pool to PoolPass (Free to Join)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel / Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your hotel or business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@yourbusiness.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (city/town)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. London, Manchester, Bristol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="poolType"
                    render={() => (
                      <FormItem>
                        <FormLabel>Type of Pool</FormLabel>
                        <div className="space-y-3">
                          {poolTypeOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="poolType"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentUse"
                    render={() => (
                      <FormItem>
                        <FormLabel>Current Use</FormLabel>
                        <div className="space-y-3">
                          {currentUseOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="currentUse"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interestLevel"
                    render={() => (
                      <FormItem>
                        <FormLabel>Interest level</FormLabel>
                        <div className="space-y-3">
                          {interestLevelOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interestLevel"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anything else you'd like to add? (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us more about your pool, availability, or any questions you have..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-pool-primary hover:bg-pool-secondary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Register Interest 🏨'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HostWaitlist;
