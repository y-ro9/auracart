import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useProductStore } from '../stores/useProductStore';
import { normalizeDriveUrl } from '../data/products';
import { Trash2, ArrowRight } from 'lucide-react';

const itemThemes = ['bg-blush', 'bg-lilac', 'bg-ice', 'bg-mint'];

export default function Cart() {
  const { items, removeItem, getTotal } = useCartStore();
  const isUnlocked = useOfferStore((s) => s.isUnlocked);
  const allProducts = useProductStore((s) => s.products);

  const validItems = items.filter((i) => allProducts.some((p) => p.id === i.id));
  const hasMissing = validItems.length < items.length;

  if (validItems.length === 0) {
    return (
      <div className="min-h-screen bg-pastel-soft flex items-center justify-center py-16 px-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl shadow-card max-w-md w-full">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🛒</div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-2 sm:mb-3">Your Cart is Empty</h1>
          <p className="text-sm sm:text-base text-ink-soft mb-6 sm:mb-8">Add some pastel goodies first</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 sm:px-8 py-3 text-sm sm:text-base">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-soft py-4 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8">
          Your <span className="text-gradient">Cart</span>
        </h1>

        {hasMissing && (
          <div className="mb-3 bg-yellow-100 border-2 border-yellow-300 text-yellow-800 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-medium">
            ⚠️ {items.length - validItems.length} item(s) no longer available
          </div>
        )}

        <div className="space-y-2.5 sm:space-y-4">
          {validItems.map((item, index) => (
            <div
              key={`${item.id}-${item.selectedSize}-${index}`}
              className={`${itemThemes[index % itemThemes.length]} flex gap-2.5 sm:gap-4 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-white shadow-sm`}
            >
              <img
                src={normalizeDriveUrl(item.images?.[0])}
                alt={item.name}
                className="w-16 h-20 sm:w-24 sm:h-32 object-cover rounded-lg sm:rounded-2xl bg-white"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x600/FFE4EF/EC4899?text=No+Img';
                }}
              />
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-xs sm:text-lg text-ink truncate">{item.name}</h3>
                <p className="text-[10px] sm:text-sm text-ink-soft mb-1 sm:mb-2">
                  {item.selectedSize} • {item.selectedColor}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-extrabold text-ink text-sm sm:text-xl">
                    ₹{isUnlocked ? 299 : item.basePrice}
                  </span>
                  {isUnlocked && (
                    <span className="text-[10px] sm:text-sm text-ink-muted line-through">₹{item.basePrice}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <button
                  onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                  className="bg-white/80 hover:bg-red-100 text-red-500 p-1.5 sm:p-2 rounded-full transition"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold text-ink">
                  Qty: {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-8 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-card border-2 border-lilac">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div>
              <span className="text-xs sm:text-sm text-ink-soft font-medium">Total Amount</span>
              <p className="text-2xl sm:text-4xl font-extrabold text-gradient">₹{getTotal(isUnlocked)}</p>
            </div>
            <span className="bg-mint text-green-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              COD Available
            </span>
          </div>
          <Link
            to="/checkout"
            className="btn-primary block w-full text-center py-3.5 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}