import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useNoIndex } from '@/hooks/useNoIndex';

export function SuspendedPage() {
  useNoIndex();
  const { signOut } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory-100 px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/5 text-error">
        <ShieldOff className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl text-graphite-600">Konto zawieszone</h1>
      <p className="mt-3 max-w-sm text-sm text-graphite-400">
        Twoje konto zostało zawieszone. Jeśli uważasz, że to błąd, skontaktuj się z zespołem Atelier.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/kontakt"><Button variant="secondary">Kontakt</Button></Link>
        <Button variant="ghost" onClick={() => signOut()}>Wyloguj się</Button>
      </div>
    </div>
  );
}
