import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-black text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl font-bold mb-6">Elevate Your Game</h1>
            <p className="text-xl mb-8">
              Premium sportswear and equipment for athletes who demand excellence.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ y: -10 }}
                className="relative h-96 rounded-lg overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Link
                    to={`/products?category=${category.name.toLowerCase()}`}
                    className="text-white text-2xl font-bold hover:underline"
                  >
                    {category.name}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const categories = [
  {
    name: 'Jerseys',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80',
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
  },
  {
    name: 'Equipment',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80',
  },
];

export default Home;