# HSS-analyser

The aim of the application is to detect defects in HSS manifests. Here are the analysed manifest attributes:

- DVR defect: In live cases, a DVR window length should be defined in the manifest.
All segments present between last segment ending and the beginning of the DVR should be announced in the manifest.
If the content is far shorter that the DVR window, the client may want to seek in the content were there are no
available segments. The analyser tolerates a difference of 2 seconds between DVR and content length. 

The analyser will poll manifests at a defined interval.

## Quick Start

Install node on your system. Then :
``node ./index.js -p ./assets.json``

The asset file lists manifest URL :
```json
  {
    "manifests": [
      "https://mysmooth.ism",
      "https://mysmooth.ism",
      "https://mysmooth.ism"
    ]   
  }
```

The analyser returns:
- The informations about defectuous manifests (url, defect infos).
- The errors about manifest loading / parsing / analyse (if in verbose mode).

## Options

``-p`` : Path to asset file (absolute or relative).

``-i`` : _(optionnal)_ Polling interval (in seconds) (default is 10 minutes).

``--debug | -d`` : _(optionnal)_ Show debug logs.