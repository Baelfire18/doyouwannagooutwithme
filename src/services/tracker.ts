import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { EventType } from '../types'
import type { DocumentReference } from 'firebase/firestore'
import type { Interaction, DeviceInfo, GeoLocation, SessionDocument } from '../types'

// ── Cached context (fetched once on page load) ──────────────────────

let cachedIp: string | null = null
let cachedLocation: GeoLocation | null = null
let sessionRef: DocumentReference | null = null

interface IpProvider {
  url: string
  extract: (data: Record<string, unknown>) => string | null
}

const IP_PROVIDERS: IpProvider[] = [
  {
    url: 'https://api.ipify.org?format=json',
    extract: (data): string | null => (data.ip as string) ?? null,
  },
  {
    url: 'https://api64.ipify.org?format=json',
    extract: (data): string | null => (data.ip as string) ?? null,
  },
  {
    url: 'https://ipapi.co/json/',
    extract: (data): string | null => (data.ip as string) ?? null,
  },
  {
    url: 'https://api.seeip.org/jsonip',
    extract: (data): string | null => (data.ip as string) ?? null,
  },
]

async function fetchIp(): Promise<string | null> {
  for (const provider of IP_PROVIDERS) {
    try {
      const response: Response = await fetch(provider.url, { signal: AbortSignal.timeout(3000) })
      const data: Record<string, unknown> = await response.json()
      const ip: string | null = provider.extract(data)
      if (ip) return ip
    } catch {
      // Provider failed, try the next one
    }
  }
  return null
}

function fetchGeolocation(): Promise<GeoLocation | null> {
  return new Promise((resolve): void => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition): void => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (): void => {
        // User denied or error — that's fine
        resolve(null)
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  })
}

function getDeviceInfo(): DeviceInfo {
  return {
    userAgent: navigator.userAgent,
    screenWidth: screen.width,
    screenHeight: screen.height,
    language: navigator.language,
    platform: navigator.platform,
  }
}

/**
 * Initialize the session: fetch context (IP + geolocation),
 * then create the session document in Firestore with an empty events map.
 */
export async function initTracker(): Promise<void> {
  if (sessionRef) return

  const [ip, location] = await Promise.all([fetchIp(), fetchGeolocation()])
  cachedIp = ip
  cachedLocation = location

  const sessionId: string = Date.now().toString()
  sessionRef = doc(collection(db, 'sessions'), sessionId)

  const sessionData: SessionDocument = {
    createdAt: serverTimestamp(),
    url: window.location.href,
    ip: cachedIp,
    location: cachedLocation,
    device: getDeviceInfo(),
    events: {},
  }

  setDoc(sessionRef, sessionData).catch((error: unknown): void => {
    console.warn('[tracker] Failed to create session:', error)
    sessionRef = null
  })
}

// ── Simple throttle: max 1 event per second ─────────────────────────

let lastEventTime: number = 0
const THROTTLE_MS: number = 1000

/**
 * Append an event to the current session document. Fire-and-forget.
 * Events are stored as a map keyed by epoch so each can have a serverTimestamp().
 */
export function trackEvent(type: EventType, interaction: Interaction): void {
  if (!sessionRef) return

  const now: number = Date.now()
  if (now - lastEventTime < THROTTLE_MS) return
  lastEventTime = now

  const eventKey: string = now.toString()

  updateDoc(sessionRef, {
    [`events.${eventKey}`]: {
      type,
      interaction,
      createdAt: serverTimestamp(),
    },
  }).catch((error: unknown): void => {
    console.warn('[tracker] Failed to log event:', error)
  })
}
