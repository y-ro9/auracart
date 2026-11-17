import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../stores/useProductStore';
import { LogOut, Sparkles, Pencil, Trash2, RotateCcw, Eye, EyeOff, UploadCloud, Loader2 } from 'lucide-react';
import { Product } from '../../types';

// 👇 Yahan imageUrl ki jagah images: [] kar diya hai
const emptyForm = {
  name: '',
  category: 'Female' as Product['category'],
  type: 'Clothing' as Product['type'],
  basePrice: '',
  images: [] as string[], 
  description: '',
  sizes: 'S,M,L',
  colors: 'Pink,White',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, toggleActive, deleteProduct, resetToDefaults } = useProductStore();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('is_admin') !== 'true') navigate('/admin');
  }, [navigate]);

  // 📸 MULTIPLE IMAGE UPLOAD LOGIC
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...form.images];

    try {
      // Ek sath jitni images select ki hain, sabko loop karke upload karega
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          newImages.push(data.data.url);
        }
      }
      setForm({ ...form, images: newImages });
    } catch (err) {
      alert('Image upload failed. Check your API key.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Input reset
    }
  };

  // Image remove karne ka function
  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: form.name,
      category: form.category,
      type: form.type,
      basePrice: Number(form.basePrice),
      images: form.images, // 👈 Array save ho raha hai
      description: form.description,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      isActive: true,
    };

    if (editingId) {
      updateProduct(editingId, productData);
      setEditingId(null);
    } else {
      addProduct({ ...productData, id: `p-${Date.now()}` });
    }
    setForm(emptyForm);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      type: p.type,
      basePrice: String(p.basePrice),
      images: p.images || [], // 👈 Purane product ko handle karega
      description: p.description,
      sizes: p.sizes.join(','),
      colors: p.colors.join(','),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}" permanently?`)) {
      deleteProduct(id);
    }
  };

  const inputClass = 'w-full p-3 rounded-xl border-2 border-lilac focus:outline-none focus:border-accent bg-white text-sm';
  const filtered = products.filter((p) => filter === 'all' ? true : filter === 'active' ? p.isActive : !p.isActive);

  return (
    <div className="min-h-screen bg-pastel-soft p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-card border-2 border-lilac">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pastel-button rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-ink">Admin Dashboard</h1>
              <p className="text-ink-soft text-sm">{products.length} products · {products.filter((p) => p.isActive).length} active</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (confirm('Reset all products?')) resetToDefaults(); }} className="flex items-center gap-2 bg-white border-2 border-lilac hover:bg-lilac text-ink px-4 py-2 rounded-full font-semibold transition text-sm">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={() => { sessionStorage.clear(); navigate('/admin'); }} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-card border-2 border-blush sticky top-6 self-start">
            <h2 className="text-xl font-bold mb-4 text-ink flex items-center gap-2">
              <span className="w-8 h-8 bg-blush rounded-full flex items-center justify-center text-sm">{editingId ? '✏️' : '+'}</span>
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Product Name" required value={form.name} className={inputClass} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              
              <div className="grid grid-cols-2 gap-2">
                <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}>
                  <option value="Female">Female</option><option value="Male">Male</option><option value="Baby">Baby</option>
                </select>
                <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Product['type'] })}>
                  <option value="Clothing">Clothing</option><option value="Accessories">Accessories</option>
                </select>
              </div>

              <input type="number" placeholder="Price (min 2500)" min="2500" required value={form.basePrice} className={inputClass} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
              
              {/* 📸 MULTIPLE File Upload Section (Input me multiple attribute add kiya) */}
              <div className="border-2 border-dashed border-lilac rounded-xl p-4 text-center hover:bg-lilac/10 transition relative">
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {uploading ? (
                  <div className="flex flex-col items-center text-accent">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-sm font-semibold">Uploading Images...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-ink-soft">
                    <UploadCloud className="w-8 h-8 mb-2 text-accent" />
                    <span className="text-sm font-semibold">Click to Upload Photos</span>
                    <span className="text-xs">Select multiple images for gallery</span>
                  </div>
                )}
              </div>

              {/* Image Preview Grid (Multiple Images) */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border-2 border-gray-200">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)} 
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-[10px] shadow-sm"
                      >
                        X
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">Main Image</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <textarea placeholder="Description" rows={2} value={form.description} className={inputClass} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="text" placeholder="Sizes (S,M,L)" value={form.sizes} className={inputClass} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
              <input type="text" placeholder="Colors (Pink,White)" value={form.colors} className={inputClass} onChange={(e) => setForm({ ...form, colors: e.target.value })} />

              <div className="flex gap-2 pt-2">
                {/* Disable button if uploading or no images */}
                <button type="submit" disabled={uploading || form.images.length === 0} className="btn-primary flex-1 py-3 disabled:opacity-50">
                  {editingId ? 'Update' : 'Save Product'}
                </button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-ink font-bold px-4 rounded-full transition">Cancel</button>}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-card border-2 border-ice">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-ink">Products ({filtered.length})</h2>
              <div className="flex gap-1 bg-pastel-soft rounded-full p-1">
                {(['all', 'active', 'inactive'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition ${filter === f ? 'bg-accent text-white shadow' : 'text-ink-soft hover:bg-white'}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
              {filtered.map((p) => (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition ${p.isActive ? 'border-lilac bg-white' : 'border-gray-200 bg-gray-50 opacity-60'} ${editingId === p.id ? 'ring-2 ring-accent' : ''}`}>
                  {/* 👇 Yahan bhi p.images?.[0] kar diya */}
                  <img src={p.images?.[0] || 'https://via.placeholder.com/100?text=No+Img'} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-ink truncate">{p.name}</p>
                    <p className="text-xs text-ink-soft">{p.category} · {p.type} · ₹{p.basePrice}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(p)} className="p-2 rounded-full hover:bg-lilac text-purple-600 transition"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(p.id)} className={`p-2 rounded-full transition ${p.isActive ? 'hover:bg-yellow-100 text-yellow-600' : 'hover:bg-green-100 text-green-600'}`}>{p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="p-2 rounded-full hover:bg-red-100 text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}