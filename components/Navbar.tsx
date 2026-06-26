'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';


export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

    if (data.user) {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', data.user.id)
    .eq('read', false);

  setUnreadCount(count || 0);

  const { count: messageCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', data.user.id)
    .eq('read', false);

  setUnreadMessagesCount(messageCount || 0);
}

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();

        if (profile?.username) {
          setUsername(profile.username);
        }
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUsername('');
    window.location.href = '/';
  }

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/frame-icon.png"
            alt="Frame"
            className="h-9 w-9 rounded-xl"
          />
          <span className="text-lg font-bold tracking-wide text-white">
            FRAME
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">

  {user && (
    
    
    <Link href="/home" className="hover:text-white">
      Home
    </Link>
    
  )}
<Link href="/search">
  <div className="flex w-48 items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-500 hover:border-white/20">
    🔍
    Search creators...
  </div>
</Link>
  <Link href="/explore" className="hover:text-white">
    Explore
  </Link>
 
 

          {user ? (
            <>
              <Link href="/upload" className="hover:text-white">
                Upload
              </Link>

              <Link href="/upload-story" className="hover:text-white">
  Upload Story
</Link>

        
<Link href="/messages" className="relative hover:text-white">
  Messages

  {unreadMessagesCount > 0 && (
    <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
      {unreadMessagesCount}
    </span>
  )}
</Link>

             <Link href="/notifications" className="relative hover:text-white">
  Notifications

  {unreadCount > 0 && (
    <span className="absolute -right-4 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
      {unreadCount}
    </span>
  )}
</Link>

              {username && (
                <Link href={`/profile/${username}`} className="hover:text-white">
                  My Profile
                </Link>
              )}

              <button onClick={handleLogout} className="hover:text-white">
                Logout
              </button>
              <Link href="/settings" className="hover:text-white">
  Settings
</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>

              <Link href="/signup" className="hover:text-white">
                Sign Up
              </Link>
              

              <a
                href="https://apps.apple.com/app/frame-creative-network/id6777236011"
                target="_blank"
                className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-zinc-200"
              >
                Download App
              </a>
            </>
          )}
        </div>
        <button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white md:hidden"
>
  Menu
</button>
      </div>
      {mobileMenuOpen && (
  <div className="border-t border-white/10 bg-black px-6 py-4 md:hidden">
    <div className="flex flex-col gap-4 text-sm text-zinc-300">
      {user && <Link href="/home">Home</Link>}
      <Link href="/explore">Explore</Link>
      <Link href="/search">Search</Link>

      {user ? (
        <>
          <Link href="/upload">Upload</Link>
          <Link href="/upload-story">Upload Story</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/notifications">Notifications</Link>
          {username && <Link href={`/profile/${username}`}>My Profile</Link>}
          <Link href="/settings">Settings</Link>
          <button onClick={handleLogout} className="text-left">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </div>
  </div>
)}
    </nav>
  );
}