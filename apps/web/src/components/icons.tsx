import * as React from 'react';

/**
 * Set mínimo de iconos en SVG inline (estilo Tabler Icons, 24×24, stroke).
 * Se mantienen inline para no depender de un webfont externo como en el
 * prototipo, y heredan el color vía `currentColor`.
 */
export type IconName =
  | 'qrcode'
  | 'store'
  | 'star'
  | 'dashboard'
  | 'shield'
  | 'code'
  | 'login'
  | 'chevron-right'
  | 'receipt'
  | 'chart-bar'
  | 'user'
  | 'trash'
  | 'whatsapp'
  | 'x'
  | 'calculator'
  | 'alert-triangle'
  | 'lock'
  | 'check'
  | 'clock'
  | 'bell'
  | 'device-mobile'
  | 'trending-up'
  | 'plus'
  | 'cash'
  | 'users'
  | 'settings'
  | 'brain'
  | 'building'
  | 'credit-card'
  | 'coin'
  | 'file-invoice'
  | 'link'
  | 'trophy'
  | 'mail'
  | 'eye'
  | 'copy'
  | 'file-text'
  | 'download'
  | 'arrow-left'
  | 'circle-check'
  | 'chevron-down'
  | 'flask'
  | 'key'
  | 'webhook'
  | 'refresh'
  | 'play'
  | 'id'
  | 'home'
  | 'shopping-cart'
  | 'school'
  | 'search'
  | 'calendar';

const paths: Record<IconName, React.ReactNode> = {
  qrcode: (
    <>
      <path d="M5 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M5 15m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M15 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M5 11h1" />
      <path d="M11 5v1" />
      <path d="M11 11h2v2" />
      <path d="M13 17v.01" />
      <path d="M17 11v.01" />
      <path d="M15 15h2v2h-2z" />
    </>
  ),
  store: (
    <>
      <path d="M3 21l18 0" />
      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
      <path d="M5 21v-10.15" />
      <path d="M19 21v-10.15" />
      <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
    </>
  ),
  star: (
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
  ),
  dashboard: (
    <>
      <path d="M4 4h6v8h-6z" />
      <path d="M4 16h6v4h-6z" />
      <path d="M14 12h6v8h-6z" />
      <path d="M14 4h6v4h-6z" />
    </>
  ),
  shield: (
    <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
  ),
  code: (
    <>
      <path d="M7 8l-4 4l4 4" />
      <path d="M17 8l4 4l-4 4" />
      <path d="M14 4l-4 16" />
    </>
  ),
  login: (
    <>
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M21 12h-13" />
      <path d="M18 15l3 -3l-3 -3" />
    </>
  ),
  'chevron-right': <path d="M9 6l6 6l-6 6" />,
  receipt: (
    <>
      <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
    </>
  ),
  'chart-bar': (
    <>
      <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M4 20h14" />
    </>
  ),
  user: (
    <>
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </>
  ),
  x: (
    <>
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </>
  ),
  calculator: (
    <>
      <path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
      <path d="M8 14v.01" />
      <path d="M12 14v.01" />
      <path d="M16 14v.01" />
      <path d="M8 17v.01" />
      <path d="M12 17v.01" />
      <path d="M16 17v.01" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="M12 9v4" />
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
      <path d="M12 16h.01" />
    </>
  ),
  lock: (
    <>
      <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
      <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
      <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    </>
  ),
  check: <path d="M5 12l5 5l10 -10" />,
  clock: (
    <>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  bell: (
    <>
      <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </>
  ),
  'device-mobile': (
    <>
      <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
      <path d="M11 4h2" />
      <path d="M12 17v.01" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17l6 -6l4 4l8 -8" />
      <path d="M14 7h7v7" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  cash: (
    <>
      <path d="M7 9m0 3a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3z" />
      <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 9v-2a3 3 0 0 0 -3 -3h-8a3 3 0 0 0 -3 3v4a3 3 0 0 0 3 3h2" />
    </>
  ),
  users: (
    <>
      <path d="M9 7a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
    </>
  ),
  settings: (
    <>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </>
  ),
  brain: (
    <>
      <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
      <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
      <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
      <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
      <path d="M8 9a3 3 0 1 1 8 0" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21v-16a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v16" />
      <path d="M9 8h1" />
      <path d="M9 12h1" />
      <path d="M14 8h1" />
      <path d="M14 12h1" />
      <path d="M10 21v-4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4" />
    </>
  ),
  'credit-card': (
    <>
      <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
      <path d="M3 10h18" />
      <path d="M7 15h.01" />
      <path d="M11 15h2" />
    </>
  ),
  coin: (
    <>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
      <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2.5a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-2.5a2 2 0 0 1 -1.8 -1" />
      <path d="M12 7v2" />
      <path d="M12 15v2" />
    </>
  ),
  'file-invoice': (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 21v-16a2 2 0 0 1 2 -2h7l5 5v13a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M9 7h1" />
      <path d="M9 13h6" />
      <path d="M13 17h-4" />
    </>
  ),
  link: (
    <>
      <path d="M9 15l6 -6" />
      <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
      <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v8a5 5 0 0 1 -10 0z" />
      <path d="M7 4a2 2 0 0 0 -2 2v1a2 2 0 0 0 2 2" />
      <path d="M17 4a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2" />
    </>
  ),
  mail: (
    <>
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M3 7l9 6l9 -6" />
    </>
  ),
  eye: (
    <>
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </>
  ),
  copy: (
    <>
      <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
      <path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      <path d="M9 9h1" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </>
  ),
  download: (
    <>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4v12" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M5 12h14" />
      <path d="M5 12l6 6" />
      <path d="M5 12l6 -6" />
    </>
  ),
  'circle-check': (
    <>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6l6 -6" />,
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-4.5 8a1.5 1.5 0 0 0 1.3 2.2h10.4a1.5 1.5 0 0 0 1.3 -2.2l-4.5 -8v-6" />
      <path d="M6.5 14h11" />
    </>
  ),
  key: (
    <>
      <path d="M14 6a4 4 0 1 1 -1.18 7.83l-4.82 4.82v2.35h-2.35l-2 -2v-2.35l6.52 -6.52a4 4 0 0 1 3.83 -5.13z" />
      <path d="M15 8h.01" />
    </>
  ),
  webhook: (
    <>
      <path d="M4.876 13.61a4 4 0 1 0 6.124 3.39h5" />
      <path d="M15.066 20.502a4 4 0 1 0 1.934 -7.502c-.706 0 -1.424 .19 -2 .5l-2.5 -4.5" />
      <path d="M12 8a4 4 0 1 0 -4 4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </>
  ),
  play: <path d="M7 4v16l13 -8z" />,
  id: (
    <>
      <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M15 8h2" />
      <path d="M15 12h2" />
      <path d="M7 16h10" />
    </>
  ),
  home: (
    <>
      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
    </>
  ),
  'shopping-cart': (
    <>
      <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 17h-11v-14h-2" />
      <path d="M6 5l14 1l-1 7h-13" />
    </>
  ),
  school: (
    <>
      <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
      <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
    </>
  ),
  search: (
    <>
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </>
  ),
  calendar: (
    <>
      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M4 11h16" />
      <path d="M11 15h1" />
      <path d="M12 15v3" />
    </>
  ),
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
