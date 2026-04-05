"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-black mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here is an overview of your store's performance.</p>
      </div>

      {/* Bento Grid Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", val: "$45,231.89", desc: "+20.1% from last month", icon: DollarSign },
          { title: "Orders", val: "+2350", desc: "+180.1% from last month", icon: ShoppingCart },
          { title: "Customers", val: "+12,234", desc: "+19% from last month", icon: Users },
          { title: "Active Products", val: "573", desc: "12 out of stock", icon: Package },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-3xl font-bold text-black">{stat.val}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Recent Orders</h2>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white transition-colors text-sm">
              View All
            </Button>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              { id: "#ORD-7432", customer: "Marcus Vance", total: "$124.00", status: "Paid" },
              { id: "#ORD-7431", customer: "Jade Redman", total: "$56.00", status: "Pending" },
              { id: "#ORD-7430", customer: "Samira Hadid", total: "$320.50", status: "Paid" },
              { id: "#ORD-7429", customer: "Toby Marsh", total: "$12.00", status: "Failed" },
            ].map((order) => (
              <div key={order.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-black">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">{order.total}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 border border-black ${
                      order.status === 'Paid' ? 'bg-black text-white' : 'text-black bg-transparent'
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Top Products</h2>
          </div>
          <div className="space-y-4">
            {[
              { name: "Premium Hoodie", sales: 124, revenue: "$7,440" },
              { name: "Minimalist T-Shirt", sales: 98, revenue: "$2,940" },
              { name: "Tech Cap", sales: 45, revenue: "$1,125" },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-black">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <div className="text-right font-bold text-black">
                  {product.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}