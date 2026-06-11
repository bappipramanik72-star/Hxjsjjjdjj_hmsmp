import React from 'react';
import { ShoppingCart, Compass, Shield, Phone, Users, ShieldAlert, Sparkles, MessageCircleCode } from 'lucide-react';
import { CartItem } from '../types';
import { SERVER_IP, ALIVE_PLAYERS } from '../data';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenSupport: () => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  activeSection,
  setActiveSection,
  onOpenSupport
}: NavbarProps) {
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const navItems = [
    { id: 'store', label: 'Store', icon: ShoppingCart },
    { id: 'team', label: 'Staff Team', icon: Users },
    { id: 'features', label: 'Features', icon: Compass },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveSection('store')} 
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav_brand"
        >
          <div className="relative flex h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-tr from-yellow-500 to-amber-600 p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-200">
            <img
              src="/src/assets/images/empire_logo_1781181748680.jpg"
              alt="👑"
              className="h-full w-full object-cover rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-extrabold tracking-wider text-yellow-400 uppercase leading-none">
              Empire <span className="text-white">SMP</span>
            </span>
            <span className="font-mono text-[9px] font-semibold text-slate-400 tracking-widest uppercase">
              Official Store
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-1.5 rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            id="nav_btn_support"
            onClick={onOpenSupport}
            className="flex items-center space-x-1.5 rounded-lg px-4 py-2 text-sm font-medium tracking-wide text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-200"
          >
            <MessageCircleCode className="h-4 w-4 text-rose-400" />
            <span>Support Chat</span>
          </button>
        </div>

        {/* Right Section: Status Indicator & Cart Container */}
        <div className="flex items-center space-x-4">
          
          {/* Server Connection Status Banner */}
          <div className="hidden sm:flex items-center space-x-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-400 tracking-wider">
              {ALIVE_PLAYERS}/{100} PLAYERS
            </span>
          </div>

          <button
            id="nav_btn_support_mobile"
            onClick={onOpenSupport}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-rose-400 transition-colors"
            title="Open Support Chat"
          >
            <MessageCircleCode className="h-5 w-5 text-rose-400" />
          </button>

          {/* Cart Icon widget */}
          <button
            id="nav_cart_btn"
            onClick={onOpenCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5 stroke-[2.5]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}
