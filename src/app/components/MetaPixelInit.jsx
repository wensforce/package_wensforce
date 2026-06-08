'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getFbc } from '@/app/lib/metaPixel.js';

export default function MetaPixelInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Store fbclid as _fbc on first load
    getFbc();

    // Load Meta Pixel script once
    if (window.fbq) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  // Track PageView on route change
  useEffect(() => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}