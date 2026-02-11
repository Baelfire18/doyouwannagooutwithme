import type { FieldValue } from 'firebase/firestore'

export enum EventType {
  Yes = 'yes',
  No = 'no',
}

/**
 * How the user interacted with a button:
 * - Hover:  mouse cursor entered the button (desktop)
 * - Click:  mouse click on the button (desktop)
 * - Tap:    finger touched the button (mobile/tablet)
 * - Resize: window was resized while button was already moved (automatic, not user-initiated)
 */
export enum Interaction {
  Hover = 'hover',
  Click = 'click',
  Tap = 'tap',
  Resize = 'resize',
}

export interface Position {
  x: number
  y: number
}

export interface DeviceInfo {
  userAgent: string
  screenWidth: number
  screenHeight: number
  language: string
  platform: string
}

export interface GeoLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export interface SessionEvent {
  type: EventType
  interaction: Interaction
  createdAt: FieldValue
}

export interface SessionDocument {
  createdAt: FieldValue
  url: string
  ip: string | null
  location: GeoLocation | null
  device: DeviceInfo
  events: Record<string, SessionEvent>
}
