import { useEffect, useRef } from 'react'
import { ActionFunction, Form, json, useActionData, useTransition } from 'remix'
import { regions } from '~/riot-api'

type ActionData = { url: string }

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const summonerName = String(formData.get('summonerName'))
  const region = String(formData.get('region')).toUpperCase()
  const textColor = String(formData.get('textColor'))

  const searchParams = new URLSearchParams({ summonerName, region, textColor })

  return json<ActionData>({
    url: `/overlay?${searchParams}`,
  })
}

export default function Index() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (transition.state === 'submitting') {
      formRef.current?.reset()
    } else {
      inputRef.current?.focus()
    }
  }, [transition.state])

  return (
    <main className="flex h-screen flex-col overflow-auto dark:bg-slate-900">
      <div className="m-auto max-w-lg">
        <Form
          ref={formRef}
          className="mx-auto my-4 max-w-sm rounded bg-white px-8 pt-6 pb-8 shadow-md dark:bg-slate-800"
          method="post"
          replace
        >
          <h1 className="mb-4 text-center text-2xl font-bold text-slate-700 dark:text-white">
            Generate Overlay Link
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
              {Object.keys(regions).map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-slate-700 dark:text-white"
              htmlFor="textColor"
            >
              Text Color
            </label>
            <input
              ref={inputRef}
              className="focus:shadow-outline rounded border leading-tight shadow focus:outline-none"
              type="color"
              id="textColor"
              name="textColor"
              defaultValue="#ffffff"
            />
          </div>
          {actionData?.url && (
            <div className="mb-4">
              <p className="break-all text-xs italic text-green-500">
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
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-800 py-2 px-4 font-bold text-white transition hover:bg-blue-900 focus:outline-none disabled:bg-gray-200 disabled:text-gray-500"
              disabled={transition.state === 'submitting'}
              type="submit"
            >
              Generate
            </button>
            <a
              className="inline-block h-8 w-8 align-baseline hover:opacity-60 dark:invert"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/DaCurse/league-ranked-overlay"
              title="GitHub Repository"
            >
              <object
                className="pointer-events-none"
                data="/assets/github.svg"
                type="image/svg+xml"
                aria-label="GitHub"
              ></object>
            </a>
          </div>
        </Form>
        <div
          className="m-2 border-l-4 border-blue-500 bg-blue-100 p-4 text-blue-700 sm:m-0"
          role="alert"
        >
          <p className="cursor-pointer font-bold">Disclaimer</p>
          <p>
            League Ranked Overlay isn't endorsed by Riot Games and doesn't
            reflect the views or opinions of Riot Games or anyone officially
            involved in producing or managing Riot Games properties. Riot Games,
            and all associated properties are trademarks or registered
            trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </main>
  )
}
