var GameManager = {
    event: {
        isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
        type: {
            down: 'eventDown',
            move: 'eventMove',
            up: 'eventUp',
            out: 'eventOut'
        },
        eventSelector: function (eventType) {
            var selectedEvent;
            switch (eventType) {
                case this.type.down:
                    selectedEvent = this.isTouchDevice ? 'touchstart' : 'mousedown';
                    break;
                case this.type.move:
                    selectedEvent = this.isTouchDevice ? 'touchmove' : 'mousemove';
                    break;
                case this.type.up:
                    selectedEvent = this.isTouchDevice ? 'touchend' : 'mouseup';
                    break;
                case this.type.out:
                    selectedEvent = this.isTouchDevice ? 'touchleave' : 'mouseout';
                    break;
            }
            return selectedEvent;
        },
        getPos: function (e, psName) {
            if (!e.originalEvent) {
                return this.isTouchDevice ? e.changedTouches[0][psName] : e[psName];
            } else {
                return this.isTouchDevice ? e.originalEvent.changedTouches[0][psName] : e[psName];
            }
        },
        clientWidth: 0,
        clientHeight: 0,
        wrapWidth: 0,
        wrapHeight: 0,
        zoomVertical: 0,
        zoomHorizontal: 0,
        factor: 0
    }
};

/*
let mx = isMobile ? e.originalEvent.touches[0].pageX : e.pageX;
let my = isMobile ? e.originalEvent.touches[0].pageY : e.pageY;
let mouseX = mx / factor;
let mouseY = my / factor;
*/


// file:///D:/jgy/@My/90_My/00_a_물리/position_location/00_좌표계산/00/02_local_global.html
/*
https://aljjabaegi.tistory.com/455
pageX, pageY: 페이지 상단으로부터의 좌표값
offset()    : 페이지 상단으로부터의 절대좌표값(배율포함)
*/
/*
[offset]
선택된 요소의 절대좌표값을 설정하거나 절대좌표값을 리턴하는 함수입니다.
페이지 상단부터의 절대좌표값입니다. (주의)

[position]
선택된 요소의 상대좌표를 리턴하는 함수입니다.
부모 요소로 부터 떨어진 상대좌표를 리턴합니다. (주의)
*/
// 현재 보이는 상태에서의(=비율조정이 들어간) target의 절대좌표값
function getX(e, target) {
    // mobile
    if (typeof (e.pageX) === 'undefined') {
        return e.originalEvent.changedTouches[0].pageX - target.offset().left;
    }
    // other
    else {
        return e.pageX - target.offset().left;
    }
}

function getY(e, target) {
    return GameManager.event.isTouchDevice ? e.originalEvent.changedTouches[0].pageY - target.offset().top : e.pageY - target.offset().top;
}

const isNum = x => typeof x === 'number';
const px = num => `${num}px`;
const randomN = max => Math.ceil(Math.random() * max);
const randomN2 = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
const degToRad = deg => deg / (180 / Math.PI);
const radToDeg = rad => Math.round(rad * (180 / Math.PI));
const angleTo = ({ a, b }) => Math.atan2(b.y - a.y, b.x - a.x);
const adjustAngle = angle => {
    const adjustedAngle = angle % 360;
    return adjustedAngle < 0 ? adjustedAngle + 360 : adjustedAngle;
};
const getPage = (e, type) => e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`];
const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)));
const setPos = ({ el, x, y }) => Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
const setStyles = ({ el, x, y, w, h, deg }) => {
    if (w) el.style.width = px(w);
    if (h) el.style.height = px(h);
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`;
};

// 결과값을 '/ factor' 해야 실제 css값이 나옴
/*
var knX = (e.pageX - $('#wrap').offset().left) / factor;
var knY = (e.pageY - $('#wrap').offset().top) / factor;

==

knX = getX(e, $('#wrap')) / factor;
knY = getY(e, $('#wrap')) / factor;

getX(e, $('#wrap')): 현재 보이는 상태에서의 #wrap 절대좌표값
getX(e, $('#wrap')) / factor: 비율조정되지 않은 실제 css값
*/


function getXFromWrap(e) {
    // mobile
    if (typeof (e.pageX) === 'undefined') {
        return e.originalEvent.changedTouches[0].pageX - $('#wrap').offset().left;
    }
    // other
    else {
        return e.pageX - $('#wrap').offset().left;
    }
}

function getYFromWrap(e) {
    return GameManager.event.isTouchDevice ? e.originalEvent.changedTouches[0].pageY - $('#wrap').offset().top : e.pageY - $('#wrap').offset().top;
}

function getScale() {

    //* 2024-08-01 14:46:16 - JGY: iPadOS 13 userAgent 데스크탑 모드 인식 해결
    const isIpadPro = function () {

        // 방법1
        //@see https://jekim1619.tistory.com/22
        //@see https://dev.drawyourmind.com/posts/ios-ipad-detect-issue/
        /* if (navigator.userAgent.indexOf('Safari') && navigator.maxTouchPoints > 0) {
            return true;
        } */

        // 방법2
        return GameManager.event.isTouchDevice;
    };
    //*--------------------------

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isIpadPro()) {
        isMobile = true;

        downEvent = "touchstart";
        moveEvent = "touchmove";
        upEvent = "touchend";
        clickEvent = "tap";
        leaveEvent = "touchleave";
        overEvent = undefined;
        wheelEvent = undefined;
    }
    else {
        isMobile = false;

        downEvent = "mousedown";
        moveEvent = "mousemove";
        upEvent = "mouseup";
        clickEvent = "click";
        leaveEvent = "mouseout";
        overEvent = 'mouseover';
        wheelEvent = 'mousewheel';
    }
    var wrap = document.querySelector('#wrap');

    GameManager.event.clientWidth = document.body.clientWidth;
    GameManager.event.clientHeight = document.body.clientHeight;

    GameManager.event.wrapWidth = wrap.clientWidth;
    GameManager.event.wrapHeight = wrap.clientHeight;

    GameManager.event.zoomVertical = (GameManager.event.clientHeight / GameManager.event.wrapHeight) * 1.0;
    GameManager.event.zoomHorizontal = (GameManager.event.clientWidth / GameManager.event.wrapWidth) * 1.0;

    /*
    if (parent.ZOOMVALUE == undefined) {
        parent.ZOOMVALUE = 1;
    }
    if (GameManager.event.clientHeight < GameManager.event.clientWidth) {
        factor = GameManager.event.zoomRate = parent.ZOOMVALUE;
    }
    else {
        factor = GameManager.event.zoomRate = GameManager.event.zoomHorizontal;
    }

    factor = parent.ZOOMVALUE;
    */

    if (FORTEACHERCD) {
        factor = FORTEACHERCD.responsive.baseContainerSize.zoom;
        GameManager.factor = FORTEACHERCD.responsive.baseContainerSize.zoom;
    }
    return factor;
}

var factor = 1;
var isMobile;
var downEvent, moveEvent, upEvent, clickEvent, leaveEvent;

setTimeout(function () {
    getScale();
}, 100);

// IIFE
(function () {

})();


// 새로 고침 후 스크롤바 위치 재설정
window.onbeforeunload = function (e) {
    window.scrollTo(0, 0);
};


//* 2023-12-15 16:31:12 - JGY : jQuery 3.x mobile에서 실행순서가 뒤죽박죽됨
// $(function () { });

// javascript로 처리. 모든 환경에서 가장 먼저 실행됨
document.addEventListener('DOMContentLoaded', initDomReady, false);
async function initDomReady() {
    document.removeEventListener('DOMContentLoaded', initDomReady);

}

$(window).on('load', function () {

});


/*
var user;       // 사용자 환경
var browser;    // 사용 browser
$(document).ready(function () {
    var ua = navigator.userAgent.toLowerCase();
    var bodyClass = document.body.classList;
    if (ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0 && ua.indexOf('mobile') > 0) {
        if (ua.indexOf('iphone') > 0) user = 'ios';
        if (ua.indexOf('android') > 0) user = 'android';

    } else if (ua.indexOf('ipad') > 0 || ua.indexOf('mac') > 0 || ua.indexOf('android') > 0) {
        if (ua.indexOf('ipad') > 0 || ua.indexOf('mac') > 0) user = 'ios';
        if (ua.indexOf('android') > 0) user = 'android';
    } else {
        if (ua.indexOf('edge') > -1) {
            browser = 'edge';
        } else if (ua.indexOf('whale') > -1) {
            browser = 'whale';
        } else if (ua.indexOf('chrome') > -1) {
            browser = 'chrome';
        } else if (ua.indexOf('firefox') > -1) {
            browser = 'firefox';
        } else {
            browser = 'ie';
        }
        user = 'pc';
        if (ua.indexOf('Windows 7') > -1 || ua.indexOf('Windows NT 6.1') > -1) {
            $('#wrap').addClass('win7');
        }
    }
    $('#wrap').addClass(user + ' ' + browser);
});
*/

    // jQuery Plug-in
    /* (function ($) {
        $.fn.myPlugin = function (options) {

        };
    }(jQuery)); */

(function () {
    function Parent() {

        var self = this;

        // private
        var value = 9;

        // public
        this.value = '가나다';

        return this;
    }
    // prototype method
    Parent.prototype.fn = function () {
        console.log('Test!: ', this);
        console.log(this.value);
    };
    window.Parent = Parent;

    /*
    Object.defineProperty(self, 'default', {
        enumerable: true,
        configurable: true,
        value: 444
    });
    */

    var Child = function Child() {
        var p_parent = Parent.apply(this, arguments);
        //var p_parent = Test.call(this, pjContainer); // es5에서 super키워드를 쓸수가 없네;;;

        var self = this;

        var value2 = 0;

        this.value2 = 'ABC';

        this.fn2 = function () {
            console.log(p_parent);
            Test.prototype.fn();
            if (typeof value !== 'undefined') {
                console.log(value);
            } else {
                console.log(undefined);
            }
            console.log(self.value);
            console.log('-----');
            console.log(value2);
            console.log(self.value2);
        };
    };
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;

    window.Child = Child;
})();

// UMD
(function (root, factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    // CommonJS
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    // Window
    else {
        root.MyClass = factory(root.jQuery);
    }
}(this, function (jQuery) {

    function MyClass() {

        var self = this;
        var bIsEnabled = false;

        //-------
        // init
        //-------
        this.init = function () {

            bIsEnabled = true;
            return self;
        };

        //-------
        // getter / setter
        //-------
        this.enable = function (pbIsEnable) {
            if (typeof pbIsEnable !== 'undefined') {
                bIsEnabled = pbIsEnable;
                return;
            }
            return bIsEnabled;
        };


        return self;
    }

    return MyClass;

}));
