import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      query = query
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-600 hover:text-black"
        >
          {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          <span className="ml-2">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        {showFilters && (
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {['Jerseys', 'Shoes', 'Equipment'].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.toLowerCase()}
                      checked={selectedCategory === category.toLowerCase()}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {loading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">No products found</div>
          ) : (
            products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;