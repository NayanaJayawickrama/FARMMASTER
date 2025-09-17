import React from "react";

const AboutDetails = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 py-12 space-y-10">
      {/* Who We Are */}
      <div>
        <h2 className="text-green-600 text-xl md:text-2xl font-bold mb-2">
          Who We Are?
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
          Farm Master is a web-based organic farming management system designed to transform
          agriculture in Sri Lanka. Our mission is to empower landowners and promote sustainable
          organic farming through smart, digital solutions. We are a team of tech innovators and
          agriculture specialists committed to connecting underutilized land with the rising demand
          for organic produce helping communities grow, naturally and profitably.
        </p>
      </div>

      {/* What We Do */}
      <div>
        <h2 className="text-green-600 text-xl md:text-2xl font-bold mb-4">
          What We Do?
        </h2>
        <ul className="space-y-4 text-gray-700 text-base md:text-lg text-justify">
          <li>
            <strong>• Soil & Land Analysis</strong><br />
            Landowners can submit their land details and receive expert reports based on scientific
            parameters like pH, nutrients, and organic matter.
          </li>
          <li>
            <strong>• Intelligent Crop Recommendations</strong><br />
            Our system analyzes soil data and recommends the most suitable crops to cultivate,
            ensuring maximum yield and sustainability.
          </li>
          <li>
            <strong>• Digital Proposals & Leasing</strong><br />
            Landowners receive personalized cultivation proposals and can securely enter leasing
            agreements with clear profit-sharing terms.
          </li>
          <li>
            <strong>• Cultivation & Monitoring</strong><br />
            Once agreements are in place, the system manages and tracks the cultivation process,
            costs, and income providing landowners with transparent profit breakdowns.
          </li>
          <li>
            <strong>• Online Organic Marketplace</strong><br />
            After harvesting, organic fresh vegetables are sold through our integrated
            marketplace—allowing buyers to explore, select, and purchase high-quality produce online.
          </li>
        </ul>
      </div>

      {/* Why Choose Us */}
      <div>
        <h2 className="text-green-600 text-xl md:text-2xl font-bold mb-3">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-base md:text-lg space-y-2">
          <li>All-in-One Farming Management Solution</li>
          <li>Secure, Transparent, and Role-Based System</li>
          <li>Data-Driven Farming Decisions</li>
          <li>Supports Sustainability and Local Communities</li>
          <li>User-Friendly Design with Future Scalability</li>
        </ul>
      </div>

      {/* Our Vision */}
      <div>
        <h2 className="text-green-600 text-xl md:text-2xl font-bold mb-2">
          Our Vision
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
          To become Sri Lanka’s leading platform for organic agriculture by combining technology,
          sustainability, and economic empowerment—turning every piece of land into a thriving opportunity.
        </p>
      </div>
    </section>
  );
};

export default AboutDetails;
