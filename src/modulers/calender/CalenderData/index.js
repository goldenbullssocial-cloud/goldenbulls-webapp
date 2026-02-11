"use client";
import React, { useEffect, useRef, memo } from "react";
import styles from "./calendarData.module.scss";

function CalendarData() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: false,
      locale: "en",
      countryFilter:
        "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
      importanceFilter: "-1,0,1",
      width: "100%",
      height: "600",
    });

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className={styles.calendarDataAlignment}>
      <div className="container-md">
        <div className={styles.widgetWrapper}>
          <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
              <a
                href="https://www.tradingview.com/economic-calendar/"
                rel="noopener nofollow"
                target="_blank"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CalendarData);
