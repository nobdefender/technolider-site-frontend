'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Яндекс Метрика. Подключается только если задан NEXT_PUBLIC_YM_ID.
 * Переходы между страницами (без перезагрузки) отправляются как отдельные просмотры.
 */
export function Metrika({ id }: { id: string }) {
  const pathname = usePathname();
  const num = Number(id);

  useEffect(() => {
    if (window.ym && num) window.ym(num, 'hit', window.location.href, { title: document.title });
  }, [pathname, num]);

  if (!num) return null;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${num},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://mc.yandex.ru/watch/${num}`} style={{ position: 'absolute', left: -9999 }} alt="" />
        </div>
      </noscript>
    </>
  );
}
