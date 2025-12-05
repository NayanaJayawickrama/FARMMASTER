import React from "react";
import BuyerSidebar from "../../components/buyerdashboard/BuyerSidebar";
import Orders from "../../components/buyerdashboard/Orders";

function BuyerOrders() {
  return (
    <div className="flex min-h-screen">
      <BuyerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <Orders />
      </main>
    </div>
  );
}

export default BuyerOrders;
