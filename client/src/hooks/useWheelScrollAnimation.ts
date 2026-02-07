import { useEffect, useRef, useState } from 'react';

export function useWheelScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element has scrolled into view
      // 0 = just entering viewport from bottom
      // 1 = fully in view at center
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Start animation when element is below viewport
      const startPoint = windowHeight;
      const endPoint = windowHeight / 2 - elementHeight / 2;
      
      let progress = 0;
      if (elementTop <= startPoint && elementTop >= endPoint) {
        progress = 1 - (elementTop - endPoint) / (startPoint - endPoint);
      } else if (elementTop < endPoint) {
        progress = 1;
      }
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [threshold]);

  // Calculate 3D transform values
  // Start: rotated back 45deg, translated down and back in Z
  // End: flat (0deg rotation), normal position
  const rotateX = (1 - scrollProgress) * 45; // 45deg to 0deg
  const translateY = (1 - scrollProgress) * 100; // 100px to 0px
  const translateZ = (1 - scrollProgress) * -200; // -200px to 0px
  const opacity = scrollProgress; // 0 to 1

  return { 
    ref, 
    scrollProgress,
    style: {
      transform: `perspective(1000px) rotateX(${rotateX}deg) translateY(${translateY}px) translateZ(${translateZ}px)`,
      opacity,
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out'
    }
  };
}
