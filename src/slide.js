var document = window.document;

var addCssRule = function (selectorString, styleString) {
    if (window.document.getElementsByTagName('style').length === 0) {
        var tempStyle = window.document.createElement('style');
        tempStyle.setAttribute('type', 'text/css');
        window.document.getElementsByTagName('head')[0].appendChild(tempStyle);
    }

    window.document.getElementsByTagName('style')[0].appendChild(window.document.createTextNode(selectorString + '{' + styleString + '}'));
};

var Slider = function ($container, option) {
    option = option || {};
    $container.innerHTML = `
        <div class="slider-wrap">
            <div class="slider-bar">
                <div class="slider-dot"></div>
            </div>
        </div>
    `;

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
        addCssRule('.slider-dot', 'position:absolute;right:0;display:inline-block;transform:translate3d(0,0,0)');
        addCssRule('.slider-container-h .slider-dot', 'transform:translate3d(50%,50%,0)');
        addCssRule('.slider-container-v .slider-dot', 'transform:translate3d(-50%,-50%,0)');
    }

    var $wrap = $container.querySelector('.slider-wrap');
    var $bar = $container.querySelector('.slider-bar');
    var $dot = $container.querySelector('.slider-dot');

    var type = (option.dir === 'h') ? 'h' : 'v';
    $container.classList.add('slider-container');
    $container.classList.add('slider-container-' + type);
    var length = {
        total: type === 'h' ? $wrap.offsetWidth : $wrap.offsetHeight,
        progress: option.init || 0
    };
    if (type === 'h') {
        $bar.style.width = '' + length.progress + '%';
    } else {
        $bar.style.height = '' + length.progress + '%';
    }
    var offset = {
        x: type === 'v' ? 0 : (length.progress / 100 * length.total),
        y: type === 'h' ? 0 : (length.progress / 100 * length.total)
    };

    var onchanging = option.onchanging || function () {};
    var onchanged = option.onchanged || function () {};

    var setOffsetX = function (v) {
        if (v < 0) v = 0;
        if (v > length.total) v = length.total;
        offset.x = v;
        length.progress = offset.x / length.total * 100;
        $bar.style.width = '' + length.progress + '%';
        onchanging(length.progress);
    };
    var setOffsetY = function (v) {
        if (v < 0) v = 0;
        if (v > length.total) v = length.total;
        offset.y = v;
        length.progress = offset.y / length.total * 100;
        $bar.style.height = '' + length.progress + '%';
        onchanging(length.progress);
    };

    var touchPos = {
        x: null,
        y: null
    };
    $wrap.addEventListener('touchstart', function (e) {
        // if (e.target.classList.contains('slider-dot')) return;
        var target = e.target;
        var touchobj = e.changedTouches[0];
        var distance;
        if (type === 'h') {
            distance = touchobj.pageX - $wrap.offsetLeft;
            setOffsetX(distance);
        } else {
            distance = $wrap.offsetTop + $wrap.offsetHeight - touchobj.pageY;
            setOffsetY(distance);
        }
        touchPos.x = touchobj.pageX;
        touchPos.y = touchobj.pageY;
    }, false);

    var touchstartHandler = function (e) {
        var touchobj = e.changedTouches[0];
        touchPos.x = touchobj.pageX;
        touchPos.y = touchobj.pageY;
    };
    $wrap.addEventListener('touchstart', touchstartHandler, false);
    // $dot.addEventListener('touchstart', touchstartHandler, false);

    var touchmoveHandler = function (e) {
        var touchobj = e.changedTouches[0];
        if (type === 'h') {
            setOffsetX(offset.x - touchPos.x + touchobj.pageX);
        } else {
            setOffsetY(offset.y + touchPos.y - touchobj.pageY);
        }
        touchPos.x = touchobj.pageX;
        touchPos.y = touchobj.pageY;
    };
    $wrap.addEventListener('touchmove', touchmoveHandler, false);
    // $dot.addEventListener('touchmove', touchmoveHandler, false);

    var touchendHandler = function (e) {
        touchPos.x = null;
        touchPos.y = null;
        onchanged(length.progress);
    };
    $wrap.addEventListener('touchend', touchendHandler, false);
    // $dot.addEventListener('touchend', touchendHandler, false);

    Object.defineProperty(this, 'progress', {
        get: function () { return length.progress; },
        set: function (v) {
            if (v < 0) v = 0;
            if (v > 100) v = 100;
            if (type === 'h') {
                setOffsetX(offset.x + length.total * v / 100);
            } else {
                setOffsetY(offset.y + length.total * v / 100);
            }
        }
    });
};

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Slider;
    }
} else {
    window.Slider = Slider;
}
