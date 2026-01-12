
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Menu, X, Phone, ShoppingBag, MapPin, Clock,
  CheckCircle2, Star, MessageCircle, ExternalLink, ArrowLeft, Send, Minus, Package, User, Scissors, ShoppingCart, Trash2, Plus, Zap, Search, ShieldCheck, FileText
} from "lucide-react";

// --- Types & Data ---

type ProductType = "dry" | "fresh";
type ViewState = "home" | "dry" | "fresh" | "about" | "contact" | "search" | "privacy" | "terms";

interface Product {
  id: string;
  name: string;
  tamilName: string;
  type: ProductType;
  description: string;
  priceRange: string;
  imageUrl: string;
}

interface CartItem extends Product {
  cartId: string;
  quantity: string;
}

const WHATSAPP_NUMBER = "+916382985806";

// --- Constants ---
const LOGO_PATH = "images/Logo.jpeg";
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/fff7ed/9a3412?text=Product+Image";

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382C17.112 14.202 15.344 13.332 15.013 13.212C14.682 13.092 14.441 13.032 14.201 13.392C13.961 13.752 13.27 14.562 13.06 14.802C12.85 15.042 12.64 15.072 12.28 14.892C11.92 14.712 10.759 14.332 9.38098 13.105C8.30798 12.149 7.58498 10.969 7.37498 10.609C7.16498 10.249 7.35298 10.055 7.53298 9.876C7.69498 9.715 7.89298 9.458 8.07298 9.248C8.25298 9.038 8.31298 8.888 8.43298 8.648C8.55298 8.408 8.49298 8.198 8.40298 8.018C8.31298 7.838 7.59298 6.068 7.29298 5.348C7.00098 4.647 6.70698 4.743 6.47898 4.733C6.26298 4.723 6.01698 4.723 5.77098 4.723C5.52498 4.723 5.12898 4.814 4.79298 5.18C4.45698 5.546 3.50698 6.44 3.50698 8.259C3.50698 10.078 4.82698 11.837 5.01298 12.083C5.19898 12.329 7.64798 16.104 11.398 17.724C12.29 18.11 12.986 18.341 13.529 18.513C14.58 18.846 15.543 18.799 16.301 18.686C17.143 18.56 18.895 17.625 19.261 16.598C19.627 15.571 19.627 14.693 19.513 14.498C19.399 14.303 19.099 14.188 18.739 14.008H17.472Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 21.6C17.3019 21.6 21.6 17.3019 21.6 12C21.6 6.69807 17.3019 2.4 12 2.4C6.69807 2.4 2.4 6.69807 2.4 12C2.4 13.6826 2.83355 15.2638 3.60628 16.6479L2.55393 20.4856L6.52538 19.4447C7.82869 20.1554 9.32421 20.5732 10.9088 20.6136L11.0912 20.6183L12 21.6ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 14.1258 0.556012 16.1262 1.5173 17.8549L0.0918944 23.0543L5.43229 21.6543C7.07096 22.548 8.95669 23.0323 10.95 23.0374H11.05C11.3654 23.0374 11.6835 23.025 12 23.001V24Z" fillOpacity="0.1" />
  </svg>
);

const getEstimatedPrice = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('vanjaram')) return "₹800 - ₹1200";
  if (n.includes('nethili')) return "₹300 - ₹500";
  if (n.includes('valai')) return "₹350 - ₹550";
  if (n.includes('prawn') || n.includes('sennakunni')) return "₹250 - ₹450";
  if (n.includes('kavala')) return "₹150 - ₹300";
  return "₹200 - ₹450";
};

const getFreshFishPrice = (name: string): string => {
  return "Market Price"; // Default for fresh fish as prices vary daily
};

/**
 * USER: Edit the 'imageUrl' fields below to add your own product images.
 * You can use local paths (e.g., "images/myfish.jpg") or web URLs (e.g., "https://example.com/fish.jpg").
 */
const dryFishData = [
  { name: "Vanjaram Karuvadu", tamil: "வஞ்சரம் கருவாடு", imageUrl: "images/Vanjaram Karuvadu.png" },
  { name: "Nethili Karuvadu", tamil: "நெத்திலி கருவாடு", imageUrl: "images/Nethili Karuvadu.png" },
  { name: "Vala Karuvadu", tamil: "வாளை கருவாடு", imageUrl: "images/vala-karuvadu.png" },
  { name: "Sheela Karuvadu", tamil: "ஷீலா கருவாடு", imageUrl: "images/sheela-karuvadu.png" },
  { name: "Manja Karuvadu", tamil: "மஞ்சா கருவாடு", imageUrl: "images/Manjaparai Karuvadu (2).png" },
  { name: "Kadamba Karuvadu", tamil: "கடம்பா கருவாடு", imageUrl: "images/kadamba-karuvadu.png" },
  { name: "Clanga Karuvadu", tamil: "கிழங்கா கருவாடு", imageUrl: "images/clanga-karuvadu.png" },
  { name: "Mathi Karuvadu", tamil: "மத்தி கருவாடு", imageUrl: "images/Mathi Karuvadu.png" },
  { name: "Kavala Karuvadu", tamil: "கவலை கருவாடு", imageUrl: "images/kavala karuvadu.png" },
  { name: "Palsura Karuvadu", tamil: "பால் சுறா கருவாடு", imageUrl: "images/Palsura Karuvadu.png" },
  { name: "Thirukkai Karuvadu", tamil: "திருக்கை கருவாடு", imageUrl: "images/Thirukkai Karuvadu.png" },
  { name: "Sennakunni Karuvadu", tamil: "சென்னகுனி கருவாடு", imageUrl: "images/Sennakunni Karuvadu.png" },
  { name: "Vavval Karuvadu", tamil: "வவ்வால் கருவாடு", imageUrl: "images/Vavval Karuvadu.png" },
  { name: "Kaja Podi Karuvadu", tamil: "காஜா பொடி கருவாடு", imageUrl: "images/Kaja Podi Karuvadu.png" }
];

const freshFishData = [
  { name: "Vanjaram (Seer Fish)", tamil: "வஞ்சரம்", imageUrl: "Fresh Fish/Vanjaram.png" },
  { name: "Eral (Prawns)", tamil: "இறால்", imageUrl: "Fresh Fish/eral.png" },
  { name: "Nethili", tamil: "நெத்திலி", imageUrl: "Fresh Fish/Nethil.png" },
  { name: "Sankara", tamil: "சங்கரா", imageUrl: "Fresh Fish/Sankara.png" },
  { name: "Nandu (Crab)", tamil: "நண்டு", imageUrl: "Fresh Fish/Nandu.png" },
  { name: "Kaala Meen", tamil: "காலா மீன்", imageUrl: "Fresh Fish/Kaala.png" },
  { name: "Kadal Vara", tamil: "கடல் விறால்", imageUrl: "Fresh Fish/Kadalvaraa.png" },
  { name: "Kadamba (Squid)", tamil: "கடம்பா / கணவாய்", imageUrl: "Fresh Fish/Kadamba-Kanava.png" },
  { name: "Kara Podi", tamil: "காரா பொடி", imageUrl: "Fresh Fish/Kara-Podi.png" },
  { name: "Kavala", tamil: "கவலை", imageUrl: "Fresh Fish/Kavala.png" },
  { name: "Kilangan", tamil: "கிழங்கான்", imageUrl: "Fresh Fish/Kilanga.png" },
  { name: "Mathi", tamil: "மத்தி", imageUrl: "Fresh Fish/Mathi.png" },
  { name: "Nagarai", tamil: "நகரை", imageUrl: "Fresh Fish/Nagarai.png" },
  { name: "Paalai", tamil: "பாலை", imageUrl: "Fresh Fish/Paalai.png" },
  { name: "Sheela", tamil: "ஷீலா", imageUrl: "Fresh Fish/Sheela.png" },
  { name: "Sura (Shark)", tamil: "சுறா", imageUrl: "Fresh Fish/Sura.png" },
  { name: "Thirukkai", tamil: "திருக்கை", imageUrl: "Fresh Fish/Thirukkai.png" },
  { name: "Black Vavval", tamil: "கருப்பு வவ்வால்", imageUrl: "Fresh Fish/Vavval Black.png" },
  { name: "White Vavval", tamil: "வெள்ளை வவ்வால்", imageUrl: "Fresh Fish/Vavval-White.png" }
];

const generateProducts = (): Product[] => {
  const dryProducts = dryFishData.map((item, idx) => ({
    id: `d-${idx}`,
    name: item.name,
    tamilName: item.tamil,
    type: "dry" as ProductType,
    description: "Sun-dried, salted, and hygienically processed for authentic taste.",
    priceRange: getEstimatedPrice(item.name),
    imageUrl: item.imageUrl || PLACEHOLDER_IMAGE
  }));

  const freshProducts = freshFishData.map((item, idx) => ({
    id: `f-${idx}`,
    name: item.name,
    tamilName: item.tamil,
    type: "fresh" as ProductType,
    description: "Freshly caught, cleaned, and delivered ice-packed.",
    priceRange: getFreshFishPrice(item.name),
    imageUrl: item.imageUrl || PLACEHOLDER_IMAGE
  }));

  return [...dryProducts, ...freshProducts];
};

const ALL_PRODUCTS = generateProducts();

const NAV_ITEMS: { label: string; id: ViewState }[] = [
  { label: "Home", id: "home" },
  { label: "Dry Fish", id: "dry" },
  { label: "Fresh Fish", id: "fresh" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

// --- Components ---

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "whatsapp" | "outline" | "brand" | "brand-outline";
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  href,
  type = "button",
  disabled
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-navy text-white hover:bg-brand-ocean shadow-lg shadow-brand-navy/20",
    secondary: "bg-white text-brand-navy border-2 border-brand-navy/10 hover:bg-brand-cream",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-md",
    outline: "bg-transparent border border-white/30 text-white hover:bg-white/10",
    brand: "bg-brand-navy text-white hover:bg-brand-ocean",
    "brand-outline": "bg-transparent border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
  };

  const classes = `${baseStyle} ${variants[variant]} ${className}`;

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>;
  }
  return <button type={type} onClick={onClick} className={classes} disabled={disabled}>{children}</button>;
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-3">{title}</h2>
    {subtitle && <p className="text-brand-ocean text-lg max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 bg-brand-sand mx-auto mt-4 rounded-full"></div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-brand-ocean hover:text-brand-navy font-medium mb-6 transition-colors group px-4 md:px-0"
  >
    <div className="p-2 rounded-full bg-white border border-brand-sand/30 group-hover:border-brand-navy shadow-sm">
      <ArrowLeft size={18} />
    </div>
    Back to Home
  </button>
);

// --- Modals & Forms ---

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQty
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: string) => void;
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleCheckout = () => {
    if (items.length === 0) return;

    let msg = `*🛒 New Order*\n`;
    msg += `----------------------------\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (${item.tamilName})\n`;
      msg += `   Qty: ${item.quantity} | Price: ${item.priceRange}\n`;
    });
    msg += `----------------------------\n`;
    msg += `👤 Name: ${name || 'Not Provided'}\n`;
    msg += `📍 Location: ${location || 'Not Provided'}\n`;
    msg += `----------------------------\n`;
    msg += `Please confirm availability.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-brand-navy/40 z-50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-brand-cream shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 bg-brand-navy text-white flex justify-between items-center shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart size={22} />
              Your Cart ({items.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-brand-ocean/50 space-y-4">
                <ShoppingBag size={64} opacity={0.5} />
                <p className="text-lg font-medium">Your cart is empty</p>
                <Button onClick={onClose} variant="brand-outline" className="mt-4">Start Shopping</Button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.cartId} className="bg-white p-4 rounded-xl shadow-sm border border-brand-sand/20 flex gap-3 animate-in slide-in-from-right-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <img src={item.imageUrl} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-brand-navy truncate">{item.name}</h4>
                    <p className="text-xs text-brand-ocean font-medium">{item.tamilName}</p>
                    <p className="text-xs text-brand-ocean font-semibold mt-1">{item.priceRange}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        value={item.quantity}
                        onChange={(e) => onUpdateQty(item.cartId, e.target.value)}
                        className="text-xs bg-brand-cream border border-brand-sand/30 rounded p-1 outline-none focus:border-brand-navy"
                      >
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="1kg">1kg</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.cartId)} className="text-red-400 hover:text-red-600 self-start p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-brand-sand/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-sm p-3 border border-brand-sand/30 rounded-lg bg-brand-cream focus:ring-1 focus:ring-brand-navy outline-none"
                />
                <input
                  type="text"
                  placeholder="Delivery Area"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full text-sm p-3 border border-brand-sand/30 rounded-lg bg-brand-cream focus:ring-1 focus:ring-brand-navy outline-none"
                />
              </div>
              <Button onClick={handleCheckout} variant="whatsapp" className="w-full py-3.5 text-base shadow-green-200" disabled={!name || !location}>
                <WhatsAppIcon size={20} className="mr-2" />
                Checkout on WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const ProductOrderModal = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    quantity: '500g',
    name: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let msg = `*⚡ Quick Order*\n`;
    msg += `------------------\n`;
    msg += `🐟 Product: *${product.name}*\n`;
    msg += `🔤 Tamil: ${product.tamilName}\n`;
    msg += `💰 Approx: ${product.priceRange}\n`;
    msg += `⚖️ Quantity: ${formData.quantity}\n`;
    msg += `------------------\n`;
    msg += `👤 Name: ${formData.name}\n`;
    msg += `📍 Location: ${formData.location}\n`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-brand-navy p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2"><Zap size={20} className="text-yellow-400" fill="currentColor" /> Instant Buy</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="bg-brand-cream p-4 border-b border-brand-sand/20 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
            <img src={product.imageUrl} onError={(e) => (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-brand-navy">{product.name}</h4>
            <p className="text-brand-ocean text-sm">{product.tamilName}</p>
            <p className="text-sm font-black text-brand-navy mt-1">{product.priceRange}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-brand-navy mb-1 flex items-center gap-1"><Package size={14} /> Quantity</label>
            <select
              className="w-full p-2.5 bg-brand-cream border border-brand-sand/30 rounded-lg focus:ring-2 focus:ring-brand-navy outline-none"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            >
              <option value="250g">250 grams</option>
              <option value="500g">500 grams</option>
              <option value="1kg">1 Kg</option>
              <option value="2kg+">2 Kg+ (Bulk)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-1 flex items-center gap-1"><User size={14} /> Name</label>
              <input type="text" required placeholder="Ex: Raja" className="w-full p-2.5 bg-brand-cream border border-brand-sand/30 rounded-lg focus:ring-2 focus:ring-brand-navy outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-1 flex items-center gap-1"><MapPin size={14} /> Area</label>
              <input type="text" required placeholder="Ex: Adyar" className="w-full p-2.5 bg-brand-cream border border-brand-sand/30 rounded-lg focus:ring-2 focus:ring-brand-navy outline-none" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-navy hover:bg-brand-ocean text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95">
            <WhatsAppIcon size={20} /> Order on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({ name: '', topic: 'Buying Dry Fish', message: '' });

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all transform hover:scale-110 flex items-center justify-center">
        <WhatsAppIcon size={32} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-[90vw] md:w-80 flex flex-col shadow-2xl rounded-xl overflow-hidden font-sans animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#128C7E] p-3 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsOpen(false)}>
        <div className="flex items-center gap-2"><WhatsAppIcon size={20} /><span className="font-semibold">Quick Enquiry</span></div>
        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-white/20 rounded-full transition-colors"><Minus size={18} /></button>
      </div>
      <div className="bg-white p-4 border-x border-b border-slate-200">
        <form onSubmit={(e) => { e.preventDefault(); const msg = `*Quick Enquiry*\nName: ${formData.name}\nTopic: ${formData.topic}\nMsg: ${formData.message}`; window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank'); }} className="flex flex-col gap-3">
          <input type="text" placeholder="Your Name" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none bg-slate-50" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none bg-slate-50" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })}>
            <option>Buying Dry Fish</option>
            <option>Buying Fresh Fish</option>
            <option>Bulk Order Enquiry</option>
            <option>Delivery Status</option>
          </select>
          <textarea rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 outline-none bg-slate-50" placeholder="Your question..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
          <button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            <Send size={16} /> Start Chat
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Product Card Component ---

interface ProductCardProps {
  product: Product;
  onInstantBuy: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onInstantBuy, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-brand-sand/20 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE} />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm flex items-center gap-1 border border-brand-sand/30">
          <CheckCircle2 size={12} className="text-brand-ocean" /> {product.type === 'dry' ? 'Premium Dry' : 'Daily Fresh'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-lg font-black text-brand-navy line-clamp-1">{product.name}</h3>
          <p className="text-brand-ocean/80 text-sm font-medium">{product.tamilName}</p>
        </div>
        <div className="mb-3 text-2xl font-black text-brand-navy">{product.priceRange} <span className="text-sm font-medium text-slate-400">/kg</span></div>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
        <div className="mt-auto grid grid-cols-5 gap-2">
          <button onClick={() => onAddToCart(product)} className="col-span-2 flex items-center justify-center gap-1 bg-brand-cream text-brand-navy border border-brand-navy/20 rounded-lg hover:bg-brand-sand hover:text-white transition-colors font-bold text-sm">
            <Plus size={16} /> Add
          </button>
          <button onClick={() => onInstantBuy(product)} className="col-span-3 flex items-center justify-center gap-1 bg-brand-navy text-white rounded-lg hover:bg-brand-ocean transition-colors font-bold text-sm shadow-md shadow-brand-navy/20">
            <Zap size={16} fill="currentColor" className="text-yellow-400" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<ViewState>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => { window.scrollTo(0, 0); setIsMenuOpen(false); }, [view]);

  const bestSellers = ALL_PRODUCTS.slice(0, 6);

  const handleInstantBuy = (product: Product) => setSelectedProduct(product);
  const handleAddToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: Math.random().toString(36).substr(2, 9), quantity: '500g' };
    setCart([...cart, newItem]);
    setNotification(`Added ${product.name} to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const renderContent = () => {
    switch (view) {
      case "search":
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const searchResults = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(normalizedQuery) || p.tamilName.includes(normalizedQuery));
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => { setView("home"); setSearchQuery(""); }} />
            <SectionTitle title="Search Results" subtitle={`Showing results for "${searchQuery}"`} />
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map(p => <ProductCard key={p.id} product={p} onInstantBuy={handleInstantBuy} onAddToCart={handleAddToCart} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-brand-sand/20">
                <Search size={40} className="text-brand-ocean/50 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-brand-navy mb-3">No products found</h3>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setView("dry")} variant="brand" className="gap-2"><ShoppingBag size={20} /> Shop Dry</Button>
                  <Button onClick={() => setView("fresh")} variant="brand-outline" className="gap-2"><ShoppingBag size={20} /> Shop Fresh</Button>
                </div>
              </div>
            )}
          </div>
        );
      case "dry":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <SectionTitle title="Premium Dry Fish Menu" subtitle="Sun-dried, authentic flavors delivered to your kitchen." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ALL_PRODUCTS.map(p => <ProductCard key={p.id} product={p} onInstantBuy={handleInstantBuy} onAddToCart={handleAddToCart} />)}
            </div>
          </div>
        );

      case "fresh":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <SectionTitle title="Daily Fresh Fish" subtitle="Straight from the ocean, cleaned and packed with ice." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ALL_PRODUCTS.filter(p => p.type === "fresh").map(p => <ProductCard key={p.id} product={p} onInstantBuy={handleInstantBuy} onAddToCart={handleAddToCart} />)}
            </div>
          </div>
        );
      case "about":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-48 bg-brand-navy flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a8723ba3f9?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-20"></div>
                <h1 className="text-4xl font-bold relative z-10">About Us</h1>
              </div>
              <div className="p-8 md:p-12 space-y-6 text-lg text-slate-600 leading-relaxed">
                <p className="font-medium text-brand-navy text-2xl">DRY Fish Chennai brings you premium-quality dry fish at affordable prices.</p>
                <p>We specialize in authentic, sun-dried seafood sourced directly from the coast. Every item is hygienically packed to preserve its traditional taste. Our mission is to make quality Karuvadu accessible to every household in Chennai with reliable doorstep delivery.</p>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <SectionTitle title="Contact Us" subtitle="We'd love to hear from you." />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-cream text-brand-navy rounded-lg"><MapPin /></div>
                    <div><h3 className="font-bold text-lg text-brand-navy">Location</h3><p className="text-slate-600">Chennai, Tamil Nadu</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-cream text-brand-navy rounded-lg"><Phone /></div>
                    <div><h3 className="font-bold text-lg text-brand-navy">Phone & WhatsApp</h3><p className="text-slate-600">+{WHATSAPP_NUMBER}</p></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-brand-sand/20">
                <h3 className="text-xl font-bold text-brand-navy mb-4">Send us a message</h3>
                <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("*Enquiry*\nName: " + fd.get('name') + "\nMsg: " + fd.get('msg'))}`, '_blank'); }} className="space-y-4">
                  <input name="name" type="text" className="w-full p-3 border rounded-lg bg-brand-cream outline-none" placeholder="Your Name" required />
                  <textarea name="msg" rows={5} className="w-full p-3 border rounded-lg bg-brand-cream outline-none" placeholder="Your message..." required></textarea>
                  <Button type="submit" variant="brand" className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <SectionTitle title="Privacy Policy" />
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-sand/20 p-8 md:p-12 space-y-6">
              <p className="text-slate-600 leading-relaxed">At DRY Fish Chennai, we prioritize your data security. We only collect basic info like Name and Phone for order processing. We do not sell your data to third parties.</p>
            </div>
          </div>
        );
      case "terms":
        return (
          <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <BackButton onClick={() => setView("home")} />
            <SectionTitle title="Terms & Conditions" />
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-brand-sand/20 p-8 md:p-12 space-y-6">
              <p className="text-slate-600 leading-relaxed">By ordering, you agree to our service terms. Orders are confirmed via WhatsApp. Delivery within Chennai based on location availability.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="relative bg-brand-navy text-white overflow-hidden min-h-[70vh]">
              <div className="absolute inset-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1621857426350-ddab819cf0cc?auto=format&fit=crop&q=80&w=2000" alt="Dry Fish Market" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/80 to-transparent"></div>
              <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-start justify-center h-full">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-sea/20 border border-brand-sea/30 text-brand-sea font-medium text-sm uppercase tracking-wide backdrop-blur-sm">Premium Karuvadu Online</div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl">Quality <span className="text-brand-sea">Seafood</span><br />Delivered in Chennai.</h1>
                <p className="text-lg md:text-xl text-brand-cream/80 mb-8 max-w-xl">Experience the best of both worlds - Authentic Sun-dried Karuvadu and Daily Fresh Catch. Hygienically processed and delivered to your doorstep.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => setView("dry")} variant="brand" className="bg-brand-sand text-brand-navy hover:bg-white gap-2 w-full sm:w-auto shadow-xl"><ShoppingBag size={20} /> Shop Dry Fish</Button>
                  <Button onClick={() => setView("fresh")} variant="brand-outline" className="border-brand-sand text-brand-sand hover:bg-brand-sand hover:text-brand-navy gap-2 w-full sm:w-auto"><ShoppingBag size={20} /> Shop Fresh Fish</Button>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-16">
              <SectionTitle title="Featured Products" subtitle="Our best-selling dry and fresh varieties" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestSellers.map(p => <ProductCard key={p.id} product={p} onInstantBuy={handleInstantBuy} onAddToCart={handleAddToCart} />)}
              </div>
              <div className="mt-12 text-center">
                <Button onClick={() => setView("dry")} variant="brand-outline" className="px-12">View Full Menu</Button>
              </div>
            </div>

            <div className="bg-brand-sand/10 py-20">
              <div className="container mx-auto px-4">
                <SectionTitle title="Customer Reviews" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: "Priya S.", text: "The Vanjaram Karuvadu was perfectly dried. Best quality I've found online.", loc: "Adyar" },
                    { name: "Karthik R.", text: "Neat packing and prompt delivery. The Nethili was very fresh.", loc: "Anna Nagar" },
                    { name: "Lakshmi M.", text: "Reliable service and authentic taste. Highly recommend to anyone in Chennai.", loc: "T. Nagar" }
                  ].map((review, i) => (
                    <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-brand-sand/20">
                      <div className="flex text-yellow-400 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                      <p className="text-brand-navy/70 mb-6 italic leading-relaxed">"{review.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center font-bold text-brand-navy">{review.name[0]}</div>
                        <div><p className="font-bold text-brand-navy text-sm">{review.name}</p><p className="text-xs text-brand-ocean">{review.loc}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-cream">
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-brand-navy text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 size={18} className="text-brand-sea" />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-brand-sand/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView("home")}>
              <div className="h-14 w-auto flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img src={LOGO_PATH} alt="DRY Fish Chennai" className="h-full w-auto object-contain rounded-lg" />
              </div>
              <div className="flex flex-col hidden lg:flex">
                <span className="text-xl font-black text-brand-navy leading-none">DRY Fish</span>
                <span className="text-xs font-bold text-brand-ocean uppercase tracking-widest mt-1">Chennai</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setView(item.id)} className={`text-sm font-semibold transition-all duration-200 ${view === item.id ? "text-brand-ocean" : "text-brand-navy/60 hover:text-brand-navy"}`}>{item.label}</button>
              ))}
              <div className="relative w-56">
                <div className="relative w-56">
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (view !== "search" && e.target.value) setView("search"); }} className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-sand/20 rounded-full text-sm outline-none" />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                </div>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
              </div>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-brand-navy hover:bg-brand-cream rounded-full">
                <ShoppingCart size={24} />
                {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cart.length}</span>}
              </button>
            </nav>

            <div className="flex items-center gap-3 md:hidden">
              <button className="p-2 text-brand-navy" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}><Search size={22} /></button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-brand-navy">
                <ShoppingCart size={24} />
                {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cart.length}</span>}
              </button>
              <button className="p-2 text-brand-navy" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>
          </div>
          {isMobileSearchOpen && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <input type="text" placeholder="Search fish..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (view !== "search") setView("search"); }} className="w-full pl-10 pr-4 py-3 bg-brand-cream border border-brand-sand/20 rounded-xl text-brand-navy outline-none" />
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
              </div>
            </div>
          )}
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-sand/20 flex flex-col p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setView(item.id); setIsMenuOpen(false); }} className={`text-left py-3 px-4 rounded-lg font-medium ${view === item.id ? "bg-brand-cream" : ""}`}>{item.label}</button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-grow">{renderContent()}</main>

      {selectedProduct && <ProductOrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={(id) => setCart(cart.filter(item => item.cartId !== id))} onUpdateQty={(id, qty) => setCart(cart.map(item => item.cartId === id ? { ...item, quantity: qty } : item))} />
      <FloatingContactWidget />

      <footer className="bg-brand-navy text-brand-cream py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={LOGO_PATH} alt="DRY Fish Chennai" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-white font-bold text-xl">DRY Fish Chennai</h3>
              </div>
              <h3 className="text-white font-bold text-xl">DRY Fish Chennai</h3>
            </div>
            <p className="text-sm text-brand-sea mb-6">Premium quality Dry Fish and Fresh Fish delivered hygienically across Chennai. Authentic taste, fresh catch.</p>
            <div className="bg-white/5 rounded-lg p-3 border border-brand-sea/20">
              <div className="bg-white/5 rounded-lg p-3 border border-brand-sea/20">
                <div className="font-black text-brand-sand text-lg">FSSAI</div>
                <p className="text-[10px] text-brand-sea/80">Lic. No. 12423000000000</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Menu</h4>
              <ul className="space-y-3 text-sm text-brand-sea">
                <li><button onClick={() => setView("dry")}>Dry Fish</button></li>
                <li><button onClick={() => setView("fresh")}>Fresh Fish</button></li>
                <li><button onClick={() => setView("about")}>About Us</button></li>
                <li><button onClick={() => setView("contact")}>Contact Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-brand-sea">
                <li><button onClick={() => setView("privacy")}>Privacy Policy</button></li>
                <li><button onClick={() => setView("terms")}>Terms & Conditions</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Contact</h4>
              <p className="text-sm text-brand-sea mb-2">Chennai, Tamil Nadu</p>
              <p className="text-sm text-brand-sea">+{WHATSAPP_NUMBER}</p>
            </div>
          </div>
          <div className="border-t border-brand-ocean/30 pt-8 text-center text-xs text-brand-sea">
            <p>&copy; {new Date().getFullYear()} DRY Fish Chennai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
