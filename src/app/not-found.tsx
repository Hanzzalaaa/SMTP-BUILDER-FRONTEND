import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    </div>
  )
}