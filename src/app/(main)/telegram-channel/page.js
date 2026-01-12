import TelegramChannel from '@/modulers/telegramChannel'
import React from 'react'

export const metadata = {
  title: "Telegram Channel - Golden Bulls",
  description: "Join our Telegram channel for real-time trading signals, market updates, and exclusive content from Golden Bulls.",
  keywords: "telegram trading, trading signals, market alerts, trading community",
};

export default function page() {
    return (
        <div>
            <TelegramChannel />
        </div>
    )
}
