import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ShoppingBag, User, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, cart } = useStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">ATHLETIX</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-black">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-black">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 hover:text-black relative">
              <ShoppingBag className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link to="/profile" className="text-gray-700 hover:text-black">
                <User className="h-6 w-6" />
              </Link>
            ) : (
              <Link to="/signin" className="text-gray-700 hover:text-black">
                Sign In
              </Link>
            )}
            
            <button className="sm:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;