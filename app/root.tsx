import type { LinksFunction, MetaFunction } from '@remix-run/cloudflare'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
import React from 'react'
import tailwindStylesheetUrl from './styles/tailwind_out.css'

export const links: LinksFunction = () => {
  return [
    {
      rel: 'shortcut icon',
      href: '/favicon.ico',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
    },
  ]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'League Ranked Overlay',
  viewport: 'width=device-width,initial-scale=1',
  description: 'Create a stream overlay showcasing your League of Legends rank',
  'og:title': 'League Ranked Overlay',
  'og:type': 'website',
  'og:description':
    'Create a stream overlay showcasing your League of Legends rank',
  'og:image': 'https://overlay.dacurse.xyz/assets/logo.png',
  'og:url': 'https://overlay.dacurse.xyz',
})

interface DocumentProps {
  children: React.ReactNode
}

function Document({ children }: DocumentProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full font-inter">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <main className="flex h-screen items-center justify-center dark:bg-slate-900">
        <div className="mb-4 rounded bg-white px-8 pt-6 pb-8 text-slate-700 shadow-md dark:bg-slate-800 dark:text-white">
          <h1 className="mb-4 text-2xl font-bold ">An error occurred</h1>
          <p className="mb-2">
            <span>{error.message}</span>
            {process.env.NODE_ENV !== 'production' && (
              <pre className="whitespace-pre-wrap">{error.stack}</pre>
            )}
          </p>
          <Link
            className="inline-block align-baseline text-blue-500 hover:text-blue-800"
            to="/"
          >
            Go back
          </Link>
        </div>
      </main>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <Document>
      <main className="flex h-screen items-center justify-center dark:bg-slate-900">
        <div className="mb-4 rounded bg-white px-8 pt-6 pb-8 text-slate-700 shadow-md dark:bg-slate-800 dark:text-white">
          <h1 className="mb-4 text-2xl font-bold ">
            {caught.status} {caught.statusText}
          </h1>
          <p className="mb-2">{caught.data}</p>
          <Link
            className="inline-block align-baseline text-blue-500 hover:text-blue-800"
            to="/"
          >
            Go back
          </Link>
        </div>
      </main>
    </Document>
  )
}
