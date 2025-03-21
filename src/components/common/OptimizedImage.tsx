import React, { useEffect, useRef, useState } from 'react';
import { Box, BoxProps, Skeleton } from '@mui/material';
import { CleanupManager } from '../../utils/cleanup';

interface OptimizedImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholderSrc,
  width,
  height,
  priority = false,
  onLoad,
  onError,
  sx,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate responsive image sources
  const generateSrcSet = (imgSrc: string): string => {
    const { dir, name, ext } = parsePath(imgSrc);
    const hasExt = ext !== '';
    const baseExt = hasExt ? ext : '.jpg'; // Default to jpg if no extension
    const webpExt = '.webp';
    
    return [
      `${dir}${name}-sm${baseExt} 640w, ${dir}${name}-sm${webpExt} 640w`,
      `${dir}${name}-md${baseExt} 1024w, ${dir}${name}-md${webpExt} 1024w`,
      `${dir}${name}-lg${baseExt} 1920w, ${dir}${name}-lg${webpExt} 1920w`,
    ].join(', ');
  };

  const parsePath = (path: string) => {
    const dir = path.substring(0, path.lastIndexOf('/') + 1);
    let name = path.substring(path.lastIndexOf('/') + 1);
    let ext = '';
    
    const extIndex = name.lastIndexOf('.');
    if (extIndex !== -1) {
      ext = name.substring(extIndex);
      name = name.substring(0, extIndex);
    }
    
    return { dir, name, ext };
  };

  // Generate a low-quality placeholder if not provided
  const blurredPlaceholder = placeholderSrc || `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width || 100} ${height || 100}'><rect width='100%' height='100%' fill='%23f0f0f0'/></svg>`;

  useEffect(() => {
    const currentImg = imgRef.current;

    if (!priority && currentImg && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsIntersecting(entry.isIntersecting);
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );

      observerRef.current.observe(currentImg);
    }

    return () => {
      if (observerRef.current && currentImg) {
        observerRef.current.unobserve(currentImg);
        observerRef.current.disconnect();
      }
      CleanupManager.executeCleanup(`image-${src}`);
    };
  }, [src, priority]);

  useEffect(() => {
    const img = imgRef.current;

    if (!img || (!priority && !isIntersecting)) return;

    const loadImage = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      console.error(`Failed to load image: ${src}`);
      onError?.();
    };

    if (img.complete) {
      loadImage();
    } else {
      img.addEventListener('load', loadImage);
      img.addEventListener('error', handleError);
    }

    return () => {
      img.removeEventListener('load', loadImage);
      img.removeEventListener('error', handleError);
    };
  }, [src, isIntersecting, priority, onLoad, onError]);

  useEffect(() => {
    CleanupManager.registerCleanup(`image-${src}`, () => {
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    });
  }, [src]);

  return (
    <Box
      component="div"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...sx,
      }}
      {...props}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      <picture>
        <source
          type="image/webp"
          srcSet={priority || isIntersecting ? generateSrcSet(src) : undefined}
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
        />
        <Box
          component="img"
          ref={imgRef}
          src={(priority || isIntersecting) ? src : blurredPlaceholder}
          srcSet={priority || isIntersecting ? generateSrcSet(src) : undefined}
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
          alt={alt}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            objectFit: 'cover',
            filter: isLoaded ? 'none' : 'blur(10px)',
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
        />
      </picture>
    </Box>
  );
};