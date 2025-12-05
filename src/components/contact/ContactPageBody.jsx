import React, { useState } from "react";

const ContactPageBody = () => {
  const accessKey = import.meta.env.VITE_ACCESS_KEY;

  const [status, setStatus] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    const formData = new FormData(event.target);
    formData.append("access_key", accessKey);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        setStatus("Message sent successfully!");
        setError(false);
        event.target.reset(); 
      } else {
        setStatus("Failed to send message. Please try again.");
        setError(true);
      }
    } catch (err) {
      setStatus("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="bg-gradient-to-br from-green-50 via-white to-blue-50 text-black min-h-screen flex flex-col items-center justify-start px-4 pt-20 font-poppins relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-green-300 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header with enhanced styling */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-800 drop-shadow-sm">Contact Us</h1>
          <p className="text-center text-green-600 mb-6 text-lg">
            We're here to help! Reach out to us with any questions or inquiries you may have.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full mb-6"></div>
        </div>

        {/* Form with card styling */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-opacity-95">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Send us a Message</h2>
            <p className="text-gray-600 text-sm">Fill out the form below and we'll get back to you soon</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Your Name</label>
              <input
                type="text"
                name="name" 
                placeholder="Enter your name"
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Your Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Subject</label>
              <input
                type="text"
                name="subject" 
                placeholder="Enter the subject"
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Description</label>
              <textarea
                name="message" 
                placeholder="Enter your message"
                rows="5"
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 hover:border-gray-300 bg-gradient-to-r from-white to-gray-50"
              ></textarea>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-full transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

            {status && (
              <div
                className={`text-center mt-6 p-4 rounded-lg backdrop-blur-sm ${
                  !error 
                    ? "text-green-700 bg-green-100 border-2 border-green-200 bg-opacity-80" 
                    : "text-red-700 bg-red-100 border-2 border-red-200 bg-opacity-80"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {!error ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  )}
                  <span className="font-semibold">{status}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Contact info cards with enhanced backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition duration-300 hover:scale-105 border border-green-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Visit Us</h3>
            <p className="text-xs text-gray-600">Badulla, Sri Lanka</p>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition duration-300 hover:scale-105 border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Call Us</h3>
            <p className="text-xs text-gray-600">+94 11 123 4567<br/>+94 77 123 4567</p>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition duration-300 hover:scale-105 border border-purple-100">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Email Us</h3>
            <p className="text-xs text-gray-600">info@farmmaster.lk<br/>support@farmmaster.lk</p>
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 mt-12 py-6 border-t border-gray-200 bg-white bg-opacity-50 rounded-lg backdrop-blur-sm">
          <p className="font-medium">© 2025 Farm Master. All rights reserved.</p>
          <p className="mt-1 text-xs">Connecting farmers, landowners, and buyers for sustainable agriculture</p>
        </footer>
      </div>
    </main>
  );
};

export default ContactPageBody;
