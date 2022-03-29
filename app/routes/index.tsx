import { useEffect, useRef } from 'react'
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix'
import { isValidRegion, Region, regions } from '~/riot-api'

type LoaderData = Region[]

export const loader: LoaderFunction = async () => {
  return json<LoaderData>(Object.keys(regions) as Region[])
}

type ActionData = { url?: string; error?: string }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const summonerName = encodeURIComponent(String(formData.get('summonerName')))
  const region = String(formData.get('region')).toUpperCase()
  if (!isValidRegion(region))
    return json<ActionData>({ error: 'Invalid region provided' })

  return json<ActionData>({
    url: `/overlay?summonerName=${summonerName}&region=${region}`,
  })
}

export default function Index() {
  const loaderData = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const state: 'idle' | 'submitting' | 'error' = actionData?.error
    ? 'error'
    : transition.state === 'submitting'
    ? 'submitting'
    : 'idle'

  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state === 'submitting') {
      formRef.current?.reset()
    } else {
      inputRef.current?.focus()
    }
  }, [state])

  return (
    <main className="flex h-screen items-center justify-center dark:bg-slate-900">
      <Form
        ref={formRef}
        className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md dark:bg-slate-800"
        method="post"
        replace
      >
        <h1 className="mb-4 text-2xl font-bold text-slate-700 dark:text-white">
          Generate an overlay Link
        </h1>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-slate-700 dark:text-white"
            htmlFor="summonerName"
          >
            Summoner Name
          </label>
          <input
            ref={inputRef}
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-slate-700 shadow focus:outline-none "
            type="text"
            id="summonerName"
            name="summonerName"
            required
            minLength={3}
            maxLength={16}
          />
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-slate-700 dark:text-white"
            htmlFor="region"
          >
            Region
          </label>
          <select
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-slate-700 shadow focus:outline-none "
            id="region"
            name="region"
          >
            {loaderData.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          {actionData?.error && (
            <p className="text-xs italic text-red-500">{actionData.error}</p>
          )}
          {actionData?.url && (
            <p className="text-xs italic text-green-500">
              Generated link:{' '}
              <a
                className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800"
                target="_blank"
                rel="noreferrer"
                href={`${location.origin}${actionData.url}`}
              >
                {`${location.origin}${actionData.url}`}
              </a>
            </p>
          )}
        </div>
        <button
          className="focus:shadow-outline rounded bg-blue-800 py-2 px-4 font-bold text-white hover:bg-blue-900 focus:outline-none"
          disabled={state === 'submitting'}
          type="submit"
        >
          Generate
        </button>
      </Form>
    </main>
  )
}
