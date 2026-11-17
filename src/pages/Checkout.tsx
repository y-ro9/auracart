import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useOfferStore } from '../stores/useOfferStore';
import { ShieldCheck, Mail, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const isUnlocked = useOfferStore((s) => s.isUnlocked);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderNumber = `AC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 16);

    const orderData = {
      orderNumber,
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      items: items.map((i) => ({
        name: i.name,
        size: i.selectedSize,
        quantity: i.quantity,
        price: isUnlocked ? 299 : i.basePrice,
      })),
      total: getTotal(isUnlocked),
      deliveryDate: deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      paymentMethod: 'COD',
    };

    const itemsText = items
      .map((i) => `• ${i.name} (${i.selectedSize}) × ${i.quantity} = ₹${(isUnlocked ? 299 : i.basePrice) * i.quantity}`)
      .join('\n');

    try {
      // 1️⃣ Backend API call (Telegram ke liye)
      const res = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData }),
      });

      // 2️⃣ EmailJS call (Customer ko mail ke liye)
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: form.email, // 👈 Yahan form ki email ja rahi hai
            customer_name: form.name,
            order_number: orderNumber,
            delivery_date: orderData.deliveryDate,
            items_text: itemsText,
            total: getTotal(isUnlocked),
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            phone: form.phone,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log("✅ EmailJS: Email sent successfully!");
      } catch (emailErr) {
        console.error("❌ EmailJS failed:", emailErr);
        // Email fail ho toh bhi order place hone do
      }

      if (res.ok) {
        clearCart();
        navigate('/success', { state: { orderData } });
      } else {
        alert('Order failed at Telegram. Please check server logs.');
      }
    } catch {
      alert('Network error. Server offline?');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full p-4 rounded-2xl border-2 border-lilac focus:outline-none focus:border-accent bg-white shadow-sm transition';

  return (
    <div className="min-h-screen bg-pastel-soft py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2">
          <span className="text-gradient">Checkout</span>
        </h1>
        <p className="text-sm sm:text-base text-ink-soft mb-4 sm:mb-8">Cash on Delivery</p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-card space-y-3 sm:space-y-4">
            <h2 className="font-bold text-base sm:text-lg text-ink flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-blush rounded-full flex items-center justify-center text-xs sm:text-sm">1</span>
              Contact Details
            </h2>
            <input type="text" placeholder="Full Name" required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="email" placeholder="Email Address (for confirmation)" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="tel" placeholder="10-Digit Phone" required pattern="[0-9]{10}" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-card space-y-3 sm:space-y-4">
            <h2 className="font-bold text-base sm:text-lg text-ink flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-lilac rounded-full flex items-center justify-center text-xs sm:text-sm">2</span>
              Delivery Address
            </h2>
            <textarea placeholder="Full Address" required className={inputClass} rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input type="text" placeholder="City" required className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input type="text" placeholder="State" required className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <input type="text" placeholder="Pincode" required className={inputClass} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          </div>

          <div className="bg-pastel-hero p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-card border-2 border-white">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-ink text-sm sm:text-base">Total (Pay on Delivery)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-gradient">₹{getTotal(isUnlocked)}</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-soft flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Delivery within 16 days · Safe COD
            </p>
            <p className="text-xs sm:text-sm text-ink-soft flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-blue-600" /> Confirmation email on {form.email || 'your email'}
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 sm:py-4 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : 'Confirm COD Order'}
          </button>
        </form>
      </div>
    </div>
  );
}