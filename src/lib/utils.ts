export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency', currency: 'PLN',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'przed chwilą';
  const intervals: [number, string][] = [
    [31536000, 'rok'], [2592000, 'miesiąc'], [604800, 'tydzień'],
    [86400, 'dzień'], [3600, 'godzinę'], [60, 'minutę'],
  ];
  for (const [s, label] of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${polishPlural(count, label)} temu`;
  }
  return 'przed chwilą';
}

function polishPlural(count: number, singular: string): string {
  const forms: Record<string, [string, string, string]> = {
    'rok': ['rok', 'lata', 'lat'],
    'miesiąc': ['miesiąc', 'miesiące', 'miesięcy'],
    'tydzień': ['tydzień', 'tygodnie', 'tygodni'],
    'dzień': ['dzień', 'dni', 'dni'],
    'godzinę': ['godzinę', 'godziny', 'godzin'],
    'minutę': ['minutę', 'minuty', 'minut'],
  };
  const f = forms[singular];
  if (!f) return singular;
  if (count === 1) return f[0];
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return f[1];
  return f[2];
}

export function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function truncate(text: string, length: number): string {
  return text.length <= length ? text : text.slice(0, length).trimEnd() + '…';
}

export function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
