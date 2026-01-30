"use client";
import React, { useRef } from 'react'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'
import TelegramChannelBanner from './telegramChannelBanner'
import TelegramCommunity from './telegramCommunity'
import TransparentPricing from './transparentPricing'

export default function TelegramChannel() {
    const pricingRef = useRef(null);

    const scrollToPricing = () => {
        pricingRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div>
            <TelegramChannelBanner onSubscribeClick={scrollToPricing} />
            <TelegramCommunity />
            <div ref={pricingRef}>
                <TransparentPricing />
            </div>
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
