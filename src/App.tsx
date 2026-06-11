import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Shops from './components/Shops';
import Team from './components/Team';
import CartModal from './components/CartModal';
import SupportHub from './components/SupportHub';
import { ShopItem, CartItem, Ticket, Message } from './types';
import { Sparkles, ShoppingBag, ShieldCheck, Gamepad2, ArrowRight } from 'lucide-react';
import { DISCORD_LINK, ALIVE_PLAYERS } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('store');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  // Initialize Tickets in LocalState
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const savedTickets = localStorage.getItem('emp_smp_tickets_v1');
    if (savedTickets) {
      try {
        return JSON.parse(savedTickets);
      } catch (e) {
        console.error('Failed to parse local stored tickets, resetting.');
      }
    }

    return [
      {
        id: 'TKT-9999',
        subject: 'General Assistant Queue',
        status: 'OPEN',
        createdAt: new Date().toLocaleDateString(),
        messages: [
          {
            id: 'init_sys',
            role: 'system',
            content: 'Connection to Empire SMP support hub established. Staff online.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: 'init_bot',
            role: 'assistant',
            content: 'Hey there! Pokémon here, Founder of Empire SMP. 👋 Welcome to our support terminal! Need answers about GOD ranks, claim protection zones, maces, or paying with UPI/PayPal? Ask me anything below!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }
    ];
  });

  // Sync tickets to localStorage
  useEffect(() => {
    localStorage.setItem('emp_smp_tickets_v1', JSON.stringify(tickets));
  }, [tickets]);

  // Load Cart from localStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('emp_smp_cart_v1');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse local stored cart.');
      }
    }
  }, []);

  // Sync Cart to localStorage
  const saveCartLocally = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('emp_smp_cart_v1', JSON.stringify(updatedCart));
  };

  // Add Item to cart
  const handleAddToCart = (item: ShopItem) => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCartLocally(updated);
    } else {
      const updated = [...cart, { item, quantity: 1 }];
      saveCartLocally(updated);
    }
    // Also open checkout drawer automatically for fluid conversions
    setCartOpen(true);
  };

  // Buy Now (Adds to cart & opens checkout instantly)
  const handleInstantBuy = (item: ShopItem) => {
    const existingIndex = cart.findIndex((c) => c.item.id === item.id);
    if (existingIndex === -1) {
      saveCartLocally([...cart, { item, quantity: 1 }]);
    }
    setCartOpen(true);
  };

  // Remove Item from cart
  const handleRemoveItem = (itemId: string) => {
    const updated = cart.filter((c) => c.item.id !== itemId);
    saveCartLocally(updated);
  };

  // Clear entire cart
  const handleClearCart = () => {
    saveCartLocally([]);
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updated = cart.map((c) => {
      if (c.item.id === itemId) {
        return { ...c, quantity: qty };
      }
      return c;
    });
    saveCartLocally(updated);
  };

  // Create a support Ticket
  const handleCreateNewTicket = (subject: string, initialMessageStr: string): string => {
    const rndTicket = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket: Ticket = {
      id: rndTicket,
      subject,
      status: 'OPEN',
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: 'sys_' + Date.now(),
          role: 'system',
          content: `New support ticket context ${rndTicket} opened.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'usr_init_' + Date.now(),
          role: 'user',
          content: initialMessageStr,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicketId(rndTicket);
    setSupportOpen(true);
    return rndTicket;
  };

  // Append a message to a ticket
  const handleAddMessageToTicket = (ticketId: string, message: Message) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [...t.messages, message]
          };
        }
        return t;
      })
    );
  };

  // Resolve or open ticket status
  const handleUpdateTicketStatus = (ticketId: string, status: 'OPEN' | 'RESOLVED') => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return { ...t, status };
        }
        return t;
      })
    );
  };

  // On payment checkout confirmation succeed (Spawns ticket & clears cart)
  const handlePaymentSuccess = (details: { paymentMethod: string; orderId: string; ticketId: string; ign: string; totalPaid: number }) => {
    const { paymentMethod, orderId, ticketId, ign, totalPaid } = details;

    const itemsSummary = cart.map((c) => `${c.quantity}x ${c.item.name}`).join(', ');

    // Compile customized automated buy-ticket
    const deliveryTicket: Ticket = {
      id: ticketId,
      subject: `Order ${orderId} Delivery check`,
      status: 'OPEN',
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: 'sys_' + Date.now(),
          role: 'system',
          content: `Automated transaction proof register for Order Reference Code: ${orderId}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'usr_slip_' + Date.now(),
          role: 'user',
          content: `⚡ Minecraft Username: ${ign}\n📌 Purchased Assets: ${itemsSummary}\n💳 Gateway Provider: ${paymentMethod}\n💰 Subtotal Charged: ₹${totalPaid}\n\nTransaction complete. Checking dispatch logs...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'bot_receipt_' + Date.now(),
          role: 'assistant',
          content: `Hey ${ign}! Pokémon here. I've received your transaction details of ₹${totalPaid} via ${paymentMethod}! 💎\n\nI have automatically queued your order for game delivery. Your items (${itemsSummary}) are dispatched to the server plugins. Just log on to play.empiresmp.shop:25589 for automatic claim additions.\n\nType some greetings here if you need custom enchanted gear adjustments. Thank you so much for supporting our cluster!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    // Add this buy ticket at the top of active tickets
    setTickets((prev) => [deliveryTicket, ...prev]);
    setActiveTicketId(ticketId);
    
    // Clear the shopping basket
    handleClearCart();
    
    // Prompt support window!
    setSupportOpen(true);
  };

  const cartItemIds = new Set<string>(cart.map((c) => c.item.id));

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-sans flex flex-col justify-between">
      
      {/* 1. Header Toolbar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          // scroll to store or team or features smoothly
          const el = document.getElementById(sec === 'store' ? 'shop_section' : sec);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onOpenSupport={() => {
          setSupportOpen(true);
          // set default welcome ticket active
          if (tickets.length > 0) {
            setActiveTicketId(tickets[0].id);
          }
        }}
      />

      {/* 2. Top Interactive Hero Display */}
      <Hero onExploreStore={() => {
        const block = document.getElementById('shop_section');
        if (block) block.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Main Body block layouts */}
      <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900/10 to-slate-950 pb-16">
        
        {/* Features spotlight */}
        <Features />

        {/* Categories of Shops Store */}
        <Shops
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          cartItemIds={cartItemIds}
        />

        {/* Our staff directory portal */}
        <Team />

        {/* Secondary prompt banner promoting safe trade */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 sm:p-8 backdrop-blur-sm text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-yellow-500 uppercase tracking-widest block pl-0.5">
                Empire SMP Network security
              </span>
              <h3 className="font-display text-lg font-extrabold text-white uppercase tracking-wider">
                Non-Affiliation & Security Rules
              </h3>
              <p className="max-w-2xl text-[11px] sm:text-xs text-slate-400 font-sans tracking-wide leading-relaxed">
                We are not affiliated with Mojang Studios AB or Microsoft Corporation. All premium checkouts directly support cluster hosting, anti-DDoS networks, and custom plugin licenses. Thank you!
              </p>
            </div>
            
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-slate-950 hover:bg-slate-900 font-extrabold tracking-widest text-[11px] uppercase border border-white/5 whitespace-nowrap text-yellow-400 flex items-center space-x-1"
            >
              <span>Contact Tickets</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>

      </main>

      {/* 3. Footer element signature block */}
      <footer className="bg-slate-950 border-t border-white/5 py-10 font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-4">
          <div className="flex items-center justify-center space-x-1.5 select-none text-xs text-slate-500 font-mono">
            <span>👑</span>
            <span>&bull;</span>
            <span>💎</span>
            <span>&bull;</span>
            <span>🔥</span>
            <span>&bull;</span>
            <span>⚔️</span>
            <span>&bull;</span>
            <span>🚀</span>
            <span>&bull;</span>
            <span>⭐</span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; 2026 Empire SMP. All ranks and claim block assets deliver automatically. All rights reserved.
          </p>

          <p className="text-[10px] font-mono text-slate-600 tracking-wider uppercase select-none">
            crafted with absolute precision
          </p>
        </div>
      </footer>

      {/* 4. Overlay Drawer checkout panel modal */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onUpdateQuantity={handleUpdateQuantity}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 5. Support Hub Multi-turn Gemini chatbot Ticket Portal */}
      <SupportHub
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        tickets={tickets}
        activeTicketId={activeTicketId}
        onSelectTicket={(id) => setActiveTicketId(id)}
        onAddMessageToTicket={handleAddMessageToTicket}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        onCreateNewTicket={handleCreateNewTicket}
      />

    </div>
  );
}
