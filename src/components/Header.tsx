import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ onCartClick, searchQuery, onSearchChange }: HeaderProps) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-2xl font-bold">JS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Jersey Store</h1>
              <p className="text-xs text-slate-300">Premium Sports Apparel</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jerseys..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={onCartClick}
            className="relative bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
