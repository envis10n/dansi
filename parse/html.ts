// deno-lint-ignore-file no-control-regex

export const colorMap: { [key: string]: string } = {
  "0;30": "ansi-black",
  "0;31": "ansi-red",
  "0;32": "ansi-green",
  "0;33": "ansi-yellow",
  "0;34": "ansi-blue",
  "0;35": "ansi-magenta",
  "0;36": "ansi-cyan",
  "0;37": "ansi-white",
  "1;30": "ansi-bold-black",
  "1;31": "ansi-bold-red",
  "1;32": "ansi-bold-green",
  "1;33": "ansi-bold-yellow",
  "1;34": "ansi-bold-blue",
  "1;35": "ansi-bold-magenta",
  "1;36": "ansi-bold-cyan",
  "1;37": "ansi-bold-white",
  "4;30": "ansi-ul-black",
  "4;31": "ansi-ul-red",
  "4;32": "ansi-ul-green",
  "4;33": "ansi-ul-yellow",
  "4;34": "ansi-ul-blue",
  "4;35": "ansi-ul-magenta",
  "4;36": "ansi-ul-cyan",
  "4;37": "ansi-ul-white",
  "40": "ansi-bg-black",
  "41": "ansi-bg-red",
  "42": "ansi-bg-green",
  "43": "ansi-bg-yellow",
  "44": "ansi-bg-blue",
  "45": "ansi-bg-magenta",
  "46": "ansi-bg-cyan",
  "47": "ansi-bg-white",
  "0": "0",
};

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
  const regHasANSI = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/;
  const reg = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/g;
  const regParse = /\x1b\[((?:(?:[014];3[0-7])|4[0-7]|0))m/;
  const tokens: string[] = [];
  let match = reg.exec(ansi);
  let index = 0;
  while (match != null) {
    const idx = match.index;
    if (idx > index) {
      tokens.push(ansi.substring(index, idx));
    }
    const token = match[0];
    const len = token.length;
    index = idx + len;
    tokens.push(token);
    match = reg.exec(ansi);
  }
  let hasOpenSpan = false;
  let currentSpanIndex = -1;
  let currentSpanClasses: [string, string] = ["", ""]; // [FG, BG]
  const res: string[] = [];
  function closeTag() {
    if (res.length - 1 != currentSpanIndex) {
      res[currentSpanIndex] = `<span class="${
        currentSpanClasses.join(" ").trim()
      }">`;
      res.push("</span>");
    }
    currentSpanClasses = ["", ""];
    currentSpanIndex = -1;
  }
  function isForegroundColor(d: string): boolean {
    return d.startsWith("0;3") || d.startsWith("1;3") || d.startsWith("4;3");
  }
  tokens.forEach((token, i) => {
    if (!regHasANSI.test(token)) {
      res.push(token);
      if (i == tokens.length - 1) {
        // last item
        if (hasOpenSpan) {
          closeTag();
        }
        return;
      }
    } else {
      const m = regParse.exec(token);
      if (m == null) return;
      const clv = m[1];
      const mapped = colorMap[clv];

      if (hasOpenSpan) {
        if (isForegroundColor(clv)) {
          // foreground color
          if (currentSpanClasses[0] != "") {
            closeTag();
            currentSpanIndex = res.push("<span goes here>") - 1;
          }
          currentSpanClasses[0] = mapped;
        } else if (clv.startsWith("4")) {
          // background color
          if (currentSpanClasses[1] != "") {
            closeTag();
            currentSpanIndex = res.push("<span goes here>") - 1;
          }
          currentSpanClasses[1] = mapped;
        } else if (clv == "0") {
          // reset
          closeTag();
          hasOpenSpan = false;
        } else {
          console.log("Unhandled color:", mapped, clv);
          throw new Error();
        }
      } else {
        hasOpenSpan = true;
        currentSpanIndex = res.push("<span goes here>") - 1;
        if (isForegroundColor(clv)) {
          // foreground color
          currentSpanClasses[0] = mapped;
        } else if (clv.startsWith("4")) {
          // background color
          currentSpanClasses[1] = mapped;
        }
      }
      if (i == tokens.length - 1) {
        // last item
        if (hasOpenSpan) {
          res[currentSpanIndex] = `<span class="${
            currentSpanClasses.join(" ").trim()
          }">`;
          res.push("</span>");
        }
      }
    }
  });
  return res.join("");
}
