import React from "react";

const ContactPageBody = () => {
  return (
    <main className="bg-white text-black min-h-screen flex flex-col items-center justify-start px-4 pt-20">
      <div className="w-full max-w-xl">
        <h1 className="text-5xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center text-green-600 mb-10">
          We're here to help! Reach out to us with any questions or inquiries you may have.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Your Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Subject</label>
            <input
              type="text"
              placeholder="Enter the subject"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter your message"
              rows="5"
              className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition"
            >
              Send Message
            </button>
          </div>
        </form>

        <footer className="text-center text-sm text-gray-500 mt-12">
          © 2025 Farm Master. All rights reserved.
        </footer>
      </div>
    </main>
  );
};

export default ContactPageBody;
