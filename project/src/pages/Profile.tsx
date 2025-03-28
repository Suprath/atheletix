import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Order } from '../types';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              images
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {user?.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <p
                        className={`text-sm ${
                          order.status === 'delivered'
                            ? 'text-green-500'
                            : 'text-blue-500'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          {item.jersey_name && (
                            <p className="text-sm text-gray-500">
                              Jersey: {item.jersey_name} #{item.chest_number}
                            </p>
                          )}
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-medium">
                            ${item.price_at_time * item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-sm text-gray-500">
                      {order.shipping_address.full_name}
                      <br />
                      {order.shipping_address.address_line1}
                      {order.shipping_address.address_line2 && (
                        <>
                          <br />
                          {order.shipping_address.address_line2}
                        </>
                      )}
                      <br />
                      {order.shipping_address.city}, {order.shipping_address.state}{' '}
                      {order.shipping_address.postal_code}
                      <br />
                      {order.shipping_address.country}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;