import React from "react";
import BuyerSidebar from "../../components/buyerdashboard/BuyerSidebar";
import AddToCartPageContent from "../../components/cart/AddToCartPageContent";

function BuyerCart() {
  return (
    <div className="flex min-h-screen">
      <BuyerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <AddToCartPageContent />
      </main>
    </div>
  );
}

export default BuyerCart;
