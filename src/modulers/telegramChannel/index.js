import React from 'react'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'
import TelegramChannelBanner from './telegramChannelBanner'
import TelegramCommunity from './telegramCommunity'
import TransparentPricing from './transparentPricing'

export default function TelegramChannel() {
    return (
        <div>
            <TelegramChannelBanner />
            <TelegramCommunity />
            <TransparentPricing />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
