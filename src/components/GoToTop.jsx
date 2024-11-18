import React, { useState, useEffect, useRef } from "react"; // Import necessary React hooks
import { ArrowUp } from "lucide-react"; // Import the ArrowUp icon from lucide-react

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false); // State to control visibility of the button
  const scrollContainerRef = useRef(null); // Reference to the scroll container

  useEffect(() => {
    // Effect to set up scroll event listener
    const scrollContainer = document.querySelector('.hide-scrollbar'); // Select the scroll container
    if (scrollContainer) {
      scrollContainerRef.current = scrollContainer; // Assign the scroll container to the ref
      scrollContainer.addEventListener("scroll", toggleVisibility); // Add scroll event listener
    }

    return () => {
      // Cleanup function to remove the event listener
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", toggleVisibility); // Remove the listener
      }
    };
  }, []); // Empty dependency array to run effect only once

  const toggleVisibility = () => {
    // Function to toggle button visibility based on scroll position
    if (scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollTop > 300) {
        setIsVisible(true); // Show button if scrolled down more than 300px
      } else {
        setIsVisible(false); // Hide button otherwise
      }
    }
  };

  const scrollToTop = () => {
    // Function to scroll to the top of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0, // Scroll to the top
        behavior: "smooth" // Smooth scrolling effect
      });
    }
  };

  return (
    <>
      {isVisible && ( // Render button only if it is visible
        <button
          className="fixed bottom-24 right-7 bg-slate-600 text-white p-2 rounded-full hover:bg-slate-700 transition-all duration-300 z-50" // Button styles
          onClick={scrollToTop} // Click event to scroll to top
        >
          <ArrowUp className="w-6 h-6" /> // ArrowUp icon
        </button>
      )}
    </>
  );
};

export default GoToTop; // Export the GoToTop component
