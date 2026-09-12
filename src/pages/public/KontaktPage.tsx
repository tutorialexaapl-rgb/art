import { Mail, MapPin, Phone } from 'lucide-react';
import { useStaticSeo } from '@/hooks/useSeo';
import { ContactJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function KontaktPage() {
  useStaticSeo('/kontakt');
  const { notify } = useToast();

  return (
    <div className="py-20 lg:py-30">
      <ContactJsonLd />
      <BreadcrumbJsonLd items={[{ name: 'Strona główna', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]} />
      <div className="container-content">
        <Reveal>
          <p className="section-label">Kontakt</p>
          <h1 className="mt-4 font-display text-display text-graphite-600 text-balance">Skontaktuj się z nami</h1>
          <p className="mt-4 max-w-xl text-graphite-400 text-pretty">Masz pytania? Napisz do nas - odpowiadamy w ciągu 24 godzin.</p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <div className="space-y-6">
              {[
                { icon: <Mail className="h-5 w-5" />, label: 'Email', value: 'kontakt@atelier.pl' },
                { icon: <Phone className="h-5 w-5" />, label: 'Telefon', value: '+48 123 456 789' },
                { icon: <MapPin className="h-5 w-5" />, label: 'Adres', value: 'ul. Artystyczna 12, 00-001 Warszawa' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ivory-300 text-graphite-400">{item.icon}</div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-graphite-300">{item.label}</p>
                    <p className="mt-1 text-graphite-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="rounded-2xl border border-graphite-400/10 bg-ivory-50 p-8 shadow-sm">
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); notify('success', 'Wiadomość wysłana. Odpowiemy w ciągu 24 godzin.'); }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Imię i nazwisko" placeholder="Jan Kowalski" required />
                  <Input label="Email" type="email" placeholder="jan@example.com" required />
                </div>
                <Input label="Temat" placeholder="W czym możemy pomóc?" />
                <Textarea label="Wiadomość" rows={5} placeholder="Opisz swoje pytanie..." required />
                <Button type="submit" variant="primary" className="w-full">Wyślij wiadomość</Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
