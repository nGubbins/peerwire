const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Extract the <script> block from index.html and evaluate it in a sandboxed
// context with minimal browser stubs, so we can call the pure utility functions.
const html = fs.readFileSync(
  path.join(__dirname, '../src/p2p-messenger/index.html'), 'utf-8'
);
const script = html.match(/<script>([\s\S]+)<\/script>/)[1];

const mockEl = {
  textContent: '', className: '', innerHTML: '', value: '',
  style: { display: '', height: '' },
  onclick: null, onchange: null,
  addEventListener: () => {},
  appendChild: () => {},
  querySelector: () => null,
  scrollTop: 0, scrollHeight: 0,
  focus: () => {}, select: () => {}, remove: () => {},
};

const ctx = vm.createContext({
  URLSearchParams,
  setTimeout: () => {},
  console,
  document: {
    getElementById: () => mockEl,
    documentElement: { getAttribute: () => null, setAttribute: () => {} },
    createElement: () => Object.assign({}, mockEl, { style: { display: '', height: '' } }),
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  location: { search: '' },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  WebSocket: class { constructor() {} close() {} send() {} },
});

vm.runInContext(script, ctx);

// ── splitMsg ──────────────────────────────────────────

test('splitMsg: short message is one chunk', () => {
  assert.deepEqual(ctx.splitMsg('hello'), ['hello']);
});

test('splitMsg: empty string produces one empty chunk', () => {
  assert.deepEqual(ctx.splitMsg(''), ['']);
});

test('splitMsg: exactly 160 chars stays as one chunk', () => {
  const text = 'a'.repeat(160);
  const parts = ctx.splitMsg(text);
  assert.equal(parts.length, 1);
  assert.equal(parts[0].length, 160);
});

test('splitMsg: 161 chars splits into chunks of [160, 1]', () => {
  const text = 'a'.repeat(161);
  const parts = ctx.splitMsg(text);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].length, 160);
  assert.equal(parts[1].length, 1);
});

test('splitMsg: chunks reassemble to the original text', () => {
  const text = 'The quick brown fox. '.repeat(20); // 420 chars → 3 chunks
  const parts = ctx.splitMsg(text);
  assert.equal(parts.length, 3);
  assert.equal(parts.join(''), text);
});

// ── esc ───────────────────────────────────────────────

test('esc: escapes &', () => {
  assert.equal(ctx.esc('a&b'), 'a&amp;b');
});

test('esc: escapes <', () => {
  assert.equal(ctx.esc('<b>'), '&lt;b>');
});

test('esc: escapes >', () => {
  assert.equal(ctx.esc('1>0'), '1&gt;0');
});

test('esc: escapes all three in one string', () => {
  assert.equal(ctx.esc('<b>a&b</b>'), '&lt;b&gt;a&amp;b&lt;/b&gt;');
});

test('esc: clean string passes through unchanged', () => {
  assert.equal(ctx.esc('hello world'), 'hello world');
});

test('esc: coerces non-string to string before escaping', () => {
  assert.equal(typeof ctx.esc(42), 'string');
  assert.equal(ctx.esc(42), '42');
});

// ── genId ─────────────────────────────────────────────

test('genId: matches expected format [A-Z0-9]+-[A-Z0-9]+', () => {
  assert.match(ctx.genId(), /^[A-Z0-9]+-[A-Z0-9]+$/);
});

test('genId: produces unique IDs', () => {
  const ids = Array.from({ length: 50 }, () => ctx.genId());
  assert.equal(new Set(ids).size, 50);
});

// ── decodeIdTs ────────────────────────────────────────

test('decodeIdTs: recovers timestamp from a genId-produced ID', () => {
  const before = Date.now();
  const id = ctx.genId();
  const after = Date.now();
  const decoded = ctx.decodeIdTs(id);
  assert.ok(decoded instanceof Date, 'should return a Date');
  assert.ok(decoded.getTime() >= before && decoded.getTime() <= after);
});

test('decodeIdTs: returns null when timestamp segment is empty', () => {
  assert.equal(ctx.decodeIdTs('-SUFFIX'), null);
});
