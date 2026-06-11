import React from 'react';
import { STAFF } from '../data';
import { ShieldCheck, Flame, Stars, Users } from 'lucide-react';

export default function Team() {
  return (
    <div id="team" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-white/5">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-white uppercase">
          ⚔️ Meet The <span className="text-yellow-400">Empire SMP Team</span> ⚔️
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-400 tracking-wide font-sans">
          Our administrative staff and developers work diligently to support server hosting, manage Discord communities, and coordinate global survival dynamics.
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STAFF.map((member) => {
          // Construct official Minecraft skin avatar API URL
          const avatarUrl = `https://mc-heads.net/avatar/${member.skin}/128`;
          
          return (
            <div
              key={member.name}
              className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-md hover:border-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/[0.02] transition-all duration-300 group"
            >
              {/* Outer top highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-500/15 to-transparent"></div>

              <div>
                
                {/* Skin block */}
                <div className="flex justify-center mb-5">
                  <div className="relative h-18 w-18 overflow-hidden rounded-lg bg-slate-950 p-1.5 border border-white/5 group-hover:scale-105 transition-transform duration-200 shadow-xl">
                    <img
                      src={avatarUrl}
                      alt={`${member.name} Skin`}
                      className="h-full w-full object-contain image-render-pixelated"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // fallback to default Steve face if avatar fails
                        (e.target as HTMLImageElement).src = `https://mc-heads.net/avatar/Steve/128`;
                      }}
                    />
                  </div>
                </div>

                {/* Team member name */}
                <div className="text-center mb-3">
                  <h3 className="font-display text-base font-extrabold tracking-widest text-slate-100 uppercase group-hover:text-yellow-400 transition-colors">
                    {member.name}
                  </h3>
                  
                  {/* Badge */}
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest border ${member.badgeColor} mt-1.5 shadow-md`}>
                    {member.role}
                  </span>
                </div>

                {/* Quote block */}
                <p className="text-center text-xs text-slate-300 font-sans tracking-wide leading-relaxed italic px-2 py-4 mb-4 select-none relative">
                  "{member.quote}"
                </p>

              </div>

              {/* Specialty details row */}
              <div className="mt-auto border-t border-white/5 pt-4 bg-slate-950/20 rounded-b-lg">
                <div className="text-center">
                  <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Specialty Focus
                  </span>
                  <span className={`block font-mono text-xs font-bold ${member.headingColor} uppercase tracking-wider mt-1`}>
                    {member.focus}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Roster statement footer element from Image 5 */}
      <div className="mx-auto mt-12 max-w-2xl text-center border-t border-white/5 pt-8">
        <p className="text-xs text-slate-400 italic font-sans px-4 select-none">
          "Our team works around the clock to support standard updates, combat hackers, organize coordinates, and run community giveaways. Huge thank you to all Empire patrons!"
        </p>
      </div>

    </div>
  );
}
