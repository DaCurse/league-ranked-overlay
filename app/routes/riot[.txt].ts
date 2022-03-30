import { LoaderFunction } from 'remix'

export const loader: LoaderFunction = () => {
  return new Response('e3ec8a68-feba-41cf-a07b-226495509e8b', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}
