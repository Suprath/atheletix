import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';
import { Product, CartItem } from '../types';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showBulkOrder, setShowBulkOrder] = useState(false);
  const [bulkOrders, setBulkOrders] = useState<Array<{ size: string; color: string; jerseyName: string; chestNumber: number }>>([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      if (data) {
        setSelectedSize(data.sizes[0]);
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    if (showBulkOrder && bulkOrders.length > 0) {
      // Handle bulk orders
      bulkOrders.forEach((order) => {
        const cartItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: id!,
          user_id: user.id,
          quantity: 1,
          size: order.size,
          color: order.color,
          jersey_name: order.jerseyName,
          chest_number: order.chestNumber,
        };
        addToCart(cartItem);
      });
      toast.success('Bulk order added to cart');
    } else {
      // Handle single order
      const cartItem: CartItem = {
        id: crypto.randomUUID(),
        product_id: id!,
        user_id: user.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      };
      addToCart(cartItem);
      toast.success('Added to cart');
    }
  };

  const addBulkOrderRow = () => {
    setBulkOrders([...bulkOrders, { size: '', color: '', jerseyName: '', chestNumber: 0 }]);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 2}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md ${
                    selectedSize === size
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-md ${
                    selectedColor === color
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          {!showBulkOrder && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border rounded-md"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Bulk Order */}
          <div className="mb-6">
            <button
              onClick={() => setShowBulkOrder(!showBulkOrder)}
              className="text-blue-600 hover:underline"
            >
              {showBulkOrder ? 'Cancel Bulk Order' : 'Create Bulk Order'}
            </button>
          </div>

          {showBulkOrder && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Bulk Order Details</h3>
              {bulkOrders.map((order, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <select
                    value={order.size}
                    onChange={(e) => {
                      const newOrders = [...bulkOrders];
                      newOrders[index].size = e.target.value;
                      setBulkOrders(newOrders);
                    }}
                    className="border rounded-md p-2"
                  >
                    <option value="">Select Size</option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <select
                    value={order.color}
                    onChange={(e) => {
                      const newOrders = [...bulkOrders];
                      newOrders[index].color = e.target.value;
                      setBulkOrders(newOrders);
                    }}
                    className="border rounded-md p-2"
                  >
                    <option value="">Select Color</option>
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Jersey Name"
                    value={order.jerseyName}
                    onChange={(e) => {
                      const newOrders = [...bulkOrders];
                      newOrders[index].jerseyName = e.target.value;
                      setBulkOrders(newOrders);
                    }}
                    className="border rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Chest Number"
                    value={order.chestNumber || ''}
                    onChange={(e) => {
                      const newOrders = [...bulkOrders];
                      newOrders[index].chestNumber = parseInt(e.target.value);
                      setBulkOrders(newOrders);
                    }}
                    className="border rounded-md p-2"
                  />
                </div>
              ))}
              <button
                onClick={addBulkOrderRow}
                className="text-blue-600 hover:underline"
              >
                + Add Another
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;