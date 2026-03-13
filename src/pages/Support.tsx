import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, HelpCircle, Send, ChevronDown } from 'lucide-react';

export default function Support() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'ticket'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const faqs = [
    {
      question: 'How do I get started on CoinKrazy?',
      answer: 'Sign up on our registration page with your email and password. You\'ll receive a welcome bonus of 10,000 GC + 5 SC to start playing all our games!'
    },
    {
      question: 'What is GC and SC?',
      answer: 'GC (Game Coins) are our premium currency used for gameplay and tournaments. SC (Sweepstakes Coins) are our secondary currency that can be redeemed for real-world rewards.'
    },
    {
      question: 'How do I earn more coins?',
      answer: 'You can earn coins by: 1) Playing games and winning, 2) Daily login bonuses, 3) Referral program (invite friends), 4) Completing achievements, 5) Participating in tournaments'
    },
    {
      question: 'How do I cash out my winnings?',
      answer: 'You can redeem your SC through our Wallet page. Go to Wallet > Redeem, enter your amount, choose a payment method (CashApp, Google Pay, etc.), and complete KYC verification. Withdrawals are processed within 1-3 business days.'
    },
    {
      question: 'What is KYC verification?',
      answer: 'KYC (Know Your Customer) is a security verification process required for withdrawals. You\'ll need to submit a valid ID, proof of address, and a selfie. This helps us prevent fraud and comply with regulations.'
    },
    {
      question: 'Why was my account suspended?',
      answer: 'Accounts may be suspended for: 1) Violating our terms of service, 2) Suspicious activity or fraud detection, 3) Failure to complete KYC, 4) Community guideline violations. Contact support for specific details.'
    },
    {
      question: 'How do tournaments work?',
      answer: 'Tournaments are periodic competitions where players compete for prize pools. Entry may be free or require a fee. Leaderboards track top performers, and prizes are distributed after the tournament ends.'
    },
    {
      question: 'Can I play for free?',
      answer: 'Yes! You get a generous welcome bonus and can earn more through daily bonuses, bonuses, and achievements. You can also participate in daily free tournaments.'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');

    try {
      // Send support request to backend
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      setContactStatus('success');
      setContactForm({ email: '', subject: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Support form error:', error);
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-slate-900 to-zinc-950 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
            <HelpCircle className="w-10 h-10 text-emerald-400" />
            Support Center
          </h1>
          <p className="text-gray-300 text-lg">Get help with your account, games, and more</p>
        </div>

        {/* Quick Contact Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <button
            onClick={() => setActiveTab('faq')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              activeTab === 'faq'
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <HelpCircle className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
            <h3 className="font-bold text-white mb-1">FAQs</h3>
            <p className="text-sm text-gray-400">Common questions & answers</p>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              activeTab === 'contact'
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Mail className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
            <h3 className="font-bold text-white mb-1">Contact Us</h3>
            <p className="text-sm text-gray-400">Send us a message</p>
          </button>

          <div className="p-6 rounded-2xl border-2 border-zinc-800">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
            <h3 className="font-bold text-white mb-1">Live Chat</h3>
            <p className="text-sm text-gray-400">Available 24/7</p>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'faq' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 bg-zinc-800/30 hover:bg-zinc-800/50 flex items-center justify-between transition-colors"
                  >
                    <h3 className="font-semibold text-white text-left">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-emerald-400 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-zinc-900/20 border-t border-zinc-800">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Contact Support</h2>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={5}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={contactStatus === 'loading'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {contactStatus === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500 rounded-xl p-4 text-emerald-400">
                  ✓ Message sent! We'll get back to you within 24 hours.
                </div>
              )}

              {contactStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 text-red-400">
                  ✗ Error sending message. Please try again.
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <h3 className="font-bold text-white mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span>support@coinkrazy.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>1-800-COIN-KRAZY (available 9 AM - 5 PM EST)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span>Live chat available 24/7 in the bottom right corner</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span> Account & Security
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Change your password</li>
              <li>• Enable two-factor authentication</li>
              <li>• Manage connected accounts</li>
              <li>• Report suspicious activity</li>
            </ul>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🎮</span> Games & Gameplay
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Game rules and mechanics</li>
              <li>• How RTP works</li>
              <li>• Responsible gaming resources</li>
              <li>• Report a bug or issue</li>
            </ul>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> Payments & Withdrawals
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Deposit methods</li>
              <li>• Withdrawal limits</li>
              <li>• KYC verification help</li>
              <li>• Transaction history</li>
            </ul>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span> Policies
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Terms of Service</li>
              <li>• Privacy Policy</li>
              <li>• Responsible Gaming Policy</li>
              <li>• Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
