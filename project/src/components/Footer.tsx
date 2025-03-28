import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ATHLETIX</h3>
            <p className="text-gray-400">
              Premium sportswear and athletic equipment for champions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=jerseys" className="text-gray-400 hover:text-white">
                  Jerseys
                </Link>
              </li>
              <li>
                <Link to="/products?category=shoes" className="text-gray-400 hover:text-white">
                  Shoes
                </Link>
              </li>
              <li>
                <Link to="/products?category=equipment" className="text-gray-400 hover:text-white">
                  Equipment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} ATHLETIX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;