
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(2, 'Please enter your city or area'),
  useFor: z.array(z.string()).min(1, 'Please select at least one option'),
  useForOther: z.string().optional(),
  swimmingFrequency: z.string().min(1, 'Please select how often you swim'),
  likelyToBook: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const GuestWaitlist = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      useFor: [],
      useForOther: '',
      swimmingFrequency: '',
      likelyToBook: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Guest waitlist form data:', data);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const useForOptions = [
    { id: 'solo', label: 'A relaxing solo day' },
    { id: 'date', label: 'A date/day out' },
    { id: 'family', label: 'Family pool time' },
    { id: 'other', label: 'Other' },
  ];

  const frequencyOptions = [
    { value: 'rarely', label: 'Rarely' },
    { value: 'monthly', label: 'Once a month' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'multiple', label: 'Multiple times a week' },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center mt-16">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-pool-dark mb-4">Thanks!</h2>
              <p className="text-gray-600 mb-6">
                We'll let you know when PoolPass launches near you. Early members may get first access or even free passes!
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
                Get Early Access to PoolPass 🏖️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
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
                          <Input placeholder="you@example.com" type="email" {...field} />
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
                        <FormLabel>City or Area</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. South London or Bristol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="useFor"
                    render={() => (
                      <FormItem>
                        <FormLabel>Would you use PoolPass for...</FormLabel>
                        <div className="space-y-3">
                          {useForOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="useFor"
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
                  
                  {form.watch('useFor')?.includes('other') && (
                    <FormField
                      control={form.control}
                      name="useForOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify</FormLabel>
                          <FormControl>
                            <Input placeholder="Tell us more..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="swimmingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How often do you go swimming or to pools?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {frequencyOptions.map((option) => (
                              <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="likelyToBook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What would make you more likely to book a pool for the day? (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. Flexible cancellation, reasonable pricing, good amenities..."
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
                    {isSubmitting ? 'Joining waitlist...' : 'Join the Waitlist 🏊‍♀️'}
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

export default GuestWaitlist;
