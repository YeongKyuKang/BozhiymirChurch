'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

interface FooterProps {
  footerContent: {
    FOOTER_WELCOME_COMMUNITY_DESC?: string;
    SUNDAY_SERVICE_TIMES?: string;
    WEDNESDAY_SERVICE_TIMES?: string;
  };
}

export default function Footer({ footerContent }: FooterProps) {
  const { t } = useLanguage()

  const year = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="relative h-10 w-40 mb-3">
              <Image
                src="images/Bozhiy-Mir_LOGO.png"
                alt="Bozhiymir Church Logo"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={true}
              />
            </div>
            <p className="text-blue-200 text-base leading-relaxed">
              {footerContent?.FOOTER_WELCOME_COMMUNITY_DESC}
            </p>
            <div className="mt-4 text-2xl">🇺🇦</div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">{t('QUICK_LINKS')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/leadership" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  {t('LEADERSHIP')}
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  {t('EVENTS')}
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  {t('JOIN')}
                </Link>
              </li>
              <li>
                <Link
                  href="/ukrainian-ministry"
                  className="text-blue-200 hover:text-yellow-300 transition-colors text-base"
                >
                  {t('UKRAINIAN_MINISTRY')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">{t('CONTACT_INFO')}</h4>
            <div className="space-y-3">
              <div className="flex items-start text-blue-200">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-yellow-300" />
                <span className="text-base">
                  Poloneza 87, 
                  <br />
                  02-826 Warszawa
                </span>
              </div>
              <div className="flex items-center text-blue-200">
                <Phone className="h-5 w-5 mr-3 text-yellow-300" />
                <span className="text-base">(503) 555-0123</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Mail className="h-5 w-5 mr-3 text-yellow-300" />
                <span className="text-base">info@bozhiymirchurch.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">{t('SERVICE_TIMES')}</h4>
            <div className="space-y-2 text-blue-200">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-1 text-yellow-300" />
                <div className="text-base">
                  <p>{footerContent?.SUNDAY_SERVICE_TIMES}</p>
                  <p>{footerContent?.WEDNESDAY_SERVICE_TIMES}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-300">
          <p className="text-base">&copy; {new Date().getFullYear()} {t('BOZHIYMIR_CHURCH_ALL_RIGHTS_RESERVED')}.</p>
        </div>
      </div>
    </footer>
  );
}