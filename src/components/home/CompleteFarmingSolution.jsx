import React from 'react';
import {
  Leaf,
  LineChart,
  FileText,
  UserCog,
  ShoppingCart,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: <Leaf size={24} />,
    title: 'Professional Land Analysis',
    description: [
      'Comprehensive soil testing',
      'Environmental condition analysis',
      'Professional field supervisor visits',
      'Detailed digital reports',
    ],
  },
  {
    icon: <LineChart size={24} />,
    title: 'Smart Crop Recommendation',
    description: [
      'Data-driven crop selection',
      'Yield predictions',
      'Market price analysis',
      'Seasonal planning',
    ],
  },
  {
    icon: <FileText size={24} />,
    title: 'Profit Optimization',
    description: [
      'Automated profit calculations',
      'Transparent cost breakdown',
      'Digital agreements',
      'Regular financial reports',
    ],
  },
  {
    icon: <UserCog size={24} />,
    title: 'Expert Management',
    description: [
      'Dedicated field supervisors',
      'Operational management',
      'Quality assurance',
      'Regular progress updates',
    ],
  },
  {
    icon: <ShoppingCart size={24} />,
    title: 'Organic Marketplace',
    description: [
      'Bulk product listings',
      'Verified buyer network',
      'Competitive pricing',
      'Secure transactions',
    ],
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Secure & Transparent',
    description: [
      'Digital contract management',
      'Secure payment gateway',
      'Real-time tracking',
      'Data protection',
    ],
  },
];

const CompleteFarmingSolution = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 mt-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Farming Solution</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          From land analysis to harvest sales, we provide everything you need for successful organic farming
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white transition hover:shadow-lg hover:-translate-y-1 duration-200"
          >
            <div className="mb-4 flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
              {item.icon}
            </div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">{item.title}</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              {item.description.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompleteFarmingSolution;
