import { toAnsiObjects } from "./object.ts";

export const defaultPalette: { [key: string]: string } = {
  "ansi-black": "black",
  "ansi-red": "red",
  "ansi-green": "green",
  "ansi-yellow": "yellow",
  "ansi-blue": "blue",
  "ansi-magenta": "magenta",
  "ansi-cyan": "cyan",
  "ansi-white": "white",
  "ansi-bold-black": "grey",
  "ansi-bold-red": "red",
  "ansi-bold-green": "lime",
  "ansi-bold-yellow": "yellow",
  "ansi-bold-blue": "blue",
  "ansi-bold-magenta": "magenta",
  "ansi-bold-cyan": "cyan",
  "ansi-bold-white": "white",
  "ansi-bg-black": "black",
  "ansi-bg-red": "red",
  "ansi-bg-green": "green",
  "ansi-bg-yellow": "yellow",
  "ansi-bg-blue": "blue",
  "ansi-bg-magenta": "magenta",
  "ansi-bg-cyan": "cyan",
  "ansi-bg-white": "white",
  "ansi-ul-black": "black",
  "ansi-ul-red": "red",
  "ansi-ul-green": "green",
  "ansi-ul-yellow": "yellow",
  "ansi-ul-blue": "blue",
  "ansi-ul-magenta": "magenta",
  "ansi-ul-cyan": "cyan",
  "ansi-ul-white": "white",
};

export function generateCSSClasses(): string {
  const classes: string[] = [];
  for (const name of Object.keys(defaultPalette)) {
    const value = defaultPalette[name];
    let cl: string[];
    if (name.startsWith("ansi-ul-")) {
      // underline
      cl = [
        "text-decoration: underline;",
        `text-decoration-color: ${value};`,
        `color: ${value};`,
      ];
    } else if (name.startsWith("ansi-bold-")) {
      // bold color
      cl = ["font-weight: bold;", `color: ${value};`];
    } else if (name.startsWith("ansi-bg-")) {
      // bg color
      cl = [`background-color: ${value};`];
    } else {
      // normal color
      cl = [`color: ${value};`];
    }
    classes.push(`.${name} {\n${cl.map((v) => `  ${v}`).join("\n")}\n}`);
  }
  return classes.join("\n");
}

export function toHTML(ansi: string): string {
  const objs = toAnsiObjects(ansi);
  return objs.map((ob) =>
    `<span class="${ob.classes.join(" ")}">${ob.text}</span>`
  ).join("");
}
