import React from 'react';
import { ShoppingCart, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { ShopItem } from '../types';
import { RANKS, CLAIM_BLOCKS, MACES, IN_GAME_MONEY } from '../data';

interface ShopsProps {
  onAddToCart: (item: ShopItem) => void;
  onInstantBuy: (item: ShopItem) => void;
  cartItemIds: Set<string>;
}

export default function Shops({ onAddToCart, onInstantBuy, cartItemIds }: ShopsProps) {
  const [activeTab, setActiveTab] = React.useState<'ranks' | 'claims' | 'maces' | 'money'>('ranks');

  const categories = [
    { id: 'ranks', label: '👑 Server Ranks', items: RANKS },
    { id: 'claims', label: '🛡️ Claim Blocks', items: CLAIM_BLOCKS },
    { id: 'maces', label: '🔨 Mace Shop', items: MACES },
    { id: 'money', label: '💵 IG Money Store', items: IN_GAME_MONEY },
  ] as const;

  const currentCategory = categories.find((cat) => cat.id === activeTab)!;

  return (
    <div id="shop_section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      
      {/* Visual Shop Divider */}
      <div className="text-center mb-10">
        <div className="font-mono text-[11px] font-bold text-yellow-500 tracking-widest uppercase mb-1">
          💎 ⚡ OFFICIAL RANK SHOP ⚡ 💎
        </div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white uppercase">
          Empire SMP Store
        </h2>
        <p className="mx-auto mt-2.5 max-w-md text-xs text-slate-400 font-sans tracking-wide leading-relaxed">
          Unlock supreme permissions, claim larger coordinates perimeters, or stock your faction safe with powerful custom combat weapons.
        </p>
      </div>

      {/* Categories Tab Selector Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-2 border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`tab_select_${cat.id}`}
            onClick={() => setActiveTab(cat.id)}
            className={`cursor-pointer rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border transition-all duration-200 ${
              activeTab === cat.id
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 border-yellow-400 font-extrabold shadow-lg shadow-yellow-500/[0.05]'
                : 'bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900 border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid displaying the active items */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentCategory.items.map((item) => {
          const isRank = item.type === 'rank';
          const isInCart = cartItemIds.has(item.id);

          return (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-slate-900/25 backdrop-blur-md hover:border-white/10 transition-all duration-300 group`}
            >
              
              {/* Optional Top colored stripe or banner for Ranks */}
              {isRank && item.color && (
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.color}`}></div>
              )}

              <div className="p-5.5">
                
                {/* Header title area of item */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="block font-sans text-xs font-semibold text-yellow-500 tracking-wider">
                      {item.tagline || item.type.toUpperCase()}
                    </span>
                    <h3 className="mt-1 font-display text-base font-extrabold text-slate-100 group-hover:text-yellow-400 transition-colors uppercase">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 border border-white/5 text-lg select-none">
                    {item.emoji}
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-slate-300 font-sans tracking-wide leading-relaxed">
                  {item.description}
                </p>

                {/* Inner specifications list */}
                <ul className="mt-5 space-y-2.5">
                  {item.perks.map((perk, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[11px] text-slate-400 font-sans tracking-wide leading-normal">
                      <div className="mt-0.5 rounded bg-emerald-500/10 p-0.5 border border-emerald-500/15">
                        <Check className="h-2.5 w-2.5 text-emerald-400 stroke-[3]" />
                      </div>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Price Tag and actions footer block */}
              <div className="mt-auto border-t border-white/5 bg-slate-950/40 p-5 leading-none">
                
                {/* Price Display */}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Price Tag
                  </span>
                  <div className="flex items-center space-x-0.5">
                    <span className="font-display text-xl font-black text-yellow-400 leading-none">
                      ₹{item.price}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                      inr
                    </span>
                  </div>
                </div>

                {/* Grid row of Action Commands */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onAddToCart(item)}
                    id={`add_to_cart_${item.id}`}
                    className={`flex items-center justify-center space-x-1 border rounded-lg px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                      isInCart
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-950 hover:text-white'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-3 w-3 stroke-[3]" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3" />
                        <span>Add Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onInstantBuy(item)}
                    id={`instant_buy_${item.id}`}
                    className="flex cursor-pointer items-center justify-center space-x-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-widest transition-colors shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Ticket note label */}
      <p className="mt-8 text-center text-xs text-slate-500 font-sans tracking-wide">
        📩 DM ME TO BUY OTHER EXCLUSIVE OFFERS &bull; Contact: 
        <button onClick={() => {
          const supportBtn = document.getElementById('nav_btn_support');
          if (supportBtn) supportBtn.click();
        }} className="text-yellow-400 inline-flex items-center ml-1 font-bold underline hover:text-yellow-300 transition-colors">
          "Create Ticket To Buy"
        </button>
      </p>

    </div>
  );
}
