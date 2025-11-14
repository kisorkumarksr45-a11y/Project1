import { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Jersey } from '../types';
import { useCart } from '../context/CartContext';

interface JerseyModalProps {
  jersey: Jersey;
  onClose: () => void;
}

export function JerseyModal({ jersey, onClose }: JerseyModalProps) {
  const [selectedSize, setSelectedSize] = useState(jersey.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(jersey, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-900">Jersey Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={jersey.image_url}
                alt={jersey.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              {jersey.featured && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Featured
                </div>
              )}
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{jersey.name}</h3>
              <p className="text-lg text-slate-600 mb-4">{jersey.team}</p>

              {jersey.player_name && (
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-lg text-slate-700 font-medium">
                    {jersey.player_name}
                  </span>
                  {jersey.player_number && (
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-lg font-bold">
                      #{jersey.player_number}
                    </span>
                  )}
                </div>
              )}

              <p className="text-slate-700 mb-6 leading-relaxed">{jersey.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-emerald-600">
                  ${jersey.price.toFixed(2)}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {jersey.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(jersey.stock, quantity + 1))}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-2">{jersey.stock} available in stock</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={jersey.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-3 ${
                  jersey.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{jersey.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
