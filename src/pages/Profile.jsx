import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user } = useAuth();

  // If user is logged in, redirect them to their appropriate dashboard
  if (user) {
    const dashboardRoutes = {
      'Landowner': '/landownerdashboard',
      'Supervisor': '/fieldsupervisordashboard', 
      'Buyer': '/buyerdashboard',
      'Operational Manager': '/operationalmanagerdashboard',
      'Financial Manager': '/financialmanagerdashboard'
    };

    const redirectTo = dashboardRoutes[user.role];
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Fallback profile page (should rarely be reached)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="ml-2">{user.first_name} {user.last_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div>
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="ml-2">{user.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Role:</span>
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const dashboardRoutes = {
                        'Landowner': '/landownerdashboard',
                        'Supervisor': '/fieldsupervisordashboard',
                        'Buyer': '/buyerdashboard',
                        'Operational Manager': '/operationalmanagerdashboard',
                        'Financial Manager': '/financialmanagerdashboard'
                      };
                      const dashboardPath = dashboardRoutes[user.role];
                      if (dashboardPath) {
                        window.location.href = dashboardPath;
                      }
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}