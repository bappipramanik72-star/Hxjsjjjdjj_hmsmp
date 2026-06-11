import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Ticket as TicketIcon, CheckCircle, Sparkles, User, HelpCircle } from 'lucide-react';
import { Ticket, Message } from '../types';

interface SupportHubProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  activeTicketId: string | null;
  onSelectTicket: (ticketId: string | null) => void;
  onAddMessageToTicket: (ticketId: string, message: Message) => void;
  onUpdateTicketStatus: (ticketId: string, status: 'OPEN' | 'RESOLVED') => void;
  onCreateNewTicket: (subject: string, initialMessage: string) => string;
}

export default function SupportHub({
  isOpen,
  onClose,
  tickets,
  activeTicketId,
  onSelectTicket,
  onAddMessageToTicket,
  onUpdateTicketStatus,
  onCreateNewTicket
}: SupportHubProps) {
  const [newSubject, setNewSubject] = useState('');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || null;

  // Auto-scroll inside chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages, loading]);

  if (!isOpen) return null;

  const handleCreateTicketAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMsgContent.trim()) return;

    // Create ticket in local state, setting it active
    const newId = onCreateNewTicket(newSubject.trim(), newMsgContent.trim());
    
    // Clear forms
    setNewSubject('');
    setNewMsgContent('');
    
    // Auto query backend for an initial founder admin response
    triggerGeminiResponse(newId, [
      { id: '1', role: 'user', content: `[Ticket Subject: ${newSubject}] - ${newMsgContent}`, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeTicketId || loading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user's message locally
    onAddMessageToTicket(activeTicketId, userMsg);
    setInputText('');
    setApiError(null);

    // Get updated chronological messages
    const updatedMsgs = [...(activeTicket?.messages || []), userMsg];
    await triggerGeminiResponse(activeTicketId, updatedMsgs);
  };

  const quickQuestions = [
    "What are individual GOD rank perks?",
    "How can I pay using UPI QR Code?",
    "How do I claim my land safety?",
    "What is the server address IP & Port?"
  ];

  const handleQuickQuestionClick = async (question: string) => {
    if (loading || !activeTicketId) return;

    const userMsg: Message = {
      id: "usr_q_" + Date.now(),
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    onAddMessageToTicket(activeTicketId, userMsg);
    setApiError(null);

    const updatedMsgs = [...(activeTicket?.messages || []), userMsg];
    await triggerGeminiResponse(activeTicketId, updatedMsgs);
  };

  const triggerGeminiResponse = async (ticketId: string, messageList: Message[]) => {
    setLoading(true);
    try {
      // Map Message schema to clean backend roles, filtering out system notifications
      const payloadMessages = messageList
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!res.ok) {
        throw new Error('Server returned an API communication error.');
      }

      const data = await res.json();
      const replyText = data.reply || "I am currently polishing up some plugin bundles at spawn. Send another signal in discord ticket!";

      // Add Model's response locally
      const assistantMsg: Message = {
        id: 'gem_' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      onAddMessageToTicket(ticketId, assistantMsg);
    } catch (err: any) {
      console.error(err);
      setApiError('Failed to sync. Pokémon is currently inspecting client buffers.');
      
      // Fallback response for offline resilience
      const errorFallback: Message = {
        id: 'err_fb_' + Date.now(),
        role: 'assistant',
        content: "👋 Pokémon here! My automated buffer is offline, but I see your ticket in our active hub queue. I will review your request shortly! Please feel free to also reach out to our active Staff in the discord server: https://discord.gg/U85qPkYvFB.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessageToTicket(ticketId, errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"></div>

      {/* Slide-out Panel */}
      <div className="relative h-full w-full max-w-2xl border-l border-white/5 bg-slate-900/95 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row text-slate-100">
        
        {/* SIDE BAR: Ticket list */}
        <div className="w-full md:w-64 border-r border-white/5 bg-slate-950/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <span className="font-display text-xs font-bold tracking-widest text-slate-400 uppercase">
                Active Tickets
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-yellow-400 px-2 py-0.5 rounded border border-white/5 uppercase">
                Staff online
              </span>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[180px] md:max-h-[350px] overflow-y-auto pr-1">
              <button
                onClick={() => onSelectTicket(null)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-extrabold tracking-wide uppercase border transition-all ${
                  activeTicketId === null
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
                }`}
              >
                📝 + Open new Ticket
              </button>

              {tickets.map((ticket) => {
                const isActive = activeTicketId === ticket.id;
                const isResolved = ticket.status === 'RESOLVED';
                const isBuyTicket = ticket.subject.toLowerCase().includes('emp-') || ticket.id.toLowerCase().includes('tkt-');
                
                return (
                  <button
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col ${
                      isActive
                        ? 'bg-slate-900 border-white/10 shadow-md'
                        : 'bg-slate-950/70 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] font-bold text-slate-400 select-all">
                        {ticket.id}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        isResolved 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : isBuyTicket ? 'bg-amber-500/10 text-yellow-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-bold text-slate-300 mt-1 pl-0.5 max-w-[180px] truncate leading-none">
                      {ticket.subject}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500 mt-1.5 pl-0.5 leading-none">
                      Created: {ticket.createdAt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <span className="block font-mono text-[8px] font-bold text-slate-500 uppercase tracking-widest pl-1">
              Active Discord support
            </span>
            <a
              href="https://discord.gg/U85qPkYvFB"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 px-3 py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-[10px] font-bold tracking-widest uppercase block text-center shadow-md transition-transform hover:-translate-y-0.5"
            >
              Discord Join Link
            </a>
          </div>
        </div>

        {/* CHAT AREA / CREATE TICKET VIEW */}
        <div className="flex-1 flex flex-col justify-between h-[60vh] md:h-[80vh] lg:h-full">
          
          {/* Top header of selected context */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
            <div>
              <span className="block font-mono text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                {activeTicket ? `Ticket Hub / ${activeTicket.id}` : 'Create Support Ticket'}
              </span>
              <h3 className="font-display text-sm font-extrabold text-white uppercase tracking-wide mt-0.5">
                {activeTicket ? activeTicket.subject : 'Describe your Request'}
              </h3>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* INNER CONTENTS BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTicket ? (
              // Chat thread list
              <>
                {activeTicket.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isSystem = msg.role === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="mx-auto max-w-sm rounded bg-slate-950/60 border border-white/5 p-2.5 text-center">
                        <p className="font-mono text-[10px] text-slate-400 leading-normal pl-0.5">
                          {msg.content}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar icon */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs border ${
                        isUser 
                          ? 'bg-slate-900 border-white/10 text-slate-200' 
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 select-none" />}
                      </div>

                      {/* Msg card */}
                      <div className={`rounded-xl p-3.5 border text-xs shadow-md ${
                        isUser 
                          ? 'bg-yellow-500/10 border-yellow-500/15 text-slate-200' 
                          : 'bg-slate-950/40 border-white/5 text-slate-200'
                      }`}>
                        {/* Sender Label */}
                        <span className="block font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 leading-none select-none">
                          {isUser ? 'Client Player' : 'Pokemon • Fnd Admin'}
                        </span>
                        
                        <p className="leading-relaxed font-sans whitespace-pre-line tracking-wide">
                          {msg.content}
                        </p>

                        <span className="block font-mono text-[9px] text-slate-500 text-right mt-1.5 leading-none">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-start gap-2.5 mr-auto max-w-[85%]">
                    <div className="h-8 w-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs">
                      <Sparkles className="h-4 w-4 animate-spin select-none" />
                    </div>
                    <div className="rounded-xl p-3.5 bg-slate-950/40 border border-white/5 text-xs text-slate-400 font-sans tracking-wide">
                      <span className="block font-sans text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1 leading-none select-none">
                        Pokemon is answering...
                      </span>
                      <div className="flex items-center space-x-1.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce duration-300"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce duration-300 delay-100"></span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce duration-300 delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}

                {apiError && (
                  <p className="text-center font-mono text-[10px] text-red-400">
                    {apiError}
                  </p>
                )}

                {/* Quick suggestions, only shown if the bot is not active loading */}
                {!loading && (
                  <div className="pt-2 px-1 pb-1">
                    <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-0.5 select-none font-sans">
                      💡 Quick Support FAQ suggestions:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickQuestionClick(q)}
                          id={`quick_q_${idx}`}
                          className="px-2.5 py-1.5 rounded-md bg-slate-950/80 hover:bg-slate-900 border border-white/5 hover:border-yellow-500/20 text-[10px] font-semibold text-slate-300 hover:text-yellow-400 text-left transition-all cursor-pointer leading-tight"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            ) : (
              // Create Subject view form
              <form onSubmit={handleCreateTicketAction} className="space-y-4 pt-2">
                <p className="text-xs text-slate-400 pl-1 font-sans leading-normal">
                  Need rank support, purchase assistance, or answers about plugin permissions? Raise a virtual ticket to consult with Pokemon (Founder) instantly.
                </p>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                    Ticket Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Problems with credit card checkout / Rank check"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-950 p-3 text-xs font-semibold rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-yellow-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                    Detail Statement <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    placeholder="Provide exact details of your issue. Mention your Minecraft Username."
                    rows={5}
                    value={newMsgContent}
                    onChange={(e) => setNewMsgContent(e.target.value)}
                    className="w-full bg-slate-950 p-3 text-xs font-semibold rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-yellow-500/50 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="ticket_launch_btn"
                  className="w-full py-3.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <TicketIcon className="h-4 w-4" />
                  <span>Launch Ticket Connection</span>
                </button>
              </form>
            )}
          </div>

          {/* INPUT BAR FOR REPLIES */}
          {activeTicket && (
            <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-slate-950/40">
              <div className="flex items-center space-x-2 bg-slate-950 rounded-lg p-2 border border-slate-800 focus-within:border-yellow-500/50">
                <input
                  type="text"
                  placeholder="Ask Pokémon a question... (e.g. how many blocks can GOD ranks mine?)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={loading}
                  id="chat_input"
                  className="flex-1 bg-transparent px-2 text-xs font-semibold text-slate-200 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  id="chat_send_btn"
                  className="flex h-8 w-8 items-center justify-center rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
