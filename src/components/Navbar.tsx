
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pool-accent to-pool-primary rounded-full blur opacity-50"></div>
              <div className="relative bg-white rounded-full p-1">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="#0891b2" strokeWidth="2" />
                  <path d="M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-pool-primary to-pool-accent bg-clip-text text-transparent">PoolPass</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/pools" className="text-gray-600 hover:text-pool-primary transition-colors">
              Find Pools
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-pool-primary transition-colors">
              How It Works
            </Link>
            <Link to="/host" className="text-gray-600 hover:text-pool-primary transition-colors">
              Become a Host
            </Link>
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-pool-primary">
              Sign In
            </Button>
            <Button className="bg-pool-primary hover:bg-pool-secondary text-white">
              Sign Up
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            type="button" 
            className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
          <div className="pt-2 pb-4 space-y-1">
            <Link to="/pools" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              Find Pools
            </Link>
            <Link to="/how-it-works" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              How It Works
            </Link>
            <Link to="/host" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              Become a Host
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
              <Button className="w-full justify-center bg-pool-primary hover:bg-pool-secondary">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
