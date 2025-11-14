import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ onClose, onCheckout }: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">Your cart is empty</p>
              <p className="text-slate-500">Add some jerseys to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.jersey.id}-${item.size}`}
                  className="bg-slate-50 rounded-xl p-4 flex gap-4 hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={item.jersey.image_url}
                    alt={item.jersey.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{item.jersey.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{item.jersey.team}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-slate-700 font-medium">Size: {item.size}</span>
                    </div>
                    <p className="font-bold text-emerald-600">
                      ${item.jersey.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => removeFromCart(item.jersey.id, item.size)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-2 bg-white rounded-lg px-2 py-1 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.jersey.id, item.size, item.quantity - 1)
                        }
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.jersey.id, item.size, item.quantity + 1)
                        }
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-3xl font-bold text-emerald-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
