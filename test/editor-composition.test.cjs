const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

// Execute the actual generated editor script. Only the DOM and native bridge
// are stubbed; paragraph formatting, composition, and change delivery are real.
function createEditor(options = {}) {
  const commands = [];
  const messages = [];
  const timers = new Map();
  let nextTimer = 0;
  let block = options.initialBlock || '';
  function element() {
    const listeners = new Map();
    return {
      innerHTML: '',
      style: {},
      appendChild(child) { this.child = child; },
      addEventListener(type, listener) { listeners.set(type, listener); },
      dispatch(type, event = {}) { listeners.get(type)?.(event); },
    };
  }
  const root = element();
  const selection = { anchorNode: null, anchorOffset: 0, focusNode: null, focusOffset: 0 };
  const document = {
    body: element(),
    documentElement: element(),
    getElementById: () => root,
    createElement: element,
    addEventListener() {},
    queryCommandState: () => false,
    queryCommandValue: () => block,
    execCommand(command, _ui, value) {
      commands.push(command);
      if (command === 'formatBlock') block = value;
      return true;
    },
  };
  const window = {
    getSelection: () => selection,
    addEventListener() {},
    ReactNativeWebView: { postMessage: message => messages.push(JSON.parse(message)) },
  };
  const context = vm.createContext({
    window, document, console,
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  });
  const source = readFileSync(resolve(__dirname, '../src/editor.js'), 'utf8')
    .replace('export { HTML, createHTML, getContentCSS };', '');
  vm.runInContext(source, context);
  const html = vm.runInContext(`createHTML(${JSON.stringify({ useContainer: false, inputListener: true, ...options })})`, context);
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
  const content = root.child;
  content.contentEditable = 'true';
  selection.anchorNode = selection.focusNode = content;
  function flush() {
    for (const [id, callback] of [...timers]) {
      timers.delete(id);
      callback();
    }
  }
  return { content, commands, messages, flush };
}

test('dictation publishes partial text without formatting its composing range', () => {
  const editor = createEditor();
  editor.content.dispatch('compositionstart');
  for (const text of ['The', 'The kitchen', 'The kitchen window has cracks']) {
    editor.content.innerHTML = text;
    editor.content.oninput({ isComposing: true, inputType: 'insertCompositionText', data: text });
    editor.flush();
    assert.equal(editor.commands.includes('formatBlock'), false);
    assert.equal(editor.messages.filter(message => message.type === 'CONTENT_CHANGE').at(-1).data, text);
  }
  editor.content.dispatch('compositionend');
  editor.flush();
  assert.equal(editor.commands.filter(command => command === 'formatBlock').length, 1);
  // A later composition must not replay the previous deferred formatting.
  editor.content.dispatch('compositionstart');
  editor.content.oninput({ isComposing: true });
  editor.content.dispatch('compositionend');
  editor.flush();
  assert.equal(editor.commands.filter(command => command === 'formatBlock').length, 1);
});

test('composition status protects input events that omit isComposing', () => {
  const editor = createEditor();
  editor.content.dispatch('compositionstart');
  editor.content.innerHTML = 'Testing';
  editor.content.oninput({});
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), false);
  editor.content.dispatch('compositionend');
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), true);
});

test('isComposing protects input without a preceding compositionstart', () => {
  const editor = createEditor();
  editor.content.innerHTML = 'Testing';
  editor.content.oninput({ isComposing: true });
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), false);
  editor.content.dispatch('compositionend');
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), true);
});

test('ordinary typing keeps paragraph formatting and change delivery', () => {
  const editor = createEditor();
  editor.content.innerHTML = 'Typed text';
  editor.content.oninput({ inputType: 'insertText' });
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), true);
  assert.equal(editor.messages.find(message => message.type === 'CONTENT_CHANGE').data, 'Typed text');
});

test('composition in existing formatted content does not reformat it', () => {
  const editor = createEditor({ initialBlock: 'p' });
  editor.content.dispatch('compositionstart');
  editor.content.innerHTML = '<p><strong>Existing text</strong> 新しい文字</p>';
  editor.content.oninput({ isComposing: true });
  editor.flush();
  editor.content.dispatch('compositionend');
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), false);
  assert.equal(editor.messages.find(message => message.type === 'CONTENT_CHANGE').data, editor.content.innerHTML);
});

test('isComposing is respected when character tracking is disabled', () => {
  const editor = createEditor({ useCharacter: false });
  editor.content.dispatch('compositionstart');
  editor.content.innerHTML = '入力';
  editor.content.oninput({ isComposing: true });
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), false);
  assert.equal(editor.messages.find(message => message.type === 'CONTENT_CHANGE').data, '入力');
  editor.content.dispatch('compositionend');
  editor.content.oninput({ isComposing: false });
  editor.flush();
  assert.equal(editor.commands.includes('formatBlock'), true);
});

test('paste and deletion keep publishing their current content', () => {
  const editor = createEditor({ initialBlock: 'p' });
  for (const [inputType, html] of [['insertFromPaste', '<p>Pasted text</p>'], ['deleteContentBackward', '']]) {
    editor.content.innerHTML = html;
    editor.content.oninput({ inputType });
    editor.flush();
    assert.equal(editor.messages.filter(message => message.type === 'CONTENT_CHANGE').at(-1).data, html);
  }
});
