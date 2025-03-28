import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const { user, cart, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          shipping_address: shippingAddress,
          total: calculateTotal(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        jersey_name: item.jersey_name,
        chest_number: item.chest_number,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and redirect to success page
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * (item.price || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={shippingAddress.full_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_line1"
                  required
                  value={shippingAddress.address_line1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={shippingAddress.address_line2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  required
                  value={shippingAddress.postal_code}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.product_id}
                    </span>
                    <span>${(item.quantity * (item.price || 0)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Checkout;