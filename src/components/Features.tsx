import React from 'react';
import { Shield, Sparkles, Sword, Coins, HelpCircle } from 'lucide-react';

export default function Features() {
  const highlights = [
    {
      title: 'Land Claiming',
      desc: 'Protect your bases, chests, and farms from potential griefing. Claim blocks are available in the official server shop to extend your secure zones.',
      icon: Shield,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15'
    },
    {
      title: 'Mace PvP Combat',
      desc: 'Harness the gravity-smashing power of heavy survival maces. Engage in epic player fights, coordinate guild warfare, and lead combat leaderboards.',
      icon: Sword,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/15'
    },
    {
      title: 'Dynamic Player Economy',
      desc: 'Sell, auction, and trade hard-mined blocks or rare custom enchantment books. Top up your balance in the game cash store!',
      icon: Coins,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/15'
    },
    {
      title: 'Premium Custom Enchantments',
      desc: 'Amass specialized powers like Tunnel 3 on the supreme GOD rank of Empire. Mine entire 3x3 stone fields automatically at one single strike!',
      icon: Sparkles,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15'
    }
  ];

  return (
    <div id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-white/5">
      
      {/* Header section */}
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white uppercase">
          Empire SMP <span className="text-yellow-400">Gameplay Mechanics</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-400 tracking-wide font-sans leading-relaxed">
          Unlock standard upgrades, optimize blocks collection efficiency, and claim ultimate dominance through our uniquely optimized gaming environment.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-slate-800 transition-all duration-200"
            >
              <div className={`p-3 rounded-lg border w-fit ${feat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-slate-200 tracking-wide">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs text-slate-400 font-sans tracking-wide leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Server Roadmap / Future Expansion Timeline */}
      <div className="mt-20 border-t border-white/5 pt-16" id="roadmap_section">
        <div className="text-center mb-10">
          <div className="mx-auto mb-3 inline-flex items-center space-x-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full border border-yellow-500/20 text-[10px] font-bold tracking-widest uppercase">
            🚀 Network Future Roadmap
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white uppercase">
            Upcoming Expansion <span className="text-yellow-400">Milestones</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-400 tracking-wide font-sans leading-relaxed">
            Take a sneak peek at the new game modes, plugins, and custom updates designed by our developer staff!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              phase: 'Phase 1 • In Development',
              title: 'Aether & Slime Dungeons',
              desc: 'Custom instanced portal gate dungeons hosting legendary mobs, tier-based trials, and exclusive custom weapon drops.',
              status: '75%',
              color: 'border-yellow-500/20 hover:border-yellow-500/40'
            },
            {
              phase: 'Phase 2 • Planning Stage',
              title: 'Dynamic Chest Shop Rentals',
              desc: 'Offline trading hubs. Rent market slots at Spawn, deposit custom items, and watch your server balance rise automatically!',
              status: '40%',
              color: 'border-blue-500/20 hover:border-blue-500/40'
            },
            {
              phase: 'Phase 3 • Queue Pipeline',
              title: 'Imperial Guild Kingdoms',
              desc: 'Form official alliances, wage tactical guild warfare on our massive claim blocks territories, and rule our leaderboards.',
              status: '15%',
              color: 'border-purple-500/20 hover:border-purple-500/40'
            },
            {
              phase: 'Phase 4 • Conceptual',
              title: 'Empire Cosmetics & Trails',
              desc: 'Prebuilt custom fire trails, golden head hats, legendary death animations, and visual wings to flex your GOD rank status.',
              status: 'Concept',
              color: 'border-emerald-500/20 hover:border-emerald-500/40'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              id={`roadmap_card_${idx}`}
              className={`relative flex flex-col justify-between p-5 rounded-lg border bg-gradient-to-b from-slate-900/60 to-slate-950/60 ${item.color} backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                    {item.phase}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-slate-950 text-yellow-400 border border-white/5">
                    {item.status}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-slate-100">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
