// src/components/layout/Footer.tsx
import { useTranslations } from "next-intl";
import { Link } from "@/routing";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const tNav = useTranslations("nav");
  const tLoc = useTranslations("location");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-gray-700 shadow-2xl">
                <Image 
                  src="/images/logo/logo.jpg" 
                  alt="Hotel Río Yurubí Logo" 
                  fill 
                  className="object-cover"
                  unoptimized
                  sizes="48px"
                />
              </div>


              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                Hotel Río Yurubí
              </h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Tu refugio natural en el corazón de Yaracuy. Disfruta de la tranquilidad del Parque Nacional Yurubí con la mejor atención y comodidad.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-green transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-green transition-colors"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/habitaciones" className="hover:text-white transition-colors">
                  {tNav("rooms")}
                </Link>
              </li>
              <li>
                <Link href="/restaurante" className="hover:text-white transition-colors">
                  {tNav("restaurant")}
                </Link>
              </li>
              <li>
                <Link href="/reservar" className="hover:text-brand-green text-brand-green-100 transition-colors">
                  {tNav("bookNow")}
                </Link>
              </li>
              <li>
                <Link href="/promociones" className="hover:text-white transition-colors">
                  {tNav("promotions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">
              Nuestros Servicios
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/piscina" className="hover:text-white transition-colors">
                  {tNav("pool")}
                </Link>
              </li>
              <li>
                <Link href="/sala-de-reuniones" className="hover:text-white transition-colors">
                  {tNav("meetingRoom")}
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-white transition-colors">
                  {tNav("gallery")}
                </Link>
              </li>
              <li>
                <Link href="/opiniones" className="hover:text-white transition-colors">
                  {tNav("reviews")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">{tNav("contact")}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <span>{tLoc("address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <span>{tLoc("phone")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <span>{tLoc("email")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {currentYear} Hotel Río Yurubí. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Políticas de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/login" className="hover:text-brand-blue transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
