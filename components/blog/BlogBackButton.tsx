'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BlogBackButtonProps {
  children: React.ReactNode;
  className?: string;
  fallbackUrl?: string;
}

export function BlogBackButton({
  children,
  className,
  fallbackUrl = '/blog',
}: BlogBackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    let cameFromBlog = false;
    let targetFallback = fallbackUrl;

    if (typeof window !== 'undefined') {
      const fromBlog = sessionStorage.getItem('fromBlog') === 'true';
      const savedSource = sessionStorage.getItem('blogSourcePath');
      if (savedSource) {
        targetFallback = savedSource;
      }

      // Check document referrer
      const referrerFromBlog = Boolean(
        document.referrer && (
          document.referrer.includes('/blog') ||
          document.referrer.includes('/insights')
        )
      );

      // Check window.history and fromBlog flag
      if ((fromBlog || referrerFromBlog) && window.history.length > 1) {
        cameFromBlog = true;
      }
    }

    if (cameFromBlog) {
      router.back();
    } else {
      router.push(targetFallback, { scroll: false });
    }
  };

  return (
    <a
      href={fallbackUrl}
      onClick={handleBack}
      className={className}
    >
      {children}
    </a>
  );
}

export default BlogBackButton;
