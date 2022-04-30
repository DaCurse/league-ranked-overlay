# League Ranked Overlay

[![🚀 Deploy](https://github.com/DaCurse/league-ranked-overlay/actions/workflows/deploy.yml/badge.svg)](https://github.com/DaCurse/league-ranked-overlay/actions/workflows/deploy.yml)

**Try it live: <https://overlay.dacurse.xyz/>**

![Full Example](/images/example.png)

![Compact Example](/images/example_compact.png)

This web app allows you to create a dynamic Browser Source overlay to display your League of Legends ranked stats.

After generating a link via the form, create a Browser Source in OBS and set the URL to the generated link.

## Creating a Browser Source

To use the overlay in OBS, head on to the website to generate a link and copy it.
Then, in OBS, click on the '+' under the "Sources" panel, and pick "Browser":

![Adding a new browser source](/images/obs1.png)

Create the browser source, and then paste the generated link in the URL field:

![Setting the URL](/images/obs2.png)

You can also change the width and the height to crop the size of the browser, 300x100 seems like a good size.

Now just click OK, and you're done! You can move/resize the browser source in the scene, and the overlay will refresh it's information every 20 minutes.
