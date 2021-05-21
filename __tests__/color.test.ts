import { assertEquals } from "../deps/asserts.ts";
import {
  bold,
  Color,
  ColorValue,
  cyan,
  parse,
  red,
  underline,
  yellow,
} from "../mod.ts";

Deno.test("color-general", () => {
  const v = red("Hello, ") + yellow("world!");
  assertEquals(v, "\x1b[0;31mHello, \x1b[0m\x1b[0;33mworld!\x1b[0m");
});

Deno.test("color-class", () => {
  const color = new Color();
  color.background = ColorValue.CYAN;
  color.foreground = ColorValue.WHITE;
  const v = color.colorize("Hello, world!");
  assertEquals(v, "\x1b[46m\x1b[0;37mHello, world!\x1b[0m");
});

Deno.test("style-bold", () => {
  const v = red("Hello, world!");
  const sv = bold(v);
  assertEquals(sv, "\x1b[1;31mHello, world!\x1b[0m");
});

Deno.test("style-underline", () => {
  const v = cyan("Hello, world!");
  const uv = underline(v);
  assertEquals(uv, "\x1b[4;36mHello, world!\x1b[0m");
});

Deno.test("ansi-to-html", () => {
  const v = cyan("Hello, world!");
  const hv = parse.html.toHTML(v);
  assertEquals(hv, '<span class="ansi-cyan">Hello, world!</span>');
});

Deno.test("ansi-to-html-bg", () => {
  const v = new Color(ColorValue.CYAN);
  v.background = ColorValue.BLACK;
  const hv = parse.html.toHTML(v.colorize("Hello, world!"));
  assertEquals(
    hv,
    '<span class="ansi-cyan ansi-bg-black">Hello, world!</span>',
  );
});

Deno.test("ansi-to-html-style-bg", () => {
  const v = new Color(ColorValue.CYAN).underline();
  v.background = ColorValue.BLACK;
  const hv = parse.html.toHTML(v.colorize("Hello, world!"));
  assertEquals(
    hv,
    '<span class="ansi-ul-cyan ansi-bg-black">Hello, world!</span>',
  );
});
