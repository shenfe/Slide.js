# lite-slider
A lightweight slider component for mobile frontend.

## Usage

### script

```js
var $slider = document.getElementById('my-slider');
var slider = new Slider($slider, {
    init: 75,
    dir: 'v',
    onchanging: function (percent) {
        percent = Math.floor(percent * 100) / 100;
        console.log(`changing: ${percent}`);
    },
    onchanged: function (percent) {
        percent = Math.floor(percent * 100) / 100;
        console.log(`changed: ${percent}`);
    }
});
```

### style patches

```css
.slider-container {}
.slider-wrap {}
.slider-bar {}
.slider-dot {}
```

## License

MIT
