# newrelic-video-shaka [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
#### [New Relic](http://newrelic.com) video tracking for Shaka Player

## Requirements
This video monitor solutions works on top of New Relic's **Browser Agent**.

## Usage
Load **scripts** inside `dist` folder into your page.
```html
<script src="../dist/newrelic-video-shaka.min.js"></script>
```

> If `dist` folder is not included, run `npm i && npm run build` to build it.

```javascript
// var player = new shaka.Player(...)
nrvideo.Core.addTracker(new nrvideo.ShakaTracker(player))
```

