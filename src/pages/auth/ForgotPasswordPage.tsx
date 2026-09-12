import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function ForgotPasswordPage() {
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout title="Resetuj hasło" description="Wyślemy Ci link do resetowania hasła.">
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-sm text-graphite-500">Link do resetowania hasła został wysłany na <strong>{email}</strong>.</p>
          <Link to="/login" className="mt-6 inline-flex"><Button variant="secondary">Wróć do logowania</Button></Link>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); notify('success', 'Link wysłany.'); }} className="space-y-5">
          <Input label="Email" type="email" placeholder="jan@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} required />
          <Button type="submit" variant="primary" className="w-full">Wyślij link <ArrowRight className="h-4 w-4" /></Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-graphite-400 hover:text-graphite-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Wróć do logowania
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const { notify } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <AuthLayout title="Nowe hasło" description="Ustaw nowe hasło dla swojego konta.">
      <form onSubmit={(e) => { e.preventDefault(); if (password !== confirm) { notify('error', 'Hasła nie są zgodne.'); return; } notify('success', 'Hasło zmienione.'); }} className="space-y-5">
        <Input label="Nowe hasło" type="password" placeholder="min. 8 znaków" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <Input label="Powtórz hasło" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
        <Button type="submit" variant="primary" className="w-full">Zmień hasło</Button>
      </form>
    </AuthLayout>
  );
}
