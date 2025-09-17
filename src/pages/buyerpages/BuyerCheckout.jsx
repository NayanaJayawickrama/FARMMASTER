import React from "react";
import BuyerSidebar from "../../components/buyerdashboard/BuyerSidebar";
import CheckoutPage from "../../components/cart/CheckoutPage";

function BuyerCheckout() {
  return (
    <div className="flex min-h-screen">
      <BuyerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <CheckoutPage />
      </main>
    </div>
  );
}

export default BuyerCheckout;
