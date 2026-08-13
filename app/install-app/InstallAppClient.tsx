'use client';

import { useEffect, useState } from 'react';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export default function InstallAppClient() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    window.addEventListener('beforeinstallprompt', ready);
    return () => window.removeEventListener('beforeinstallprompt', ready);
  }, []);
  async function install() {
    if (!prompt) { setMessage('Use your browser menu and choose “Install app” or “Add to Home Screen”.'); return; }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setMessage(choice.outcome === 'accepted' ? 'globltools is being installed.' : 'Installation was cancelled.');
    setPrompt(null);
  }
  return <div><button onClick={install} className="min-h-14 rounded-xl bg-emerald-700 px-7 font-bold text-white hover:bg-teal-800">Install GloblTools</button>{message ? <p className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700" role="status">{message}</p> : null}</div>;
}
