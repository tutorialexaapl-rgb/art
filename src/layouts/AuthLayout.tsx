import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Palette } from 'lucide-react';
import { useNoIndex } from '@/hooks/useNoIndex';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  sidebar?: boolean;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  useNoIndex();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-graphite-600 p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400 text-graphite-700">
              <Palette className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-medium text-ivory-100">Artiors</span>
          </Link>
        </div>
        <div className="relative">
          <blockquote className="font-display text-3xl text-ivory-100 leading-tight text-pretty max-w-md">
            „Każdy obraz zaczyna się od rozmowy. Artiors to miejsce, gdzie ta rozmowa staje się sztuką."
          </blockquote>
          <p className="mt-6 font-mono text-xs uppercase tracking-ultra-wide text-gold-300">- Artiors, 2025</p>
        </div>
        <div className="relative grid grid-cols-3 gap-6">
          {[
            { num: '120+', label: 'Artystów' },
            { num: '450+', label: 'Realizacji' },
            { num: '98%', label: 'Zadowolonych klientów' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl text-gold-300">{stat.num}</p>
              <p className="mt-1 text-xs text-graphite-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite-600 text-ivory-100">
              <Palette className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-medium text-graphite-600">Artiors</span>
          </Link>
          <h1 className="font-display text-3xl text-graphite-600">{title}</h1>
          <p className="mt-2 text-sm text-graphite-400">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
