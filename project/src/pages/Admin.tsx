import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Product, Order, User } from '../types';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Package,
  Users,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [orders, products, users] = await Promise.all([
        supabase.from('orders').select('total'),
        supabase.from('products').select('count'),
        supabase.from('users').select('count'),
      ]);

      setStats({
        totalSales: orders.data?.reduce((sum, order) => sum + order.total, 0) || 0,
        totalOrders: orders.data?.length || 0,
        totalProducts: products.count || 0,
        totalUsers: users.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Total Sales</h3>
            <BarChart3 className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">${stats.totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Total Orders</h3>
            <Package className="text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Products</h3>
            <Package className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Users</h3>
            <Users className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

// Products Management Component
const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('Product created successfully');
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        images: [],
        sizes: [],
        colors: [],
        stock: '',
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={() => setEditingProduct(null)}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stock: e.target.value }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="jerseys">Jerseys</option>
                <option value="shoes">Shoes</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images (URLs, one per line)
              </label>
              <textarea
                value={formData.images.join('\n')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    images: e.target.value.split('\n').filter(Boolean),
                  }))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes.join(',')}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sizes: e.target.value.split(',').map((s) => s.trim()),
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.colors.join(',')}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      colors: e.target.value.split(',').map((s) => s.trim()),
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Product List</h3>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      ${product.price} | Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Orders Management Component
const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:users (email, full_name),
          order_items (
            *,
            product:products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Customer: {order.user.full_name} ({order.user.email})
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="mt-2 border-gray-300 rounded-md shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>${item.price_at_time * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p className="text-sm">
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
          </div>
        ))}
      </div>
    </div>
  );
};

// Users Management Component
const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user role');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {user.full_name?.[0] || user.email[0]}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateUserRole(user.id, e.target.value as 'user' | 'admin')
                    }
                    className="border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Admin Component
const Admin = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64">
          <nav className="space-y-1">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Dashboard
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Package className="h-5 w-5 mr-2" />
              Products
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Package className="h-5 w-5 mr-2" />
              Orders
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Users className="h-5 w-5 mr-2" />
              Users
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;