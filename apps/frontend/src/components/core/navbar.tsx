"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { authApi } from "@/lib/api-client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, dispatch } = useCart()

  // Handle logout
  const { isLoggedIn, logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();


  const handleLogout = async () => {
    try {
      // Tell backend to clear cookies
      await authApi.logout(); 
      
      // Clear local data
      logout();
      setShowDropdown(false);
      
      // Redirect
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Get dynamic store name
  const storeName = "ShopStack";

  const isAdmin = user?.role === "admin"

  // Function to scroll to categories section
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categories-section")
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false) // Close mobile menu if open
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - now uses dynamic store name */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
              {storeName}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-black hover:text-black/70 font-medium transition-colors">
              Home
            </a>
            <a href="/products" className="text-black hover:text-black/70 font-medium transition-colors">
              Products
            </a>
            {/* Updated Categories link to scroll to section */}
            <button
              onClick={scrollToCategories}
              className="text-black hover:text-black/70 font-medium transition-colors"
            >
              Categories
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-black"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
              <ShoppingCart className="w-5 h-5" />
              {state.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {state.itemCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                {/* IF LOGGED OUT: Show these */}
                {!isLoggedIn && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sign-up">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {/* IF LOGGED IN: Show these */}
                {isLoggedIn && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {/* ✅ ADMIN ONLY */}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 cursor-pointer" 
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="search" placeholder="Search products..." className="pl-10 pr-4 py-2 w-full" />
              </div>
              <a
                href="/"
                className="text-black hover:text-black/70 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/products"
                className="text-black hover:text-black/70 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </a>
              {/* Updated mobile Categories link */}
              <button
                onClick={scrollToCategories}
                className="text-black hover:text-black/70 font-medium py-2 text-left"
              >
                Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
