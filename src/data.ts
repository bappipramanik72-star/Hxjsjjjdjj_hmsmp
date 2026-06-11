import { ShopItem, TeamMember } from './types';

export const SERVER_IP = 'play.empiresmp.shop:25589';
export const ALIVE_PLAYERS = 42;
export const MAX_PLAYERS = 100;
export const DISCORD_LINK = 'https://discord.gg/U85qPkYvFB';

export const RANKS: ShopItem[] = [
  {
    id: 'rank_god',
    name: 'GOD Rank',
    price: 299,
    type: 'rank',
    tagline: '👑 1st • GOD RANK',
    description: 'The Ultimate Premium King status on Empire SMP. Unlock ultimate power and custom mining abilities.',
    emoji: '👑',
    color: 'from-yellow-400 to-amber-600',
    badge: 'ULTIMATE',
    perks: [
      'Tunnel 3 custom mining: Mine 9 blocks at once (3x3 grid)',
      'Full Netherite Kit containing God Tier Armour & Sword',
      '3x Custom Enchantment books with ancient keys',
      'Exclusive Golden Name & Chat Prefix: [GOD]',
      'Priority Queue Access (Bypass server full blocks)',
      'Keep Experience on death (XP Insurance)'
    ]
  },
  {
    id: 'rank_mvp',
    name: 'MVP Rank',
    price: 90,
    type: 'rank',
    tagline: '🚀 2nd • MVP RANK',
    description: 'Become a highly regarded server champion with magnificent starter benefits.',
    emoji: '⚡',
    color: 'from-cyan-400 to-blue-600',
    badge: 'CHAMPION',
    perks: [
      'Full Netherite Kit containing custom tools & sword',
      '64x Enchanted Golden Apples (God Apples) instantly',
      'Custom MVP Prefix with Cyan Name glow',
      'Permitted access to coordinate logging commands',
      '/fly ability enabled in Spawn territory',
      'Custom particle trails (Flame & Aura)'
    ]
  },
  {
    id: 'rank_grinder',
    name: 'GRINDER Rank',
    price: 60,
    type: 'rank',
    tagline: '⚔️ 3rd • GRINDER RANK',
    description: 'The perfect choice for extremely active, combat-oriented survival players.',
    emoji: '⚔️',
    color: 'from-purple-500 to-indigo-700',
    badge: 'ACTIVE',
    perks: [
      'Full Diamond Gear suit containing custom weapons',
      '7x Totem of Undying for combat-protection rescue',
      '20x Golden Apples (Enchanted) for health restoration',
      'Custom purple [Grinder] prefix chat highlight',
      '3x Homes enabled (/sethome grinder1, grinder2, etc.)'
    ]
  },
  {
    id: 'rank_explorer',
    name: 'EXPLORER Rank',
    price: 40,
    type: 'rank',
    tagline: '🗺️ 4th • EXPLORER RANK',
    description: 'Perfect introductory starter rank to get ahead of the standard wilderness competition.',
    emoji: '🗺️',
    color: 'from-emerald-400 to-teal-600',
    badge: 'STARTER',
    perks: [
      'Premium Diamond kit featuring excellent tool/armor presets',
      'Great for stater players starting out in raw wilderness',
      'Green [Explorer] title badge prefix in player tab',
      'Access to basic kits and fast wilderness teleports'
    ]
  }
];

export const CLAIM_BLOCKS: ShopItem[] = [
  {
    id: 'claim_500',
    name: '500 Claim Blocks',
    price: 20,
    type: 'claim',
    description: 'Secure your builds! Land claims prevent griefing, stealing, and modification from other players.',
    emoji: '🛡️',
    perks: ['Claim up to 500 blocks of land', 'Protects from TNT and fire spread', 'Perfect for a cozy cottage base.']
  },
  {
    id: 'claim_1000',
    name: '1000 Claim Blocks',
    price: 35,
    type: 'claim',
    description: 'Expand your empire! Ensure a massive perimeter is secured from griefers.',
    emoji: '🛡️',
    perks: ['Claim up to 1000 blocks of land', 'Permit friends with custom permissions', 'Ideal for a medium castle or village base.']
  },
  {
    id: 'claim_1500',
    name: '1500 Claim Blocks',
    price: 50,
    type: 'claim',
    description: 'Grand empire layout. Claim substantial mountain peaks or biome fields.',
    emoji: '🏰',
    perks: ['Claim up to 1500 blocks of land', 'Build automatic farms without griefing risk', 'Ultimate fortress protection.']
  },
  {
    id: 'claim_2000',
    name: '2000 Claim Blocks',
    price: 70,
    type: 'claim',
    description: 'Supreme Land Protection! Absolute kingdom scale coverage.',
    emoji: '👑',
    perks: ['Claim up to 2000 blocks of land', 'Establish multi-player faction headquarters', 'Highest block package.']
  }
];

export const MACES: ShopItem[] = [
  {
    id: 'mace_1',
    name: '1x Heavy Mace',
    price: 50,
    type: 'mace',
    description: 'Incredible crushing damage! Dominate standard Survival PvP with a powerful heavy mace.',
    emoji: '🔨',
    perks: ['1x Premium Mace weapon', 'Deals devastating smash damage from heights', 'Custom physical texture support.']
  },
  {
    id: 'mace_2',
    name: '2x Dual Maces',
    price: 100,
    type: 'mace',
    description: 'Amass tactical leverage in team fights. Stock up with 2 heavy maces.',
    emoji: '🔨',
    perks: ['2x Premium Mace weapons', 'Perfect for backup armaments or gifting team allies', 'Save compared to buying separately']
  },
  {
    id: 'mace_5',
    name: '5x Mace Arsenal',
    price: 250,
    type: 'mace',
    description: 'Full team deployment! Equip your active faction with a fully-fledged heavy mace armory.',
    emoji: '🔥',
    perks: ['5x Premium Mace weapons', 'Full faction armory setup', 'Ultimate combat dominance!']
  }
];

export const IN_GAME_MONEY: ShopItem[] = [
  {
    id: 'money_100k',
    name: '100,000 In-game Cash',
    price: 40,
    type: 'money',
    description: 'Boost your balance! Purchase high-value blocks, custom heads, and minerals in spawned stores.',
    emoji: '💵',
    perks: ['₹100,000 cash added directly to `/bal`', 'Bypass the grinding step', 'Trade with other players instantly']
  },
  {
    id: 'money_200k',
    name: '200,000 In-game Cash',
    price: 80,
    type: 'money',
    description: 'Build robust player stores and buy rare drops from dynamic auctions.',
    emoji: '💸',
    perks: ['₹200,000 cash added directly to `/bal`', 'Fulfill elite survival upgrades', 'Purchase high-tech spawners']
  },
  {
    id: 'money_400k',
    name: '400,000 In-game Cash',
    price: 150,
    type: 'money',
    description: 'Get rich and buy anything you need in spawn markets. Save ₹10.',
    emoji: '💰',
    perks: ['₹400,000 cash added directly to `/bal`', 'Become an economic titan', 'Buy multiple claims and items easily']
  },
  {
    id: 'money_500k',
    name: '500,000 In-game Cash',
    price: 170,
    type: 'money',
    description: 'Top tier wealth! Claim massive player contracts or rule spawn auction boards.',
    emoji: '💳',
    perks: ['₹500,000 cash added directly to `/bal`', 'Great discount rate', 'Buy elite tier assets effortlessly']
  },
  {
    id: 'money_1m',
    name: '1,000,000 In-game Cash',
    price: 340,
    type: 'money',
    description: 'Mega Millionaire Empire Legend! Complete economic dominate on the board.',
    emoji: '🏦',
    perks: ['₹1,000,000 cash added directly to `/bal`', 'Fulfill all server upgrades instantly', 'Buy legendary customized items']
  }
];

export const STAFF: TeamMember[] = [
  {
    name: 'SHADOWXER01',
    role: 'OWNER',
    skin: 'SHADOWXER01',
    quote: 'Server Owner and Executive Administrator. Overseeing global systems, high-tier configurations, and keeping the network standard at its absolute peak.',
    focus: 'OVERALL OPERATIONS / ARCHITECTURE',
    badgeColor: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400',
    headingColor: 'text-purple-400'
  },
  {
    name: 'POKEMON',
    role: 'FOUNDER',
    skin: 'Pokemon35', // Yellow skin matching profile Pikachu avatar
    quote: 'Server Founder overseeing development timelines, core system operations, funding, and overall Empire SMP vision.',
    focus: 'EMPIRE SMP FOUNDER / FUNDING',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-yellow-300',
    headingColor: 'text-yellow-400'
  },
  {
    name: 'RANDEEP ROYAL',
    role: 'ADMIN',
    skin: 'Randeep', // Steve styled admin
    quote: '"I am Cooking!" Overseeing daily server operations, player permissions, event coordinates, and premium tickets support.',
    focus: 'SERVER ADMINISTRATION / HOSTING',
    badgeColor: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-400',
    headingColor: 'text-amber-500'
  },
  {
    name: 'RAKSH X OG',
    role: 'ADMIN',
    skin: 'Raksh', // Blue avatar hoodie skin
    quote: '"Dc server making only [30r] dm me." Core administrator managing high-security roles, community discord setups, and support setups.',
    focus: 'DISCORD SETUP & BOT TECH',
    badgeColor: 'bg-gradient-to-r from-orange-600 to-rose-600 text-white border-rose-400',
    headingColor: 'text-rose-400'
  },
  {
    name: 'コ:彡 ADI😈DON',
    role: 'ADMIN',
    skin: 'AdiDon', // Purple/dark themed skin
    quote: 'Server Administrator focused on player safety, coordinate logging, spam control, and direct in-game player support.',
    focus: 'RULES & SUPPORT COORDINATION',
    badgeColor: 'bg-gradient-to-r from-red-600 to-purple-600 text-white border-red-400',
    headingColor: 'text-red-400'
  },
  {
    name: 'JHULAN',
    role: 'DEVELOPER',
    skin: 'Jhulan', // Dev skin
    quote: 'Core Developer in charge of custom plugins integration, performance optimizations, bug patches, and API configurations.',
    focus: 'SERVER DEVELOPMENT',
    badgeColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400',
    headingColor: 'text-emerald-400'
  },
  {
    name: 'EAGLE',
    role: 'HELPER',
    skin: 'Eagle', // Helper skin
    quote: 'Dedicated Helper answering user support tickets, welcoming newcomers, and verifying community guidelines compliance.',
    focus: 'PLAYER ASSISTANCE',
    badgeColor: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400',
    headingColor: 'text-cyan-400'
  }
];
