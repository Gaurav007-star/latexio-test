import React, { useEffect, useState } from "react";
import arrow from "../assests/upArrow.svg";

const StickyIcon = () => {
  const [showSticky, setShowSticky] = useState(false);

  // show sticky icon after 50% of screen height
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      const scrollPercent = (scrollY / (pageHeight - windowHeight)) * 100;

      if (scrollPercent > 50) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showSticky) return <></>;

  return (
    <div className="fixed bottom-6 right-6 z-50 pr-20 max-[450px]:pr-0">
      <img
        src={arrow}
        alt="arrow/icon"
        className="w-[55px] h-[55px] rounded-full shadow-lg cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
};

export default StickyIcon;





