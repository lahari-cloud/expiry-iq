import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { requestFCMToken, onForegroundMessage } from '../services/firebase';

export default function NotificationBell() {
  const [state, setState] = useState('idle'); // idle | loading | enabled | denied

  const enable = async () => {
    setState('loading');
    try {
      const token = await requestFCMToken();
      await api.post('/auth/fcm-token', { token });
      // Show foreground notifications as browser alerts (optional)
      onForegroundMessage((payload) => {
        const { title, body } = payload.notification || {};
        if (Notification.permission === 'granted') {
          new Notification(title || 'ExpiryAlert', { body, icon: '/icon-192.png' });
        }
      });
      setState('enabled');
    } catch (err) {
      console.error(err);
      setState('denied');
    }
  };

  return (
    <button
      onClick={state === 'idle' || state === 'denied' ? enable : undefined}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition
        ${state === 'enabled'
          ? 'border-teal-500/30 bg-teal-500/10 text-teal-300 cursor-default'
          : state === 'denied'
          ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
      title={state === 'enabled' ? 'Push notifications active' : 'Enable push notifications'}
    >
      {state === 'loading' ? <Loader2 size={15} className="animate-spin" /> :
       state === 'enabled' ? <BellRing size={15} /> :
       state === 'denied'  ? <BellOff  size={15} /> : <Bell size={15} />}
      <span className="hidden sm:inline">
        {state === 'loading' ? 'Enabling…' :
         state === 'enabled' ? 'Alerts on' :
         state === 'denied'  ? 'Blocked' : 'Enable alerts'}
      </span>
    </button>
  );
}
