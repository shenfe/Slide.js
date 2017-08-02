var rand_351089689 = (function () {
    var document = window.document;

    var addCssRule = function (selectorString, styleString) {
        if (window.document.getElementsByTagName('style').length === 0) {
            var tempStyle = window.document.createElement('style');
            tempStyle.setAttribute('type', 'text/css');
            window.document.getElementsByTagName('head')[0].appendChild(tempStyle);
        }

        window.document.getElementsByTagName('style')[0].appendChild(window.document.createTextNode(selectorString + '{' + styleString + '}'));
    };

    return function ($container, option) {
        option = option || {};

        if (!window.slider_global_style_added) {
            window.slider_global_style_added = true;
            addCssRule('.slider-container', '');
            addCssRule('.slider-container-h', '');
            addCssRule('.slider-container-v', '');
            addCssRule('.slider-container .slider-wrap', 'position:relative;');
            addCssRule('.slider-container-h .slider-wrap', 'height:100%;');
            addCssRule('.slider-container-v .slider-wrap', 'height:100%;');
            addCssRule('.slider-container-v .slider-bar', 'position:absolute;left:0;bottom:0;width:100%;');
            addCssRule('.slider-bar', 'position:relative;');
            addCssRule('.slider-dot', 'position:absolute;right:0;display:inline-block;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);');
            addCssRule('.slider-container-h .slider-dot', '-webkit-transform:translate3d(50%,0,0);transform:translate3d(50%,0,0);');
            addCssRule('.slider-container-v .slider-dot', '-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);');
        }

        var type = (option.dir !== 'v') ? 'h' : 'v';

        var $wrap = document.createElement('div');
        $wrap.className = 'slider-wrap';
        $wrap.innerHTML = `
            <div class="slider-bar">
                <div class="slider-dot"></div>
            </div>
        `;
        $container.appendChild($wrap);
        var $bar = $wrap.querySelector('.slider-bar');
        var $dot = $wrap.querySelector('.slider-dot');
        $container.classList.add('slider-container');
        $container.classList.add('slider-container-' + type);

        var length = {
            total: type === 'h' ? $wrap.offsetWidth : $wrap.offsetHeight,
            progress: option.init || 0
        };
        $bar.style[type === 'h' ? 'width' : 'height'] = '' + length.progress + '%';
        var offset = length.progress / 100 * length.total;

        var onchanging = option.onchanging || function () {};
        var onchanged = option.onchanged || function () {};

        var setOffset = function (v) {
            offset = v;
            if (v < 0) v = 0;
            if (v > length.total) v = length.total;
            length.progress = v / length.total * 100;
            $bar.style[type === 'h' ? 'width' : 'height'] = '' + length.progress + '%';
            onchanging(length.progress);
        };

        var touchPos = {
            x: null,
            y: null
        };

        var touchstartHandler = function (e) {
            var target = e.target;
            var touchobj = e.changedTouches[0];
            var distance;
            if (type === 'h') {
                distance = touchobj.pageX - $wrap.getBoundingClientRect().left;
                setOffset(distance);
            } else {
                distance = $wrap.getBoundingClientRect().top + $wrap.offsetHeight - touchobj.pageY;
                setOffset(distance);
            }
            touchPos.x = touchobj.pageX;
            touchPos.y = touchobj.pageY;
        };
        $wrap.addEventListener('touchstart', touchstartHandler, false);

        var touchmoveHandler = function (e) {
            var touchobj = e.changedTouches[0];
            if (type === 'h') {
                setOffset(offset - touchPos.x + touchobj.pageX);
            } else {
                setOffset(offset + touchPos.y - touchobj.pageY);
            }
            touchPos.x = touchobj.pageX;
            touchPos.y = touchobj.pageY;
        };
        $wrap.addEventListener('touchmove', touchmoveHandler, false);

        var touchendHandler = function (e) {
            touchPos.x = null;
            touchPos.y = null;
            onchanged(length.progress);
        };
        $wrap.addEventListener('touchend', touchendHandler, false);

        Object.defineProperty(this, 'progress', {
            get: function () { return length.progress; },
            set: function (v) {
                if (v < 0) v = 0;
                if (v > 100) v = 100;
                setOffset(offset + length.total * v / 100);
            }
        });
    };
})();

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = rand_351089689;
    }
} else {
    window.Slider = rand_351089689;
}
