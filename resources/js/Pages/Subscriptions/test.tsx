import React from 'react';

const SelectPlan: React.FC = () => {



 
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="border-b px-8 py-4 ">
            <div className="w-full items-center justify-center flex mb-4">
                <img
                  src="/images/logo.svg"
                  alt="Business Setup"
                  className="w-60 h-20 "
                />
              </div>
              <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Create Your Business</h2>
              <p className="text-black">Set up your business profile to get started</p>
              </div>
  
             
            </div>
        
            </div>
        </main>
        </div>
    );
};

export default SelectPlan;
