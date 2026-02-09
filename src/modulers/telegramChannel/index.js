"use client";
import React, { useEffect, useRef } from "react";
import ClassroominYourPocket from "../home/classroominYourPocket";
import FaqSection from "../home/faqSection";
import TelegramChannelBanner from "./telegramChannelBanner";
import TelegramCommunity from "./telegramCommunity";
import TransparentPricing from "./transparentPricing";
import { useSearchParams } from "next/navigation";

export default function TelegramChannel() {
  const pricingRef = useRef(null);
  const searchParams = useSearchParams();

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const scrollParam = searchParams.get("scroll");
    console.log(scrollParam, "scrollll");
    if (scrollParam === "pricing") {
      console.log("Scrolling to pricing...");
      setTimeout(() => {
        console.log("pricingRef.current:", pricingRef.current);
        if (pricingRef.current) {
          pricingRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [searchParams]);

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
  );
}
