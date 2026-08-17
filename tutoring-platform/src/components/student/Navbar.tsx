'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { FaYoutube, FaInstagram, FaEnvelope } from 'react-icons/fa';
import LocaleToggle from '@/components/common/LocaleToggle';
import { SOCIAL_LINKS, GMAIL_CONFIG } from '@/data/site-config';
import { CTA } from '@/lib/cta';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const userRole = user?.role || '';

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/80 py-2 shadow-warm-sm border-b border-border-subtle backdrop-blur-md'
          : 'bg-transparent py-3'
      }}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/pk_sir_logo.jpg"
                alt="PK Singh Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">Home</Link>
            <Link href="/about" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">About</Link>
            <Link href="/courses" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">Courses</Link>
            <Link href="/free-videos" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">Free Videos</Link>
            <Link href="/blog" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">Blog</Link>
            <Link href="/faq" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">FAQ</Link>
            {user && (userRole === 'STUDENT' || userRole === 'MENTOR' || userRole === 'INSTRUCTOR') && (
              <Link href="/my-courses" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">My Courses</Link>
            )}
            <Link href="/#how" className="text-ink-secondary hover:text-brand-600 transition-colors text-sm font-medium">How It Works</Link>
          </div>

          {/* Desktop Right Side Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Social icons */}
            <div className="flex items-center gap-3 pr-2 mr-2 border-r border-border-subtle">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our YouTube channel"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href={GMAIL_CONFIG.composeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email us for queries"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="Email for queries"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
            <LocaleToggle />
            {user ? (
              <div className="flex items-center gap-4">
                {(userRole === 'SUPER_ADMIN' || userRole === 'INSTRUCTOR' || userRole === 'MENTOR') && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-semibold tracking-wide uppercase transition-all duration-300"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold uppercase">{user.fullName[0]}</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-ink">{user.fullName}</span>
                    <span className="text-[10px] text-ink-muted font-medium capitalize leading-none">{user.role.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-ink-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-ink-secondary hover:text-brand-600 px-3 py-2 text-sm font-medium transition-colors">Sign In</Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white text-sm font-semibold tracking-wide transition-all shadow-md duration-300"
                >
                  {CTA.FREE_SIGNUP}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-ink-muted hover:text-ink hover:bg-bg-subtle focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full bg-bg-base shadow-2xl animate-slide-in-right overflow-y-auto border-l border-border-subtle">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border-subtle">
              <Image src="/images/pk_sir_logo.jpg" alt="PK Singh" width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-ink-muted hover:text-ink hover:bg-bg-subtle">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-3 pt-3 pb-6 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">Home</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">About</Link>
              <Link href="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">Courses</Link>
              <Link href="/free-videos" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">Free Videos</Link>
              <Link href="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">Blog</Link>
              <Link href="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">FAQ</Link>
              <Link href="/#how" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-all">How It Works</Link>
            </div>

            {/* Mobile locale */}
            <div className="px-6 py-4 border-t border-border-subtle flex items-center gap-4">
              <LocaleToggle />
            </div>

            {/* Mobile social icons */}
            <div className="px-6 py-4 border-t border-border-subtle flex items-center gap-5">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our YouTube channel"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href={GMAIL_CONFIG.composeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email us for queries"
                className="text-ink-muted hover:text-brand-600 transition-colors"
                title="Email for queries"
              >
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>

            {user ? (
              <div className="pt-4 pb-2 border-t border-border-subtle px-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold uppercase">{user.fullName[0]}</span>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-ink">{user.fullName}</div>
                    <div className="text-xs text-ink-muted">{user.email}</div>
                  </div>
                </div>
                {(userRole === 'SUPER_ADMIN' || userRole === 'INSTRUCTOR' || userRole === 'MENTOR') && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-border-subtle px-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 rounded-lg border border-border-strong text-ink-secondary hover:text-ink text-sm font-semibold transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all shadow-md"
                >
                  {CTA.FREE_SIGNUP}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
