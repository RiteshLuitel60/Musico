import React, { useState, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

// Component for a "Go to Top" button that appears when scrolling down
const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Find the scrollable container and add scroll event listener
    const scrollContainer = document.querySelector('.hide-scrollbar');
    if (scrollContainer) {
      scrollContainerRef.current = scrollContainer;
      scrollContainer.addEventListener("scroll", toggleVisibility);
    }

    // Clean up event listener on component unmount
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []);

  // Show/hide button based on scroll position
  const toggleVisibility = () => {
    if (scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  // Scroll to top of the container
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      {isVisible && (
        <button
          className="fixed bottom-24 right-7 bg-slate-600 text-white p-2 rounded-full hover:bg-slate-700 transition-all duration-300 z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default GoToTop;
