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

  if (timeLeft.launched) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-3">
        <img src="/a992d144-4edd-4397-bdae-5a039dcace5c.png" alt="VI" className="h-[16px] sm:h-[24px] object-contain" />
        <span className="gta-3d-title text-[0.9rem] sm:text-[1.4rem]">LAUNCHED!</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
      <img src="/a992d144-4edd-4397-bdae-5a039dcace5c.png" alt="VI" className="block h-[24px] sm:h-[36px] md:h-[32px] lg:h-[72px] xl:h-[96px] object-contain landscape:h-[20px]" />
      <span className="gta-3d-title text-xl md:text-2xl lg:text-5xl xl:text-6xl tracking-[1px] sm:tracking-[3px] font-black tabular-nums text-white [text-shadow:_4px_4px_0_rgb(0_0_0)] landscape:text-lg">
        {timeLeft.days}:{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
}
