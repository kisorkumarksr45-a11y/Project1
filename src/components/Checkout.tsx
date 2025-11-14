import { useState } from 'react';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { OrderData } from '../types';

interface CheckoutProps {
  onClose: () => void;
}

export function Checkout({ onClose }: CheckoutProps) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState<OrderData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: formData.shipping_address,
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        jersey_id: item.jersey.id,
        quantity: item.quantity,
        size: item.size,
        price: item.jersey.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-slideUp">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Order Placed!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for your order. We'll send a confirmation email to{' '}
            <span className="font-semibold">{formData.customer_email}</span>
          </p>
          <button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.jersey.id}-${item.size}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-slate-700">
                    {item.jersey.name} ({item.size}) x {item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ${(item.jersey.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-emerald-600 text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) =>
                  setFormData({ ...formData, customer_phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Shipping Address *
              </label>
              <textarea
                required
                value={formData.shipping_address}
                onChange={(e) =>
                  setFormData({ ...formData, shipping_address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="123 Main St, Apt 4B&#10;New York, NY 10001"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                isSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
