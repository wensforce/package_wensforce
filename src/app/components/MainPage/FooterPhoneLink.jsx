"use client";

import { useMetaEvents } from "@/app/hooks/useMetaEvents";

export default function FooterPhoneLink({
  href,
  className,
  children,
  ...props
}) {
  const { trackContact } = useMetaEvents();

  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        void trackContact();
      }}
      {...props}
    >
      {children}
    </a>
  );
}
