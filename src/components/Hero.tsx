import React, { useState } from 'react';
import { Copy, Check, Gamepad2, ArrowRight } from 'lucide-react';
import { SERVER_IP, DISCORD_LINK, ALIVE_PLAYERS, STAFF } from '../data';

export default function Hero({ onExploreStore }: { onExploreStore: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  return (
    <div id="hero_section" className="relative overflow-hidden bg-slate-950 py-16 lg:py-24">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/src/assets/images/empire_hero_1781180443768.png"
          alt="Empire SMP Fantasy Keep"
          className="h-full w-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Radial Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        
        {/* Little status badge */}
        <div className="mx-auto mb-6 inline-flex items-center space-x-2 rounded-full border border-yellow-500/15 bg-yellow-500/5 px-4 py-1.5 backdrop-blur-md">
          <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
          <span className="font-mono text-xs font-semibold text-yellow-300 tracking-wider uppercase">
            🔥 Version 1.20 - 1.21.x Survival SMP
          </span>
        </div>

        {/* Big styled Crown head title / Logo */}
        <div className="mx-auto mb-4 flex justify-center max-w-[340px] sm:max-w-[440px] md:max-w-[500px]">
          <img
            src="/src/assets/images/empire_logo_1781181748680.jpg"
            alt="Empire SMP Logo"
            className="w-full h-auto object-contain select-none filter drop-shadow-[0_12px_24px_rgba(234,179,8,0.25)] hover:scale-[1.03] active:scale-[0.98] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="sr-only">EMPIRE SMP</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg tracking-wide leading-relaxed font-sans">
          The ultimate Minecraft survival network where empires rise and trade legends are born. Claim territory, forge custom enchanted armor, master the mace, and rule the leaderboards.
        </p>

        {/* Interactive Copy IP Block */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="flex flex-col sm:flex-row items-stretch space-y-3 sm:space-y-0 sm:space-x-2 rounded-xl bg-slate-900/80 p-2.5 border border-white/5 backdrop-blur-md shadow-xl">
            <div className="flex flex-1 items-center justify-between px-3 py-2 bg-slate-950/90 rounded-lg border border-white/5">
              <div className="flex items-center space-x-2.5">
                <Gamepad2 className="h-4.5 w-4.5 text-yellow-400" />
                <span className="font-mono text-[13px] font-bold text-slate-200 tracking-wider">
                  {SERVER_IP}
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded uppercase border border-emerald-500/20">
                online
              </div>
            </div>

            <button
              onClick={handleCopyIp}
              id="hero_copy_ip_btn"
              className="flex items-center justify-center space-x-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 stroke-[3]" />
                  <span>Copy IP</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-2.5 text-[11px] font-mono text-slate-400 font-medium tracking-wide">
            Add this IP to your Minecraft server multiplayer list to play!
          </p>
        </div>

        {/* Actions Button Row */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={onExploreStore}
            id="hero_buy_btn"
            className="group flex items-center space-x-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 px-7 py-3 py-3.5 text-sm font-extrabold uppercase tracking-wider shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span>Explore Ranks & Shop</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            id="hero_discord_link"
            className="flex items-center space-x-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider shadow-md transition-transform hover:-translate-y-0.5"
          >
            <span>Join Our Discord</span>
          </a>
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-14 max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
          <div>
            <div className="font-display text-2xl font-bold text-yellow-400">₹0 Fee</div>
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-1">To Join Play</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-yellow-400">100% Secure</div>
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-1">UPI / PayPal</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-yellow-400">24/7 Hosting</div>
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-1">No Lag Network</div>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-yellow-400">{STAFF.length} STAFF</div>
            <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest mt-1">Active Admins</div>
          </div>
        </div>

      </div>
    </div>
  );
}
