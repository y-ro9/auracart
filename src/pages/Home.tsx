import { normalizeDriveUrl } from '../data/products';
import { useProductStore } from '../stores/useProductStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useCartStore } from '../stores/useCartStore';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const cardThemes = [
  { bg: 'bg-blush', border: 'border-pink-200', price: 'text-pink-600' },
  { bg: 'bg-lilac', border: 'border-purple-200', price: 'text-purple-600' },
  { bg: 'bg-ice', border: 'border-blue-200', price: 'text-blue-600' },
  { bg: 'bg-mint', border: 'border-green-200', price: 'text-green-600' },
];

export default function Home() {
  const isUnlocked = useOfferStore((s) => s.isUnlocked);
  const addItem = useCartStore((s) => s.addItem);
  const allProducts = useProductStore((s) => s.products);
  const products = allProducts.filter((p) => p.isActive);

  return (
    <div>
      {/* Hero — mobile optimized */}
      <section className="relative bg-pastel-hero py-12 sm:py-20 md:py-24 px-4 overflow-hidden">
        <div className="absolute top-10 left-5 w-40 sm:w-72 h-40 sm:h-72 bg-pink-300/50 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-5 w-48 sm:w-80 h-48 sm:h-80 bg-purple-300/50 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-10 left-1/3 w-40 sm:w-72 h-40 sm:h-72 bg-blue-300/50 rounded-full blur-3xl animate-float-reverse" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
            <span className="text-xs sm:text-sm font-semibold text-ink-soft">
              New Pastel Collection 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-ink mb-3 sm:mb-6 leading-tight">
            Pastel Fashion
            <br />
            <span className="text-gradient">at Wholesale Prices</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-ink-soft mb-6 sm:mb-10 max-w-xl mx-auto px-2">
            Premium quality, unique designs. Unlock exclusive ₹299 pricing by sharing with friends.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/collection/Female/Clothing"
              className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              Shop Female
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/collection/Male/Clothing"
              className="bg-white text-ink font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-card hover:shadow-glow transition-all hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Shop Male
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills — 2 cols mobile, 4 desktop */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12 -mt-4 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            { label: 'Female', sub: 'Clothing', to: '/collection/Female/Clothing', emoji: '👗', bg: 'bg-blush', ring: 'hover:ring-pink-300' },
            { label: 'Male', sub: 'Clothing', to: '/collection/Male/Clothing', emoji: '👔', bg: 'bg-ice', ring: 'hover:ring-blue-300' },
            { label: 'Baby', sub: 'Clothing', to: '/collection/Baby/Clothing', emoji: '🍼', bg: 'bg-lilac', ring: 'hover:ring-purple-300' },
            { label: 'Accessories', sub: 'All', to: '/collection/Female/Accessories', emoji: '✨', bg: 'bg-mint', ring: 'hover:ring-green-300' },
          ].map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className={`${cat.bg} p-3 sm:p-6 rounded-2xl sm:rounded-3xl text-center ring-2 ring-transparent ${cat.ring} hover:-translate-y-1 transition-all shadow-sm hover:shadow-card`}
            >
              <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{cat.emoji}</div>
              <p className="font-bold text-ink text-xs sm:text-sm leading-tight">{cat.label}</p>
              <p className="text-[10px] sm:text-xs text-ink-soft">{cat.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products — 2 cols mobile, 4 desktop */}
      <section className="max-w-7xl mx-auto py-6 sm:py-12 px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink mb-1 sm:mb-2">
            Trending <span className="text-gradient">Now</span>
          </h2>
          <p className="text-xs sm:text-base text-ink-soft">Handpicked pastel favorites just for you</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {products.map((product, idx) => {
            const theme = cardThemes[idx % cardThemes.length];
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className={`group ${theme.bg} rounded-2xl sm:rounded-3xl p-2 sm:p-3 border-2 ${theme.border} transition-all hover:-translate-y-1 hover:shadow-card`}
              >
                <div className="aspect-[3/4] bg-white rounded-xl sm:rounded-2xl overflow-hidden relative mb-2 sm:mb-4 shadow-sm">
                  <img
                    src={normalizeDriveUrl(product.images?.[0])}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x600/FFE4EF/EC4899?text=Image';
                    }}
                  />
                  {isUnlocked && (
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-pastel-banner text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow">
                      ₹299
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem(product, product.sizes[0] || 'M', product.colors[0] || 'Default');
                    }}
                    className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-bold shadow-lg sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    + Add
                  </button>
                </div>
                <h3 className="font-bold text-ink truncate text-xs sm:text-base">{product.name}</h3>
                <p className="text-[10px] sm:text-xs text-ink-soft mb-1 sm:mb-2 truncate">
                  {product.category} · {product.type}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`text-sm sm:text-xl font-extrabold ${theme.price}`}>
                    ₹{isUnlocked ? 299 : product.basePrice}
                  </span>
                  {isUnlocked && (
                    <span className="text-[10px] sm:text-sm text-ink-muted line-through">
                      ₹{product.basePrice}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section — mobile optimized */}
      <section className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <div className="bg-pastel-hero rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-white/40 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-3xl font-extrabold text-ink mb-2 sm:mb-3">
              Ready to unlock ₹299 prices?
            </h3>
            <p className="text-xs sm:text-base text-ink-soft mb-4 sm:mb-6">
              Share with 6 friends on WhatsApp and save up to 90%
            </p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `✨ *AURACART — PASTEL FASHION MEGA DEAL* ✨\n\n🛍️ Premium pastel clothes & accessories\n💰 *Market Price:* ₹2500+\n🎉 *Unlock Price:* Sirf ₹299!\n🚚 Cash on Delivery Available\n\n👉 ${window.location.origin}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-card transition-all hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}