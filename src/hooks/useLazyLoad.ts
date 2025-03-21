import { useState, useEffect, useRef, RefObject } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useLazyLoad<T extends Element>({
  threshold = 0,
  rootMargin = '0px',
  root = null
}: LazyLoadOptions = {}): [boolean, RefObject<T>] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);
  const prevElement = useRef<T | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement || prevElement.current === currentElement) return;

    prevElement.current = currentElement;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to keep observing
          observer.unobserve(currentElement);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, root]);

  return [isVisible, elementRef];
}