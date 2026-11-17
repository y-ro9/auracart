import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useOfferStore } from '../stores/useOfferStore';
import OfferPopup from './OfferPopup';
import FloatingOfferCTA from './FloatingOfferCTA';
import { useEffect, useState } from 'react';

export default function Layout() {
  const cartCount = useCartStore((state) => state.items.length);
  const isUnlocked = useOfferStore((state) => state.isUnlocked);
  const [popupOpen, setPopupOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Popup on first visit
  useEffect(() => {
    if (!isUnlocked && !localStorage.getItem('popup_seen')) {
      const timer = setTimeout(() => {
        setPopupOpen(true);
        localStorage.setItem('popup_seen', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Male Clothing', to: '/collection/Male/Clothing' },
    { label: 'Male Accessories', to: '/collection/Male/Accessories' },
    { label: 'Female Clothing', to: '/collection/Female/Clothing' },
    { label: 'Female Accessories', to: '/collection/Female/Accessories' },
    { label: 'Baby Clothing', to: '/collection/Baby/Clothing' },
    { label: 'Baby Accessories', to: '/collection/Baby/Accessories' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-pastel-soft">
      {/* Offer Banner */}
      {!isUnlocked && (
        <button
          onClick={() => setPopupOpen(true)}
          className="block w-full bg-pastel-banner bg-[length:200%_200%] animate-gradient-x text-white text-center py-2.5 text-sm font-semibold tracking-wide hover:opacity-95 transition"
        >
          🎁 Share with 6 friends on WhatsApp → Unlock every item at ₹299! ✨
        </button>
      )}

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-30 border-b-2 border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#FFE4EF,#EDE4FF,#EAF4FF)_border-box]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:rotate-12 transition-transform">🛍️</span>
            <span className="text-2xl font-extrabold text-gradient tracking-tight">AuraCart</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1 font-semibold">
            <Link
              to="/collection/Male/Clothing"
              className="px-4 py-2 rounded-full hover:bg-ice text-ink-soft hover:text-blue-600 transition-all"
            >
              Male
            </Link>
            <Link
              to="/collection/Female/Clothing"
              className="px-4 py-2 rounded-full hover:bg-blush text-ink-soft hover:text-pink-600 transition-all"
            >
              Female
            </Link>
            <Link
              to="/collection/Baby/Clothing"
              className="px-4 py-2 rounded-full hover:bg-lilac text-ink-soft hover:text-purple-600 transition-all"
            >
              Baby
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-3 bg-pastel-button hover:bg-pastel-button-hover rounded-full shadow-card transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-pink-400 shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-3 bg-lilac hover:bg-lilac-hover rounded-full transition"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-lilac bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 rounded-xl hover:bg-pastel-soft text-ink-soft font-semibold text-sm transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gradient-to-r from-blush via-lilac to-ice py-8 text-center">
        <p className="text-ink-soft font-medium">
          Made with 💜 by <span className="text-gradient font-bold">AuraCart</span>
        </p>
        <p className="text-xs text-ink-muted mt-1">Pastel fashion at wholesale prices</p>
      </footer>

      <FloatingOfferCTA onClick={() => setPopupOpen(true)} isHidden={popupOpen} />
      <OfferPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}