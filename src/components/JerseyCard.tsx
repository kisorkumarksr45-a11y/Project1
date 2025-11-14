import { ShoppingCart, Star } from 'lucide-react';
import type { Jersey } from '../types';

interface JerseyCardProps {
  jersey: Jersey;
  onAddToCart: (jersey: Jersey) => void;
}

export function JerseyCard({ jersey, onAddToCart }: JerseyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden h-64">
        <img
          src={jersey.image_url}
          alt={jersey.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {jersey.featured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
        {jersey.stock < 10 && jersey.stock > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Only {jersey.stock} left!
          </div>
        )}
        {jersey.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-xl font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{jersey.name}</h3>
          <p className="text-sm text-slate-600">{jersey.team}</p>
        </div>

        {jersey.player_name && (
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-slate-700 font-medium">{jersey.player_name}</span>
            {jersey.player_number && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-sm font-semibold">
                #{jersey.player_number}
              </span>
            )}
          </div>
        )}

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{jersey.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            ${jersey.price.toFixed(2)}
          </span>
          <div className="flex flex-wrap gap-1">
            {jersey.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(jersey)}
          disabled={jersey.stock === 0}
          className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            jersey.stock === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{jersey.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
