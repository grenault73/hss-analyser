# HSS-analyser

``v2.0.0``

The aim of the application is to detect defects in HSS manifests.

4 defects can be encountered in live situations:
- The content start is far behind the DVR start.
  - The client may want to access an announced segment which is actually not available, seeking in the content
  in the early DVR window.
  - _Default tolerated gap_ : 10 seconds.
  - _Error name_ : `LATE_CONTENT_START`.

- The total content length seems suspiciously short compared to DVR window length.
  - The content total length should be nearly equal to DVR window length.
  - _Default tolerated gap_ : 10 seconds (can be modified with option -sst).
  - _Error name_ : `CONTENT_TOO_LONG`.

- There are discountinuities in the content.
  - The content is split into several parts. Client may seek in discountinuities.
  - _Error name_ : `CONTENT_DISCOUNTINUITIES`.

- The end of content is far in the past from manifest receive time.
  - A live content's end may be close to manifest received time. Warn if not.
  - _Default tolerated gap_ : 60 seconds.
  - _Error name_ : `EARLY_CONTENT_END`.

- The end of content is after manifest receive time.
  - A live content may not end after present time. By definition, a segment may not be
  announced it supposely doesn't exists.
  - _Error name_ : `LATE_CONTENT_END`.

- There is no content in video or audio track.
  - _Error name_ : `NO_CONTENT`.

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
- The errors about manifest loading / parsing / analyse (if in debug mode).

## Options

``-p`` : Path to asset file (absolute or relative).

``-i`` : _(optionnal)_ Polling interval (in seconds) (default is 10 minutes).

``-sst`` : _(optionnal)_ "First segment start can be behind" tolerance (in seconds) (default is 10 seconds).

``--logToFile | -l`` : _(optionnal)_ Log to file (in ./logs folder).

``--debug | -d`` : _(optionnal)_ Show debug logs.
