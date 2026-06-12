// preload image
/* (function () {
    const url = `inc/images/00/`;
    imgPreLoad([
        `${url}image.png`,
    ], true);
})(); */

// preload audio
/* audioPreLoad(['00_01', '00_02', '00_03'], function () {
}); */
//-----------------------

// next, prev, dot 클릭
/*
$(document).on('click', '.navigation .prev, .navigation .next, .navigation .dot', function () {
    var idx = pageCon1.currentPage;
    var page = pageCon1.wrap.find('.page').eq(idx);
    contentScript(idx, page);
});
*/

this.initContentsIn = function () {
};

this.resetPopIn = function () {
};

this.resetContentsIn = function () {
};

function contentScript(_idx, _page) {
    if (typeof (videoCon) !== 'undefined') { videoCon.stop(); }
    if (typeof (resetPopIn) !== 'undefined') { resetPopIn(); }
    if (typeof (resetContentsIn) !== 'undefined') { resetContentsIn(); }

    switch (contentsIdx) {
        case 0:
            let checkerId = setInterval(function () {
                if (typeof factor !== 'undefined' && factor !== 1) {
                    clearInterval(checkerId);
                    run();
                }
            }, 1000 / 60);
            break;
        case 1:
            break;
        case 2:
            break;
    }
}

function run() {
    let isDebugMode = true;

    // const debugWindow = new DebugWindow({cssURL: './inc/css/aa.css'});
    const debugWindow = new DebugWindow();
    if (isDebugMode === true) {
        /* this.debugWindow.loadCSS(undefined, function () {
            console.log('your-styles.css has loaded!');
        }); */
        debugWindow.init();
        /* debugWindow.setEnabled(true);
        debugWindow.createDebugWindow(); */
    }

    /* getScale();
    const factor = FORTEACHERCD.responsive.baseContainerSize.zoom; */

    let logCnt = 1;
    let infoCnt = 1;
    let warnCnt = 1;
    let errorCnt = 1;

    const $btnWrap = contents.find('.btnWrap');
    $btnWrap.find('.btn').on('click', function () {
        switch ($(this).attr('data-role')) {
            case 'log':
                debugLog(`log_${logCnt++}`);
                break;
            case 'info':
                debugLog(`info_${infoCnt++}`, 'info');
                break;
            case 'warn':
                debugLog(`warn_${warnCnt++}`, 'warn');
                break;
            case 'error':
                // debugLog(`error_${errorCnt++}`, 'error');
                error('123'); //! 강제 에러 발생
                break;
        }
    });
}


const DebugWindow = function DebugWindow(data) {
    let self = this;
    // this.wrap = wrap;
    this.root = undefined;

    // let value = data.value || 0;

    const defaults = {
        value: 0,
        cssURL: `./inc/css/debugWindow.css`,
    };
    data = $.extend(true, {}, defaults, data);

    this.elements = {
        debugWindow: undefined,
        logContainer: undefined,
        dragArea: undefined,
        btnMin: undefined,
        btnMax: undefined,
        btnClose: undefined,
        btnClear: undefined,
    };

    const timeoutId = {};

    const intervalId = {};

    let dragInfo = {
        isDrag: false,
        startX: undefined,
        startY: undefined,
    };

    this.isEnabled = false;

    this.init = function () {
        // self.makeUI();

        self.reset();
        addEvent();

        //*-----------------

        self.loadCSS();
        self.setEnabled(true);
        self.createDebugWindow();
    };

    this.makeUI = function () {
        self.wrap.empty();
        let html = ``;
        self.wrap.append(html);
        /* self.wrap.find('.listWrap li').remove();

        self.elements.menuWrap = self.wrap.find('.menuWrap'); */
    };

    this.reset = function () {
        for (let prop in timeoutId) {
            clearTimeout(timeoutId[prop]);
        }
        for (let prop in intervalId) {
            clearTimeout(intervalId[prop]);
        }

        for (let prop in self.elements) {
            self.elements[prop] = undefined;
        }
    };

    const addEvent = function () {
    };

    //*-----------------------------------------

    this.loadCSS = function (cssUrl, callback) {
        let url = cssUrl || data.cssURL;
        console.log('loadCSS: ', url);

        callback = function () {
            console.log('loadCSS - callback');
        };

        loadCSSFromTag(url, callback);

        // CORS
        /* loadCSSFromText(url)
            .then(function () {
                if (callback && typeof callback === 'function') {
                    callback();
                }
            })
            .catch(console.error); */
    };

    function loadCSSFromTag(url, callback) {
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;

        link.onload = function () {
            if (callback && typeof callback === 'function') {
                callback();
            }
        };

        document.getElementsByTagName('head')[0].appendChild(link);
    }

    async function loadCSSFromText(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`CSS 로딩 실패: ${response.status}`);
            }

            const cssText = await response.text();

            let styleTag = document.querySelector('style-debug');
            if (styleTag === null) {
                styleTag = document.createElement('style');
                styleTag.id = 'style-debug';
                styleTag.type = 'text/css';
                document.head.appendChild(styleTag);
            }

            styleTag.textContent = cssText;
            // styleTag.appendChild(document.createTextNode(cssText));
        } catch (error) {
            console.error('CSS 로딩에 실패했습니다:', error);
        }
    }

    this.setEnabled = function (enable) {
        self.isEnabled = enable;

        if (enable === false && typeof self.elements.debugWindow !== 'undefined') {
            self.closeDebugWindow();
        }
    };

    this.isDebugEnabled = function () {
        return self.isEnabled;
    };


    this.createDebugWindow = function () {
        let html = `
            <div id="debug-window" data-state="max">
                <div class="top-area">
                    <p class="title">🐛 Debug Window</p>
                    <div class="drag-area"></div>
                    <div class="btn-area">
                        <button class="btn-toggle-show"><span class="icon icon1" data-role="min">🗕<!--➖--></span><span class="icon icon2" data-role="max">🗖<!--🔍--></span></button>
                        <button class="btn-close">❌</button>
                    </div>
                </div>
                <div class="mid-area">
                    <div class="log" data-tp="log"><span class="time">[오후 3:17:37]</span><span class="type"></span><span class="msg">🔧 Debug window initialized</span><button class="btn-remove">❌</button></div>
                    <div class="log" data-tp="info"><span class="time">[오후 3:17:37]</span><span class="type"></span><span class="msg">🔧 Debug window initialized</span><button class="btn-remove">❌</button></div>
                    <div class="log" data-tp="warn"><span class="time">[오후 3:17:37]</span><span class="type"></span><span class="msg">🔧 Debug window initialized</span><button class="btn-remove">❌</button></div>
                    <div class="log" data-tp="error"><span class="time">[오후 3:17:37]</span><span class="type"></span><span class="msg">🔧 Debug window initialized</span><button class="btn-remove">❌</button></div>
                </div>
                <div class="bottom-area">
                    <button class="btn-clear">🗑️ Clear</button>
                </div>
            </div>
        `;

        if ($('body').find('#debug-window').length > 0) {
            $('body').find('#debug-window').remove();
        }

        self.elements.debugWindow = $(html);
        self.elements.logContainer = self.elements.debugWindow.find('.mid-area');
        self.elements.dragArea = self.elements.debugWindow.find('.drag-area');
        self.elements.btnMin = self.elements.debugWindow.find('.btn-toggle-show [data-role="min"]');
        self.elements.btnMax = self.elements.debugWindow.find('.btn-toggle-show [data-role="max"]');
        self.elements.btnClose = self.elements.debugWindow.find('.btn-close');
        self.elements.btnClear = self.elements.debugWindow.find('.btn-clear');

        // self.elements.btnClear.css({});
        // self.elements.btnClear[0].cssText = ``;

        self.elements.logContainer.empty();

        self.elements.btnMin.off().on('click', function () {
            self.minimize();
        });

        self.elements.btnMax.off().on('click', function () {
            self.maximize();
        });

        self.elements.btnClose.off().on('click', function () {
            self.closeDebugWindow();
        });

        self.elements.btnClear.off().on('click', function () {
            self.clearLog();
        });

        $('body').append(self.elements.debugWindow);

        window.debugWin = self;
        window.debugLog = self.debugLog.bind(self);


        //* catch ERROR
        //https://javascript.info/onload-onerror
        window.onerror = function (errorMsg, url, lineNumber) {
            // console.log(arguments);

            const msg = `Error: ${errorMsg} Script: ${url} Line: ${lineNumber}`;
            window.debugLog(msg, 'error');

            // 기본 오류 메시지 표시를 막기
            // return true;
        };

        self.debugLog('🔧 Debug window initialized');


        // 드래그 처리
        self.elements.dragArea.off(downEvent);
        self.elements.dragArea[0].addEventListener(downEvent, onDown, { passive: false });

    };

    this.closeDebugWindow = function () {
        if (typeof self.elements.debugWindow !== 'undefined') {
            $('body').find('#debug-window').remove();

            self.reset();
        }
    };




    const onDown = function (e) {
        if (e.stopPropagation) e.stopPropagation();
        drag(e, 'start');
    };

    const onMove = function (e) {
        if (e.cancelable) e.preventDefault();
        drag(e, 'move');
    };

    const onUp = function (e) {
        if (e.cancelable) e.preventDefault();
        drag(e, 'end');
    };

    const drag = function (e, type) {
        /* getScale();
        const factor = FORTEACHERCD.responsive.baseContainerSize.zoom; */
        const factor = 1;

        let mx, my;

        switch (type) {
            case 'start':
                self.elements.dragArea.addClass('drag');

                mx = isMobile ? e.touches[0].clientX : e.clientX;
                my = isMobile ? e.touches[0].clientY : e.clientY;

                dragInfo.isDrag = true;

                dragInfo.startX = mx - self.elements.debugWindow.position().left;
                dragInfo.startY = my - self.elements.debugWindow.position().top;

                // mobile에서 기본 swipe 제어를 위해 분기 처기
                if (isMobile) {
                    self.elements.dragArea[0].addEventListener(moveEvent, onMove, { passive: false });
                }
                else {
                    document.addEventListener(moveEvent, onMove, { passive: false });
                }
                document.addEventListener(upEvent, onUp, { passive: false });
                break;
            case 'move':
                if (dragInfo.isDrag) {
                    self.elements.debugWindow.addClass('dragging');

                    mx = isMobile ? e.touches[0].clientX : e.clientX;
                    my = isMobile ? e.touches[0].clientY : e.clientY;

                    let posX = (mx - dragInfo.startX) / factor;
                    let posY = (my - dragInfo.startY) / factor;

                    self.elements.debugWindow.css({
                        left: `${posX}px`,
                        top: `${posY}px`,
                    });

                    self.elements.dragArea.find('*').addClass('moveDis');
                }
                break;
            case 'end':
                self.elements.debugWindow.removeClass('dragging');

                mx = isMobile ? e.changedTouches[0].clientX : e.clientX;
                my = isMobile ? e.changedTouches[0].clientY : e.clientY;

                if (isMobile) {
                    self.elements.dragArea[0].removeEventListener(moveEvent, onMove);
                }
                else {
                    document.removeEventListener(moveEvent, onMove);
                }

                document.removeEventListener(upEvent, onUp);

                dragInfo.isDrag = false;
                self.elements.dragArea.find('.moveDis').removeClass('moveDis');
                break;
        }
    };













    this.minimize = function () {
        self.elements.debugWindow.attr('data-state', 'min');
    };

    this.maximize = function () {
        self.elements.debugWindow.attr('data-state', 'max');
        self.updateScroll();
    };

    this.updateScroll = function () {
        self.elements.logContainer[0].scrollTop = self.elements.logContainer[0].scrollHeight;
    };








    this.clearLog = function () {
        if (typeof self.elements.logContainer === 'undefined') {
            self.createDebugWindow();
        }

        self.elements.logContainer.empty();
        self.updateScroll();
    };

    this.debugLog = function (log, type) {
        if (!self.isEnabled) {
            console.log(log);
            return;
        }

        type = type || 'log';

        switch (type) {
            case 'log':
                console.log(log);
                break;
            case 'info':
                console.info(log);
                break;
            case 'warn':
                console.warn(log);
                break;
            case 'error':
                console.error(log);
                break;
        }

        if (typeof self.elements.logContainer === 'undefined') {
            self.createDebugWindow();
        }

        let html = `
            <div class="log" data-tp="${type}"><span class="time">[${new Date().toLocaleTimeString()}]</span><span class="type"></span><span class="msg">${log}</span><button class="btn-remove">❌</button></div>
        `;

        const $log = $(html);
        $log.find('.btn-remove').on('click', function () {
            // $(this).closest('.log').remove();
            $log.remove();
            // self.updateScroll();
        });

        self.elements.logContainer.append($log);
        self.updateScroll();
    };

    this.userAgentLog = function () {
        self.debugLog(navigator.userAgent, 'info');
    };
};
