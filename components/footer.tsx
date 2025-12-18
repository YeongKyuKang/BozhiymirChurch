'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

export default function Footer() {
  const { t } = useLanguage()

  // 반복되는 서비스 목록 정의
  const serviceKeys = ['main', 'youth', 'kids', 'prayer']

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. 교회 소개 */}
          <div className="space-y-4">
            <div className="relative h-12 w-48">
              <Image
                src="/images/Bozhiy-Mir_LOGO.png"
                alt="Bozhiymir Church Logo"
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={true}
              />
            </div>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* 2. 빠른 링크 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-300 border-b border-yellow-500/30 pb-2 inline-block">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {['leadership', 'events', 'join', 'ukrainian_ministry'].map((link) => (
                <li key={link}>
                  <Link href={`/${link}`} className="text-blue-200 hover:text-yellow-300 transition-colors text-base flex items-center gap-2">
                    <span className="text-yellow-500 text-[10px]">▶</span> {t(`footer.links.${link}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. 연락처 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-300 border-b border-yellow-500/30 pb-2 inline-block">
              {t('footer.contact_title')}
            </h4>
            <div className="space-y-5">
              <div className="flex items-start text-blue-200">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-yellow-300" />
                <span className="text-sm md:text-base">
                  {t('footer.address_line1')}<br />{t('footer.address_line2')}
                </span>
              </div>
              <div className="flex items-start text-blue-200">
                <Phone className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-yellow-300" />
                <div className="text-xs md:text-sm space-y-1">
                  <p>{t('footer.Contact Info_ru')}</p>
                  <p>{t('footer.Contact Info_ko')}</p>
                </div>
              </div>
              <div className="flex items-center text-blue-200">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-300" />
                <span className="text-sm md:text-base break-all">{t('footer.email')}</span>
              </div>
            </div>
          </div>

          {/* 4. 상세 예배 시간 (Title / Desc 분리 버전) */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-yellow-300 border-b border-yellow-500/30 pb-2 inline-block">
              {t('footer.service_title')}
            </h4>
            <div className="space-y-5">
              {serviceKeys.map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-1 flex-shrink-0 text-yellow-400" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm md:text-base">
                      {t(`footer.services.${key}.title`)}
                    </span>
                    <span className="text-blue-200 text-xs md:text-sm leading-snug">
                      {t(`footer.services.${key}.desc`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 저작권 */}
        <div className="border-t border-blue-700/50 mt-12 pt-8 text-center text-blue-300 text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
