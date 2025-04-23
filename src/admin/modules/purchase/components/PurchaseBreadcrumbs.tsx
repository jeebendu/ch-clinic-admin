
import React from "react";
import { Home, ArrowRight } from "lucide-react";

const PurchaseBreadcrumbs = () => (
  <nav className="flex items-center text-gray-500 text-sm py-2 px-2 bg-[#f5f7fb] rounded-t-lg">
    <span className="font-semibold text-lg text-[#362E5C] mr-6">Purchase Order</span>
    <Home className="w-4 h-4 text-[#8E9196]" />
    <ArrowRight className="w-4 h-4 mx-1 text-[#8E9196]" />
    <span>Home</span>
    <ArrowRight className="w-4 h-4 mx-1 text-[#8E9196]" />
    <span>Purchase</span>
    <ArrowRight className="w-4 h-4 mx-1 text-[#8E9196]" />
    <span>Order</span>
    <ArrowRight className="w-4 h-4 mx-1 text-[#8E9196]" />
    <span className="text-[#0EA5E9]">Items</span>
  </nav>
);

export default PurchaseBreadcrumbs;
