"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import SunCalc from "suncalc";
import {
  SESSIONS,
  TIMEZONES,
  getTimezoneOffset,
  getTimezoneAbbr,
  formatOffsetString,
  getCurrentTimeInTz,
  formatTime,
  formatDay,
  formatDateShort,
  isSessionOpen,
  getSessionBarPosition,
  getVolumeDataForTimezone,
  getVolumeLevel,
} from "@/utils/forex-utils";
import styles from "./forexMarketHours.module.scss";

const ForexMarketHours = () => {
  const [selectedTz, setSelectedTz] = useState("Asia/Kolkata");
  const [use24h, setUse24h] = useState(true);
  const [now, setNow] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [manualTimePosition, setManualTimePosition] = useState(null);
  const [manualTime, setManualTime] = useState(null);
  const timelineRef = React.useRef(null);

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  const tzOffset = getTimezoneOffset(selectedTz, now);
  const currentTimeInTz = getCurrentTimeInTz(selectedTz);
  const currentTimezone = TIMEZONES.find((t) => t.value === selectedTz);
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();
  const sunriseLocalHour = 4;
  const sunsetLocalHour = 15;

  const sunriseHour = (((sunriseLocalHour - tzOffset) % 24) + 24) % 24;
  const sunsetHour = (((sunsetLocalHour - tzOffset) % 24) + 24) % 24;

  const displayTime = manualTime || currentTimeInTz;
  const localHour = displayTime.getHours();
  const localMinute = displayTime.getMinutes();
  const localSecond = displayTime.getSeconds();
  const currentPosition =
    manualTimePosition ??
    ((localHour + localMinute / 60 + localSecond / 3600) / 24) * 100;

  const volumeData = useMemo(
    () => getVolumeDataForTimezone(tzOffset),
    [tzOffset],
  );
  const currentVolume =
    volumeData[Math.floor(localHour + localMinute / 60) % 24];
  const volumeLevel = getVolumeLevel(currentVolume);

  // Calculate traffic light color based on current volume (graph color)
  const getTrafficLightColor = useCallback(() => {
    const currentHourIndex = Math.floor(localHour + localMinute / 60) % 24;
    const currentVolume = volumeData[currentHourIndex];

    if (currentVolume >= 70) return "high"; // Green in graph
    if (currentVolume >= 40) return "medium"; // Yellow in graph
    return "low"; // Red in graph
  }, [volumeData, localHour, localMinute]);

  const trafficLightColor = getTrafficLightColor();

  const getTzLabel = useCallback((tz) => {
    const tzData = TIMEZONES.find((t) => t.value === tz);
    const name = tzData?.label || tz;
    const offset = tzData?.offset || "";
    return `${name} (${offset})`;
  }, []);

  const buildVolumePath = useMemo(() => {
    if (!volumeData || volumeData.length < 2) return "";

    const points = volumeData.map((v, i) => ({
      x: (i / (volumeData.length - 1)) * 100,
      y: 100 - v,
    }));

    // Simple smooth curves with consistent thickness
    let d = `M ${points[0].x} ${points[0].y}`;
    const smoothing = 0.2;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) * smoothing;
      const cp1y = p1.y + (p2.y - p0.y) * smoothing;

      const cp2x = p2.x - (p3.x - p1.x) * smoothing;
      const cp2y = p2.y - (p3.y - p1.y) * smoothing;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }, [volumeData]);
  const volumeAreaPath = useMemo(
    () => `${buildVolumePath} L 100 100 L 0 100 Z`,
    [buildVolumePath],
  );

  // Generate dynamic gradient stops based on volume data
  const generateGradientStops = useCallback(() => {
    if (!volumeData || volumeData.length < 2) return [];

    const stops = [];
    const step = 100 / (volumeData.length - 1);

    volumeData.forEach((volume, index) => {
      const offset = index * step;
      let color;

      if (volume >= 70) {
        color = "#22c55e10"; // Green for high
      } else if (volume >= 40) {
        color = "#f59e0b10"; // Yellow for medium
      } else {
        color = "#ef444410"; // Red for low
      }

      stops.push(
        <stop
          key={`fill-${index}`}
          offset={`${offset}%`}
          stopColor={color}
          stopOpacity={volume >= 70 ? "0.7" : volume >= 40 ? "0.5" : "0.3"}
        />,
      );
    });

    return stops;
  }, [volumeData]);

  const generateStrokeStops = useCallback(() => {
    if (!volumeData || volumeData.length < 2) return [];

    const stops = [];
    const step = 100 / (volumeData.length - 1);

    volumeData.forEach((volume, index) => {
      const offset = index * step;
      let color;

      if (volume >= 70) {
        color = "#22c55e"; // Green for high
      } else if (volume >= 40) {
        color = "#f59e0b"; // Yellow for medium
      } else {
        color = "#ef4444"; // Red for low
      }

      stops.push(
        <stop
          key={`stroke-${index}`}
          offset={`${offset}%`}
          stopColor={color}
        />,
      );
    });

    return stops;
  }, [volumeData]);

  const getVolumeYAtCurrent = () => {
    const frac = (localHour + localMinute / 60) / 24;
    const idx = frac * 23;
    const lower = Math.floor(idx);
    const upper = Math.min(lower + 1, 23);
    const t = idx - lower;
    return 100 - (volumeData[lower] * (1 - t) + volumeData[upper] * t);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const timelineX = rect.left + 200; // Account for session info width
      const timelineWidth = rect.width - 200;

      if (e.clientX >= timelineX && e.clientX <= timelineX + timelineWidth) {
        const relativeX = e.clientX - timelineX;
        const percentage = (relativeX / timelineWidth) * 100;
        setManualTimePosition(Math.max(0, Math.min(100, percentage)));

        // Calculate manual time from position
        const hoursInDay = (percentage / 100) * 24;
        const hours = Math.floor(hoursInDay);
        const minutes = Math.floor((hoursInDay - hours) * 60);

        const newManualTime = new Date(displayTime);
        newManualTime.setHours(hours, minutes, 0, 0);
        setManualTime(newManualTime);
      }
    },
    [isDragging, displayTime],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setManualTimePosition(null);
      setManualTime(null);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={styles["forex-container"]}>
      <div className={styles["forex-card"]}>
        {/* Header */}
        <div className={styles["forex-header"]}>
          <div>
            <h1 className={styles["forex-header__title"]}>
              Forex Market Time Zone Converter
            </h1>
          </div>
          <div className={styles["toggle-container"]}>
            <span>24 Hour Time</span>
            <div
              className={`${styles["toggle-switch"]} ${use24h ? styles["active"] : ""}`}
              onClick={() => setUse24h(!use24h)}
            >
              <div className={styles["toggle-switch__knob"]} />
            </div>
          </div>
        </div>

        {/* Timezone selector */}
        <div className={styles["timezone-selector"]}>
          <span className={styles["timezone-selector__label"]}>Timezone</span>
          <div className={styles["timezone-selector__dropdown"]}>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {getTzLabel(tz.value)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline area - wrapper for current time line to span everything */}
        <div
          ref={timelineRef}
          className={styles["timeline-area"]}
          style={{ position: "relative" }}
        >
          {/* Current time vertical line spanning full timeline area */}
          <div
            className={`${styles["current-time-line"]} ${isDragging ? styles["current-time-line--dragging"] : ""}`}
            style={{
              left: `calc(200px + (100% - 200px) * ${currentPosition / 100})`,
              top: 0,
              bottom: 0,
              position: "absolute",
              cursor: isDragging ? "grabbing" : "grab",
              pointerEvents: "auto",
            }}
            onMouseDown={handleMouseDown}
          >
            <div className={styles["time-bubble"]}>
              <div className={styles["time-bubble__clock"]}>
                <svg viewBox="0 0 100 100" className={styles["clock-face"]}>
                  {/* Clock face */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="white"
                    stroke="rgba(0, 0, 0, 0.74)"
                    strokeWidth="1"
                  />
                  {/* Hour markers */}
                  {[...Array(12)].map((_, i) => {
                    const angle = i * 30 - 90;
                    const x1 = 50 + 40 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                    const y2 = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="rgba(0, 0, 0, 1).5)"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {/* Hour hand */}
                  <line
                    x1="50"
                    y1="50"
                    x2={
                      50 +
                      25 *
                        Math.cos(
                          (((localHour % 12) * 30 + localMinute * 0.5 - 90) *
                            Math.PI) /
                            180,
                        )
                    }
                    y2={
                      50 +
                      25 *
                        Math.sin(
                          (((localHour % 12) * 30 + localMinute * 0.5 - 90) *
                            Math.PI) /
                            180,
                        )
                    }
                    stroke="rgba(0, 0, 0, 0.8)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Minute hand */}
                  <line
                    x1="50"
                    y1="50"
                    x2={
                      50 +
                      35 * Math.cos(((localMinute * 6 - 90) * Math.PI) / 180)
                    }
                    y2={
                      50 +
                      35 * Math.sin(((localMinute * 6 - 90) * Math.PI) / 180)
                    }
                    stroke="rgba(0, 0, 0, 0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Center dot */}
                  <circle cx="50" cy="50" r="3" fill="rgba(0, 0, 0, 0.9)" />
                </svg>
              </div>
              <div className={styles["time-bubble__time"]}>
                {formatTime(displayTime, use24h)}
              </div>
              <div className={styles["time-bubble__day"]}>
                {formatDay(displayTime)}
              </div>
            </div>

            {/* Traffic lights indicator */}
            <div className={styles["traffic-lights"]}>
              <div
                className={`${styles["traffic-light"]} ${trafficLightColor === "high" ? styles["traffic-light--active"] : ""} ${styles["traffic-light--green"]}`}
              >
                <div className={styles["traffic-light__glow"]}></div>
              </div>
              <div
                className={`${styles["traffic-light"]} ${trafficLightColor === "medium" ? styles["traffic-light--active"] : ""} ${styles["traffic-light--yellow"]}`}
              >
                <div className={styles["traffic-light__glow"]}></div>
              </div>
              <div
                className={`${styles["traffic-light"]} ${trafficLightColor === "low" ? styles["traffic-light--active"] : ""} ${styles["traffic-light--red"]}`}
              >
                <div className={styles["traffic-light__glow"]}></div>
              </div>
            </div>
          </div>

          {/* Spacer for bubble */}
          <div style={{ height: 120 }} />

          {/* Hour labels */}
          <div className={styles["timeline-header"]}>
            <div className={styles["timeline-header__hours"]}>
              {/* Sun emoji positioned at calculated sunrise time */}
              <span
                style={{
                  position: "absolute",
                  left: `${sunriseHour * (100 / 24)}%`,
                  top: "-16px",
                  fontSize: "1rem",
                  opacity: 0.5,
                  transform: "translateX(-50%)",
                }}
              >
                ☀️
              </span>
              {/* Moon emoji positioned at calculated sunset time */}
              <span
                style={{
                  position: "absolute",
                  left: `${sunsetHour * (100 / 24)}%`,
                  top: "-16px",
                  fontSize: "1rem",
                  opacity: 0.5,
                  transform: "translateX(-50%)",
                }}
              >
                🌙
              </span>
              {hours.map((h) => (
                <div key={h} className={styles["timeline-header__hour"]}>
                  {h === 0
                    ? "•"
                    : use24h
                      ? h
                      : h > 12
                        ? h - 12
                        : h === 12
                          ? 12
                          : h}
                </div>
              ))}
            </div>
          </div>

          {/* Sessions */}
          {SESSIONS.map((session) => {
            const { segments } = getSessionBarPosition(session, tzOffset);
            const open = isSessionOpen(
              session,
              displayTime.getUTCHours(),
              displayTime.getUTCMinutes(),
            );
            const sessionTimeInTz = getCurrentTimeInTz(session.timezone);
            const sessionOffset = getTimezoneOffset(session.timezone, now);
            const sessionAbbr = getTimezoneAbbr(session.timezone, now);

            return (
              <div key={session.id} className={styles["session-row"]}>
                <div className={styles["session-info"]}>
                  <img
                    src={session.flag}
                    alt={`${session.name} flag`}
                    className={styles["session-info__flag"]}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <span
                    className={styles["session-info__flag-emoji"]}
                    style={{ display: "none" }}
                  >
                    {session.flagEmoji}
                  </span>
                  <div className={styles["session-info__details"]}>
                    <div className={styles["session-info__name"]}>
                      {session.name}
                    </div>
                    <div className={styles["session-info__time"]}>
                      {formatTime(sessionTimeInTz, use24h)}
                    </div>
                    <div className={styles["session-info__date"]}>
                      {formatDateShort(sessionTimeInTz)} {sessionAbbr} (UTC{" "}
                      {formatOffsetString(sessionOffset).replace("GMT ", "")})
                    </div>
                  </div>
                </div>
                <div className={styles["session-timeline"]}>
                  <div
                    className={styles["session-status"]}
                    style={{
                      color: session.color,
                      left: `${segments[0]?.left || 0}%`,
                    }}
                  >
                    {session.name.toUpperCase()} SESSION{" "}
                    {open ? "OPEN" : "CLOSED"}
                  </div>
                  {segments.map((seg, i) => (
                    <div
                      key={i}
                      className={`${styles["session-bar"]} ${open ? styles["session-bar--open"] : styles["session-bar--closed"]}`}
                      style={{
                        left: `${seg.left}%`,
                        width: `${seg.width}%`,
                        backgroundColor: session.color,
                        transition: isDragging
                          ? "none"
                          : "left 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          <div className={styles["volume-section"]}>
            <div className={styles["volume-info"]}>
              <div className={styles["volume-info__text"]}>
                Trading Volume is usually
                <br />
                {volumeLevel.label.toLowerCase()} at this time of day.
              </div>
              <div className={styles["volume-info__badge"]}>
                <span
                  className={styles["volume-info__badge-dot"]}
                  style={{ backgroundColor: volumeLevel.color }}
                />
                {volumeLevel.label}
              </div>
            </div>
            <div className={styles["volume-chart"]}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient
                    id="volGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    {generateGradientStops()}
                  </linearGradient>
                  <linearGradient
                    id="strokeGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    {generateStrokeStops()}
                  </linearGradient>
                </defs>
                <path d={volumeAreaPath} fill="url(#volGrad)" />
                <path
                  d={buildVolumePath}
                  fill="none"
                  stroke="url(#strokeGrad)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexMarketHours;
