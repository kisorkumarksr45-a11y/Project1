import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { JerseyCard } from './components/JerseyCard';
import { JerseyModal } from './components/JerseyModal';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { supabase } from './lib/supabase';
import type { Jersey, Category } from './types';

function App() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jerseyData, categoryData] = await Promise.all([
        supabase.from('jerseys').select('*').order('featured', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (jerseyData.data) setJerseys(jerseyData.data);
      if (categoryData.data) setCategories(categoryData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJerseys = jerseys.filter((jersey) => {
    const matchesCategory = !selectedCategory || jersey.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      jersey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jersey.player_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredJerseys = jerseys.filter((j) => j.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        onCartClick={() => setShowCart(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!searchQuery && !selectedCategory && featuredJerseys.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white mb-8 shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Sports Jerseys
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-2">
                Authentic quality. Unbeatable prices.
              </p>
              <p className="text-lg opacity-80">
                Shop our collection of professional sports jerseys
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Featured Jerseys</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredJerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  onAddToCart={setSelectedJersey}
                />
              ))}
            </div>
          </section>
        )}

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 mt-4">Loading jerseys...</p>
          </div>
        ) : filteredJerseys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-slate-600">No jerseys found</p>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedCategory || searchQuery ? 'Results' : 'All Jerseys'}
              </h2>
              <span className="text-slate-600">
                {filteredJerseys.length} {filteredJerseys.length === 1 ? 'jersey' : 'jerseys'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredJerseys.map((jersey) => (
                <JerseyCard
                  key={jersey.id}
                  jersey={jersey}
                  onAddToCart={setSelectedJersey}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {selectedJersey && (
        <JerseyModal jersey={selectedJersey} onClose={() => setSelectedJersey(null)} />
      )}

      {showCart && (
        <Cart
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
        />
      )}

      {showCheckout && (
        <Checkout
          onClose={() => {
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
