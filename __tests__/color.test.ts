import { assertEquals } from "../deps/asserts.ts";
import {
  bold,
  Color,
  ColorValue,
  cyan,
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
