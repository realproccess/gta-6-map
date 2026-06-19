import React, { useState, useEffect } from 'react';

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    launched: false,
  });

  useEffect(() => {
    const launchDate = new Date("Nov 19, 2026 00:00:00").getTime();

    const countdownFunction = setInterval(function() {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(countdownFunction);
        setTimeLeft(prev => ({ ...prev, launched: true }));
        return;
      }

      const msInYear = 1000 * 60 * 60 * 24 * 365.25;
      const msInDay = 1000 * 60 * 60 * 24;
      const msInHour = 1000 * 60 * 60;
      const msInMinute = 1000 * 60;

      const years = Math.floor(distance / msInYear);
      const days = Math.floor((distance % msInYear) / msInDay);
      const hours = Math.floor((distance % msInDay) / msInHour);
      const minutes = Math.floor((distance % msInHour) / msInMinute);
      const seconds = Math.floor((distance % msInMinute) / 1000);

      setTimeLeft({ years, days, hours, minutes, seconds, launched: false });
    }, 1000);

    return () => clearInterval(countdownFunction);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.launched) {
    return (
      <span className="gta-3d-title text-sm sm:text-base font-black text-white [text-shadow:_2px_2px_0_rgb(0_0_0)]">
        LAUNCHED!
      </span>
    );
  }

  return (
    <span className="gta-3d-title text-sm sm:text-base lg:text-xl tracking-[1px] font-black tabular-nums text-white [text-shadow:_2px_2px_0_rgb(0_0_0)] landscape:text-xs">
      {timeLeft.days}:{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
    </span>
  );
}
