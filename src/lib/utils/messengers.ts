import type { MessengerType } from '@/types'

export const messengerLinks: Record<MessengerType, (contact: string, msg?: string) => string> = {
  whatsapp: (phone, msg) =>
    `https://wa.me/${phone.replace(/\D/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`,
  telegram: (handle) =>
    `https://t.me/${handle.replace('@', '')}`,
  viber: (phone) =>
    `viber://chat?number=${phone.replace(/\D/g, '')}`,
}

export const MESSENGER_LABELS: Record<MessengerType, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  viber: 'Viber',
}
