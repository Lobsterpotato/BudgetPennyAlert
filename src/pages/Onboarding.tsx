import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Onboarding() {
  const navigate = useNavigate();

  const features = [
    "Add and track expenses",
    "Manage budgets",
    "Generate financial reports",
    "Receive alerts",
    "Hire financial consultants when needed"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to Pennywise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive financial management solution
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We Offer
          </h2>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Get Started
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="px-8 py-3"
          >
            I already have an account
          </Button>
        </div>
      </Card>
    </div>
  );
} 