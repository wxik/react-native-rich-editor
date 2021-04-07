
//console.log = function (){ postAction({type: 'LOG', data: Array.prototype.slice.call(arguments)});};
const HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <style>
        * {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;}
        html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif; font-size:1em;}
        body { overflow-y: hidden; -webkit-overflow-scrolling: touch;height: 100%;background-color: #FFF;}
        img {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        video {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        .content {  font-family: Arial, Helvetica, sans-serif;color: #000033; width: 100%;height: 100%;-webkit-overflow-scrolling: touch;padding-left: 0;padding-right: 0;}
        .pell { height: 100%;}
        .pell-content { outline: 0; overflow-y: auto;padding: 10px;height: 100%;}
        table {width: 100% !important;}
        table td {width: inherit;}
        table span { font-size: 12px !important; }
        .audioctn {display: flex; height:64px; flex-direction:row; border: 1px solid black; border-radius: 5px;padding-left: 8px;}
        .audioctn .imgctn {display: flex; height:64px;justify-content:center; flex-direction:column;}
        .audioctn img { width: 48px; height: 48px; border-radius: 8px; margin-right: 8px; }
        .audioctn .txtctn {display: flex; height:64px;justify-content:center; flex-direction:column;flex: 1;}
        .audioctn .title {font-size: 14px; color: #000000;}
        .audioctn .artist {color: #999999;font-size:12px;}
        .audioctn .btnctn {display: flex; height:64px;justify-content:center; flex-direction:column; width: 64px;}
        .audioctn .playbtn {background-color:#000000; border-radius: 25px; width: 50px; height:50px;}
        .audioctn .triangle {width: 0; height: 0; border-width: 12px 0 12px 20.8px;border-color: transparent transparent transparent #FFFFFF; border-style: solid;position: relative; left: 17px; top: 13px;}
        span[data-name=collage] { height: 450px; }
        .scrolling-wrapper { height: 150px; display: flex; flex-wrap: nowrap; overflow-x: auto; max-width: 98%; margin-top: 8px; padding-left: 4px;}
        .scrolling-wrapper .card { flex: 0 0 auto; }
        .scrolling-wrapper img { height: 150px; margin-right: 8px; }
        span[data-name=poll] p {margin-bottom: 8px;}
        span[data-name=poll] .container {display: flex; flex-direction:row; margin-bottom: 8px;}
        span[data-name=poll] .chkctn {padding-top: 5px; margin-right: 4px;}
        span[data-name=poll] .chk {height: 20px; width: 20px;}
        span[data-name=poll] .option {border: 1px solid #eeeeee; border-radius: 4px; flex: 1; padding: 8px;}
        span[data-name=poll] .count {margin-left: 4px; padding-top: 8px; font-size:16px;}
        div.pell-content[contentEditable="true"]:empty:before {
            content: attr(placeholder);
            color: #898c8b
          }
    </style>
</head>
<body>
<div class="content"><div id="editor" class="pell"></div></div>
<script>
    (function (exports) {
        var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
        var formatBlock = 'formatBlock';
        var addEventListener = function addEventListener(parent, type, listener) {
            return parent.addEventListener(type, listener);
        };
        var appendChild = function appendChild(parent, child) {
            return parent.appendChild(child);
        };
        var createElement = function createElement(tag) {
            return document.createElement(tag);
        };
        var queryCommandState = function queryCommandState(command) {
            return document.queryCommandState(command);
        };
        var queryCommandValue = function queryCommandValue(command) {
            return document.queryCommandValue(command);
        };

        var exec = function exec(command) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            return document.execCommand(command, false, value);
        };
        
        var postAction = function(data){
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        };

        var editor = null, o_height = 0, body_height = 0;
        
        var Actions = {
            bold: {
                state: function() {
                    return queryCommandState('bold');
                },
                result: function() {
                    return exec('bold');
                }
            },
            italic: {
                state: function() {
                    return queryCommandState('italic');
                },
                result: function() {
                    return exec('italic');
                }
            },
            underline: {
                state: function() {
                    return queryCommandState('underline');
                },
                result: function() {
                    return exec('underline');
                }
            },
            strikethrough: {
                state: function() {
                    return queryCommandState('strikeThrough');
                },
                result: function() {
                    return exec('strikeThrough');
                }
            },
            heading1: {
                result: function() {
                    return exec(formatBlock, '<h1>');
                }
            },
            heading2: {
                result: function() {
                    return exec(formatBlock, '<h2>');
                }
            },
            paragraph: {
                result: function() {
                    return exec(formatBlock, '<p>');
                }
            },
            quote: {
                result: function() {
                    return exec(formatBlock, '<blockquote>');
                }
            },
            orderedList: {
                state: function() {
                    return queryCommandState('insertOrderedList');
                },
                result: function() {
                    return exec('insertOrderedList');
                }
            },
            unorderedList: {
                state: function() {
                    return queryCommandState('insertUnorderedList');
                },
                result: function() {
                    return exec('insertUnorderedList');
                }
            },
            code: {
                result: function() {
                    return exec(formatBlock, '<pre>');
                }
            },
            line: {
                result: function() {
                    return exec('insertHorizontalRule');
                }
            },
            link: {
                result: function(url) {
                    if (url) exec('createLink', url);
                }
            },
            image: {
                result: function(url) {
                    if (url) { exec('insertHTML', "<br><div><img src='"+ url +"'/></div><br>");}
                }
            },
            collage: {
                result: function(obj) {
                    if (obj.images) {
                        
                        var str = "<br><span data-name='collage' data-images='" + encodeURIComponent(JSON.stringify(obj)) + "'><div><img src='"+ obj.images[0] +"'/></div>";
                        str += "<div class=scrolling-wrapper>";

                        for (var i = 1; i < obj.images.length; i++) {
                            str += "<div class=card><img src='"+ obj.images[i] +"'/></div>";
                        }

                        str += "</div></span><br/><br/>";
                        exec('insertHTML', str);
                    }
                }
            },
            video: {
                result: function(url) {
                    var thumbnail = url.replace('.mp4', '').replace('.m3u8', '') + '-thumbnail';
                    if (url) { exec('insertHTML', "<br><div><video src='"+ url +"' poster='"+ thumbnail + "' controls><source src='"+ url +"' type='video/mp4'>No video tag support</video></div><br>");}
                }
            },
            tag: {
                result: function(obj) {
                    if (obj.link) {
                        for (i = 0; i <= obj.text.length; i++) {
                            exec('delete');
                        }
                        
                        exec('insertHTML', obj.link);
                    }
                }
            },
            hashtag: {
                result: function(obj) {
                    if (obj.hashtag) {
                        for (i = 0; i <= obj.text.length; i++) {
                            exec('delete');
                        }
                        
                        exec('insertHTML', obj.hashtag);
                    }
                }
            },
            audio: {
                result: function(obj) {
                    if (obj.url) {
                        exec('insertHTML', "<br><span data-name='audio' data-track='" + encodeURIComponent(JSON.stringify(obj)) + "' /><div class=audioctn><div class=imgctn><img src='" + obj.artwork + "' /></div><div class=txtctn><div class=title>" + obj.title + "</div><div class=artist>" + obj.artist + "</div></div><div class=btnctn><div class=playbtn><div class=triangle>&nbsp;</div></div></div></div></span><br/><br/>");
                    }
                }
            },
            poll: {
                result: function(obj) {
                    var str = "<br><span data-name='poll' data-poll='" + encodeURIComponent(JSON.stringify(obj)) + "'><p>" + obj.description + "</p>";                    

                    for (var i = 0; i < obj.answer.length; i++) {
                        str += "<div class=container>";
                        str += "<div class=chkctn><input type=" + (obj.mode = 'multiple' ? "checkbox" : "radio") + " class=chk></div>";
                        str += "<div class=option>" + obj.answer[i].value + "</div>";
                        str += "<span class=count>0" + (obj.displayAs === 'percentage' ? "%" : "") + "</span>";
                        str += "</div>";
                    }
                    
                    str += "</span><br/><br/>";

                    exec('insertHTML', str);
                    }
            },
            youtube: {
                result: function(obj) {                    
                    var str = "<br/><span data-name='youtube' data-video='" + encodeURIComponent(JSON.stringify(obj)) + "'>";
                    str += "<img src='"+ obj.thumbnail +"'/>";
                    str += "</span><br/><br/>"

                    exec('insertHTML', str);
                }
            },
            content: {
                setHtml: function(html) {
                    editor.content.innerHTML = html;
                },
                setMinHeight: function(height) {
                    editor.content.style.minHeight = height + 'px';
                },
                getHtml: function() {
                    return editor.content.innerHTML;
                },
                blur: function() {
                    editor.content.blur();
                },
                focus: function() {
                    if (editor.content.lastChild) {
                        const length = editor.content.lastChild.textContent ? editor.content.lastChild.textContent.length  : 1;
                        var range = document.createRange();
                        var sel = window.getSelection();
                        range.setStart(editor.content.lastChild, 0);
                        range.setStart(editor.content.lastChild, length);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    editor.content.focus();
                },
                postHtml: function (){
                    postAction({type: 'CONTENT_HTML_RESPONSE', data: editor.content.innerHTML});
                },
                setBgColor: function(color) {
                    document.body.style.backgroundColor = color;
                }
            },

            UPDATE_HEIGHT: function() {
                var height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
                if (body_height !== document.body.clientHeight) {
                    postAction({type: 'BODY_HEIGHT', data: body_height = document.body.clientHeight});
                }
                if (o_height !== height){
                    postAction({type: 'OFFSET_HEIGHT', data: o_height = height});
                }
            }
        };

        var init = function init(settings) {

            var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';


            var content = settings.element.content = createElement('div');
            content.contentEditable = true;
            content.spellcheck = false;
            content.autocapitalize = 'off';
            content.autocorrect = 'off';
            content.autocomplete = 'off';
            content.setAttribute('placeholder', '{PH}');
            content.className = "pell-content";
            content.oninput = function (_ref) {
                var firstChild = _ref.target.firstChild;

                if (firstChild && firstChild.nodeType === 3) exec(formatBlock, '<' + defaultParagraphSeparator + '>');else if (content.innerHTML === '<br>') content.innerHTML = '';
                settings.onChange(content.innerHTML);
            };
            content.onkeydown = function (event) {
                if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                    setTimeout(function () {
                        return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                    }, 0);
                }
            };
            appendChild(settings.element, content);

            if (settings.styleWithCSS) exec('styleWithCSS');
            exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

            var actionsHandler = [];
            for (var k in Actions){
                if (typeof Actions[k] === 'object' && Actions[k].state){
                    actionsHandler[k] = Actions[k]
                }
            }

            var handler = function handler() {

                var activeTools = [];
                for(var k in actionsHandler){
                    if ( Actions[k].state() ){
                        activeTools.push(k);
                    }
                }
                console.log('change', activeTools);
                postAction({type: 'SELECTION_CHANGE', data: activeTools});
                return true;
            };
            addEventListener(content, 'touchend', function(){
                setTimeout(handler, 100);
            });
            addEventListener(content, 'blur', function () {
                postAction({type: 'SELECTION_CHANGE', data: []});
                postAction({type: 'CONTENT_BLUR'});
            });
            addEventListener(content, 'focus', function () {
                postAction({type: 'CONTENT_FOCUSED'});
            });
            addEventListener(content, 'keyup', function (e) {
                var selection = window.getSelection();
                var anchor_node = selection.anchorNode;
                var previous_node = anchor_node.previousSibling;
                //alert(anchor_node.nodeName);
                //alert(e.keyCode);
                if ((anchor_node.nodeName.toLowerCase() === 'span' || previous_node?.nodeName.toLowerCase() === 'span') && (e.keyCode === 8 || e.key === 'Backspace')) {
                    var range = document.createRange();
                    range.selectNodeContents(previous_node);
                    range.deleteContents();
                }
                postAction({type: 'CONTENT_CHANGE', data: { key: e.key, keyCode: e.keyCode, shiftKey: e.shiftKey, content: content.innerText, html: content.innerHTML }});
            });
            addEventListener(content, 'paste', function (e) {
                // get text representation of clipboard
                var text = (e.originalEvent || e).clipboardData.getData('text/html');
                postAction({type: 'CONTENT_PASTED', data: { text }});
            });
            
            var message = function (event){
                var msgData = JSON.parse(event.data), action = Actions[msgData.type];
                if (action ){
                    if ( action[msgData.name]){
                        action[msgData.name](msgData.data);
                        if (msgData.name === 'result'){
                            content.focus();
                            handler();
                        }
                    } else {
                        action(msgData.data);
                    }
                }
            };

            document.addEventListener("message", message , false);
            window.addEventListener("message", message , false);
            document.addEventListener('touchend', function () {
                content.focus();
            });
            return settings.element;
        };

        var _handleCTime = null;
        editor = init({
            element: document.getElementById('editor'),
            defaultParagraphSeparator: 'div',
            onChange: function (){
                clearTimeout(_handleCTime);
                _handleCTime = setTimeout(function(){
                    var data = { content: Actions.content.getHtml() };
                    //postAction({type: 'CONTENT_CHANGE', data });
                }, 50);
            }
        })
    })(window);
</script>
</body>
</html>
`;

export {
    HTML
}
