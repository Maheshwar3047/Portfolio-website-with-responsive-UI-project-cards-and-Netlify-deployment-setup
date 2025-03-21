import { useEffect, useRef } from 'react';

type ComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;

// Keep track of components that have already been preloaded
const preloadedComponents = new Set<string>();

// Queue for managing preload requests
const preloadQueue: Array<{ loader: ComponentLoader; priority: number }> = [];
let isProcessingQueue = false;

const processPreloadQueue = async () => {
  if (isProcessingQueue || preloadQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  // Sort queue by priority
  preloadQueue.sort((a, b) => b.priority - a.priority);
  
  while (preloadQueue.length > 0) {
    const { loader } = preloadQueue.shift()!;
    
    try {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        await new Promise(resolve => 
          requestIdleCallback(() => {
            loader().then(resolve);
          })
        );
      } else {
        await new Promise(resolve => 
          setTimeout(() => {
            loader().then(resolve);
          }, 0)
        );
      }
    } catch (error) {
      console.error('Failed to preload component:', error);
    }
    
    // Add small delay between preloads to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessingQueue = false;
};

export const preloadComponent = (
  loader: ComponentLoader,
  priority: number = 0
) => {
  // Get a unique identifier for the component
  const componentId = loader.toString();
  
  if (preloadedComponents.has(componentId)) {
    return;
  }
  
  preloadedComponents.add(componentId);
  preloadQueue.push({ loader, priority });
  processPreloadQueue();
};

export const usePreloadComponent = (
  loader: ComponentLoader,
  options: { 
    priority?: number;
    threshold?: number;
    rootMargin?: string;
  } = {}
) => {
  const { 
    priority = 0,
    threshold = 0.1,
    rootMargin = '100px'
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadComponent(loader, priority);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Create a sentinel element to observe
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    sentinel.style.visibility = 'hidden';
    document.body.appendChild(sentinel);

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [loader, priority, threshold, rootMargin]);
};