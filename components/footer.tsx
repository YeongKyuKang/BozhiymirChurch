"use client" // 이 줄을 파일의 가장 상단에 추가합니다.

import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context" // 번역 적용: useLanguage 훅 추가

export default function Footer() {
  const { t } = useLanguage() // 번역 적용: t 함수 가져오기

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 grid grid-cols-2 gap-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-wide">BOZHIYMIR</span>
                <div className="text-white/80 text-xs font-medium">CHURCH</div>
              </div>
            <div>
                <span className="text-white font-bold text-xl tracking-wide">BOZHIYMIR</span>
                <div className="text-yellow-300 text-sm font-medium">CHURCH</div>
              </div>
            </div>
            <p className="text-blue-200 text-base leading-relaxed">
              {t('FOOTER_WELCOME_COMMUNITY_DESC')}
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
                  123 Community Street
                  <br />
                  Poland, OR 97201
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
                  <p>{t('SUNDAY_SERVICE_TIMES')}</p>
                  <p>{t('WEDNESDAY_SERVICE_TIMES')}</p>
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
  )
}