'use client'

import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n-context'

export function DynamicTitle() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = `Zuzia Inc. | ${t('hero.description')}`
  }, [t])

  return null
}
