import { useEffect, useState } from "react";

/**
 * useMediaQuery - React hook to listen for CSS media query changes
 * @param {string} query - The media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query currently matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
    // For older browsers, fallback to media.addListener/removeListener
  }, [matches, query]);

  return matches;
}
