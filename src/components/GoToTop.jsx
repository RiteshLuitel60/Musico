import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className="fixed bottom-10 right-7 bg-slate-600 text-white p-2 rounded-full hover:bg-slate-700 transition-all duration-300 z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default GoToTop;
