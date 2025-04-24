
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, StarOff, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accountant } from "@/types";

// Sample data for accountants
const accountantsData: Accountant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    description: "Certified public accountant with expertise in personal finance management and tax optimization for individuals.",
    specialties: ["Personal Taxes", "Financial Planning", "Expense Management"],
    experience: 8,
    hourlyRate: 75,
    contactEmail: "sarah.j@accountingpros.com",
    contactPhone: "(555) 123-4567",
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "2",
    name: "David Martinez",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Specialized in small business accounting and personal financial planning with a focus on budget optimization.",
    specialties: ["Budget Planning", "Wealth Management", "Investment Advisory"],
    experience: 12,
    hourlyRate: 95,
    contactEmail: "dmartinez@financeexperts.com",
    contactPhone: "(555) 987-6543",
    rating: 4.5,
    reviewCount: 98
  },
  {
    id: "3",
    name: "Lisa Chen",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Expert in personal taxation and retirement planning with a client-focused approach to financial management.",
    specialties: ["Retirement Planning", "Tax Strategy", "Estate Planning"],
    experience: 15,
    hourlyRate: 110,
    contactEmail: "lisa.chen@taxprofs.com",
    contactPhone: "(555) 456-7890",
    rating: 4.9,
    reviewCount: 215
  },
  {
    id: "4",
    name: "Michael Robinson",
    photo: "https://randomuser.me/api/portraits/men/92.jpg",
    description: "Experienced accountant providing personalized financial advice and expense tracking solutions for individuals.",
    specialties: ["Expense Tracking", "Debt Management", "Financial Coaching"],
    experience: 6,
    hourlyRate: 65,
    contactEmail: "mrobinson@financecoach.com",
    contactPhone: "(555) 789-0123",
    rating: 4.2,
    reviewCount: 56
  }
];

// Helper function to render star ratings
const renderRating = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className="fill-expense-yellow text-expense-yellow h-4 w-4" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarHalf key={i} className="fill-expense-yellow text-expense-yellow h-4 w-4" />);
    } else {
      stars.push(<StarOff key={i} className="text-gray-300 h-4 w-4" />);
    }
  }
  
  return stars;
};

export default function AccountantsPage() {
  const [accountants, setAccountants] = useState<Accountant[]>(accountantsData);
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Accountants</h1>
          <p className="text-muted-foreground mt-1">
            Find professional financial help to manage your expenses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountants.map((accountant) => (
            <Card key={accountant.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start space-x-4">
                  <img 
                    src={accountant.photo} 
                    alt={accountant.name} 
                    className="rounded-full h-14 w-14 object-cover" 
                  />
                  <div>
                    <CardTitle className="text-xl">{accountant.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderRating(accountant.rating)}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({accountant.rating}) {accountant.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{accountant.description}</p>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-2">
                    {accountant.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Experience:</span> {accountant.experience} years
                  </div>
                  <div>
                    <span className="font-medium">Rate:</span> ${accountant.hourlyRate}/hr
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col items-stretch space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-muted-foreground">{accountant.contactEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-muted-foreground">{accountant.contactPhone}</span>
                  </div>
                </div>
                <Button variant="default" className="w-full">Contact</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
