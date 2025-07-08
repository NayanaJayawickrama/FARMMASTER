import React from 'react';

const steps = [
  {
    number: 1,
    title: 'Request Land Report',
    description: 'Submit your land details and make secure online payment for professional analysis',
  },
  {
    number: 2,
    title: 'Professional Assessment',
    description: 'Certified field supervisors visit your land and conduct comprehensive soil analysis',
  },
  {
    number: 3,
    title: 'Get Recommendations',
    description: 'Receive detailed crop recommendations and profit projections based on your land',
  },
  {
    number: 4,
    title: 'Start Earning',
    description: 'Sign digital agreements and start earning from your land through organic cultivation',
  },
];

const HowFarmMasterWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How Farm Master Works</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Simple steps to transform your land into a profitable organic farm
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-lg">
              {step.number}
            </div>
            <h3 className="font-semibold text-base">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowFarmMasterWorks;
