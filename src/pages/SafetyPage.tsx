
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const SafetyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pool-dark to-pool-primary mt-16 md:mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Safety First at PoolPass</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Our commitment to your safety and well-being during your swimming experience
          </p>
        </div>
      </section>
      
      {/* Safety Standards Section */}
      <section className="bg-white section-padding py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Safety Standards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All pools listed on our platform adhere to strict safety standards to ensure peace of mind for all guests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pool-primary">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a1.98 1.98 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
                  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.07 0L2 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Regular Inspections</h3>
              <p className="text-gray-500">All pools undergo regular safety inspections to ensure water quality and facility safety.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pool-primary">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 1 0-16 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Staff</h3>
              <p className="text-gray-500">Many of our pools are staffed with certified lifeguards and trained personnel during operating hours.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-pool-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pool-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Insurance Coverage</h3>
              <p className="text-gray-500">All bookings include basic liability insurance coverage for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Safety Guidelines Section */}
      <section className="bg-gray-50 section-padding py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Pool Safety Guidelines</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 bg-pool-light rounded-full flex items-center justify-center mr-3 text-pool-primary">1</span>
                Never Swim Alone
              </h3>
              <p className="text-gray-600 pl-11">Always swim with at least one other person present. If children are swimming, ensure constant adult supervision.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 bg-pool-light rounded-full flex items-center justify-center mr-3 text-pool-primary">2</span>
                Know Your Limits
              </h3>
              <p className="text-gray-600 pl-11">Be aware of your swimming abilities and stay within your comfort zone. Don't attempt to swim in deep water if you're not confident.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 bg-pool-light rounded-full flex items-center justify-center mr-3 text-pool-primary">3</span>
                No Running or Diving
              </h3>
              <p className="text-gray-600 pl-11">Don't run around the pool edges. Only dive in designated areas that are clearly marked for diving.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 bg-pool-light rounded-full flex items-center justify-center mr-3 text-pool-primary">4</span>
                Follow Pool Rules
              </h3>
              <p className="text-gray-600 pl-11">Each pool will have its own specific safety guidelines. Please read and follow them carefully.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="w-8 h-8 bg-pool-light rounded-full flex items-center justify-center mr-3 text-pool-primary">5</span>
                Emergency Plan
              </h3>
              <p className="text-gray-600 pl-11">Familiarize yourself with emergency equipment and procedures at each pool you visit.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Enjoy a Safe Swimming Experience?</h2>
          <Link to="/pools">
            <Button className="bg-pool-primary hover:bg-pool-secondary text-white px-8">
              Browse Pools
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SafetyPage;
