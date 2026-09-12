import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// Die Viewport-Breite ist ein externer Store, kein React-State. useSyncExternalStore
// liest sie beim ersten Render direkt, statt sie per Effect in State zu spiegeln:
// das spart den Render mit undefined (frueher gab der Hook im ersten Durchlauf
// immer false zurueck, auch auf einem Telefon) und haelt den Wert waehrend
// konkurrierender Renders konsistent.
const subscribe = (onStoreChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onStoreChange)
  return () => mql.removeEventListener("change", onStoreChange)
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches

// Auf dem Server gibt es kein window; Desktop ist die sichere Annahme, weil das
// Layout ohne Mobile-Zweig gerendert wird und der Client sofort korrigiert.
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
