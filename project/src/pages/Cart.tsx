import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, user } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = React.useState<Record<string, Product>>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (cart.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const productIds = [...new Set(cart.map((item) => item.product_id))];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (error) throw error;

      const productsMap = (data || []).reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<string, Product>);

      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products[item.product_id];
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/signin');
      return;
    }
    navigate('/checkout');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => {
            const product = products[item.product_id];
            if (!product) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 border-b py-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  {item.jersey_name && (
                    <p className="text-gray-600">
                      Jersey Name: {item.jersey_name} | Number: {item.chest_number}
                    </p>
                  )}
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-semibold">${product.price * item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;