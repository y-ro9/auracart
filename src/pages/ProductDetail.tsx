import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useCartStore } from '../stores/useCartStore';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const allProducts = useProductStore((s) => s.products);
  const product = allProducts.find((p) => p.id === id);
  const isUnlocked = useOfferStore((s) => s.isUnlocked);
  const addItem = useCartStore((s) => s.addItem);

  const [size, setSize] = useState(product?.sizes[0] || '');
  const [color, setColor] = useState(product?.colors[0] || '');
  
  // 👇 Image Gallery ka state
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return <div className="text-center py-20 text-2xl bg-pastel-soft min-h-screen">Product not found</div>;

  // Fallback agar purane product me single imageUrl ho
  const galleryImages = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600'];

  const handleAdd = () => {
    addItem(product, size, color);
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-pastel-soft pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto pt-3 sm:pt-12 px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12">
          
          {/* 📸 GALLERY SECTION */}
          <div className="flex flex-col gap-3">
            {/* Main Big Image */}
            <div className="aspect-[3/4] bg-blush rounded-2xl sm:rounded-3xl overflow-hidden shadow-card">
              <img
                src={galleryImages[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/FFE4EF/EC4899?text=Image'; }}
              />
            </div>
            
            {/* Thumbnails (Slider) */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImgIndex === idx ? 'border-accent shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col md:justify-center bg-white md:bg-transparent rounded-2xl sm:rounded-none p-4 sm:p-0 shadow-sm md:shadow-none -mt-6 sm:-mt-0 relative z-10">
            <div className="inline-flex items-center gap-2 bg-lilac px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-purple-700 mb-2 sm:mb-4 self-start">
              {product.category} • {product.type}
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold text-ink mb-2 sm:mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6 bg-pastel-soft sm:bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl">
              <span className="text-2xl sm:text-4xl font-extrabold text-gradient">₹{isUnlocked ? 299 : product.basePrice}</span>
              {isUnlocked && <span className="text-sm sm:text-xl text-ink-muted line-through">₹{product.basePrice}</span>}
            </div>
            <p className="text-xs sm:text-base text-ink-soft mb-4 sm:mb-8 leading-relaxed">{product.description}</p>

            {/* Size & Color... (Same as before) */}
            <div className="space-y-3 sm:space-y-6 mb-4 sm:mb-8">
              <div>
                <h3 className="font-bold mb-2 sm:mb-3 text-ink text-sm sm:text-base">Select Size</h3>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all ${size === s ? 'bg-pastel-button text-white shadow-card -translate-y-0.5' : 'bg-white text-ink-soft border-2 border-lilac hover:border-accent'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2 sm:mb-3 text-ink text-sm sm:text-base">Select Color</h3>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all ${color === c ? 'bg-pastel-button text-white shadow-card -translate-y-0.5' : 'bg-white text-ink-soft border-2 border-lilac hover:border-accent'}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleAdd} className="hidden md:flex btn-primary w-full py-4 items-center justify-center gap-2"><ShoppingBag className="w-5 h-5" /> Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-lilac p-3 z-30 shadow-[0_-10px_30px_-10px_rgba(124,58,237,0.25)]">
        <button onClick={handleAdd} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm"><ShoppingBag className="w-4 h-4" /> Add to Cart — ₹{isUnlocked ? 299 : product.basePrice}</button>
      </div>
    </div>
  );
}