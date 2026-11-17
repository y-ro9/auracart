import { useParams, Link } from 'react-router-dom';
import { normalizeDriveUrl } from '../data/products';
import { useProductStore } from '../stores/useProductStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useCartStore } from '../stores/useCartStore';
import { useState } from 'react';
import { Search } from 'lucide-react';

const cardThemes = [
  { bg: 'bg-blush', border: 'border-pink-200', price: 'text-pink-600' },
  { bg: 'bg-lilac', border: 'border-purple-200', price: 'text-purple-600' },
  { bg: 'bg-ice', border: 'border-blue-200', price: 'text-blue-600' },
  { bg: 'bg-mint', border: 'border-green-200', price: 'text-green-600' },
];

export default function CollectionPage() {
  const { category, type } = useParams();
  const isUnlocked = useOfferStore((s) => s.isUnlocked);
  const addItem = useCartStore((s) => s.addItem);
  const allProducts = useProductStore((s) => s.products);
  const [search, setSearch] = useState('');

  const filteredProducts = allProducts.filter(
    (p) =>
      p.isActive &&
      p.category === category &&
      p.type === type &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pastel-soft">
      {/* Header — mobile compact */}
      <div className="bg-pastel-hero py-8 sm:py-16 px-4 relative overflow-hidden">
        <div className="absolute -top-20 right-10 w-40 sm:w-64 h-40 sm:h-64 bg-white/40 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-5xl font-extrabold text-ink mb-1 sm:mb-3">
            {category}'s <span className="text-gradient">{type}</span>
          </h1>
          <p className="text-xs sm:text-base text-ink-soft">Discover the pastel collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-10 px-3 sm:px-4">
        {/* Sticky search on mobile */}
        <div className="sticky top-20 z-20 bg-pastel-soft/90 backdrop-blur-md py-2 -mx-3 px-3 sm:relative sm:top-0 sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:mx-0 sm:px-0 mb-4 sm:mb-10">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search this collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-full border-2 border-lilac focus:outline-none focus:border-accent bg-white shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm max-w-md mx-auto px-4">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <p className="text-lg sm:text-2xl font-bold text-ink mb-1 sm:mb-2">No products found</p>
            <p className="text-xs sm:text-base text-ink-soft">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((product, idx) => {
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
        )}
      </div>
    </div>
  );
}