import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix'
import tailwindStylesheetUrl from './styles/tailwind.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'League Ranked Overlay',
  viewport: 'width=device-width,initial-scale=1',
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
      <body className="h-full">
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
          <p className="mb-2">{error.message}</p>
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
