import { Check, Sparkles } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { Reveal } from '@/components/ui/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function CennikPage() {
  useStaticSeo('/cennik');
  return (
    <div className="py-20 lg:py-30">
      <div className="container-content">
        <Reveal>
          <div className="text-center">
            <Badge color="gold"><Sparkles className="h-3 w-3" /> Wszystko darmowe na start</Badge>
            <h1 className="mt-6 font-display text-display text-graphite-600 text-balance">Cennik</h1>
            <p className="mx-auto mt-4 max-w-xl text-graphite-400 text-pretty">Na początku wszystkie funkcje są darmowe. Docelowo planujemy płatne publikowanie zleceń, wyróżnienia i subskrypcje.</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              name: 'Zlecający', price: '0 zł', period: 'na zawsze', current: true,
              features: ['Publikowanie zleceń', 'Otrzymywanie ofert', 'Dashboard realizacji', 'Wiadomości z artystą', 'Płatności przez Stripe (docelowo)'],
            },
            {
              name: 'Artysta', price: '0 zł', period: 'na start', highlight: true,
              features: ['Profil i portfolio', 'Przeglądanie zleceń', 'Komentarze i zdjęcia', 'Wysyłanie ofert', 'Dashboard realizacji', 'Weryfikacja konta'],
            },
            {
              name: 'Premium (planowany)', price: '-', period: 'wkrótce',
              features: ['Wyróżnienie profilu', 'Priorytet w zleceniach', 'Płatne aplikacje artystów', 'Tokeny i kredyty', 'Subskrypcja', 'Analytics'],
            },
          ].map((plan, i) => (
            <Reveal key={plan.name} delay={(i + 1) as 1 | 2 | 3}>
              <div className={`rounded-2xl border p-8 ${plan.highlight ? 'border-gold-400/30 bg-gold-50 shadow-lg' : 'border-graphite-400/10 bg-ivory-50 shadow-sm'}`}>
                {plan.highlight && <Badge color="gold" className="mb-4">Polecane</Badge>}
                <h3 className="font-display text-xl text-graphite-600">{plan.name}</h3>
                <p className="mt-4 font-display text-4xl text-graphite-600">{plan.price}</p>
                <p className="mt-1 text-sm text-graphite-300">{plan.period}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-graphite-500">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-3 w-3" /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button variant={plan.highlight ? 'gold' : 'secondary'} className="w-full">Załóż konto</Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
