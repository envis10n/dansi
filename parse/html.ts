// deno-lint-ignore-file no-control-regex

export const colorMap: { [key: string]: string } = {
  30: "ansi-black",
  31: "ansi-red",
  32: "ansi-green",
  33: "ansi-yellow",
  34: "ansi-blue",
  35: "ansi-magenta",
  36: "ansi-cyan",
  37: "ansi-white",
  40: "ansi-bg-black",
  41: "ansi-bg-red",
  42: "ansi-bg-green",
  43: "ansi-bg-yellow",
  44: "ansi-bg-blue",
  45: "ansi-bg-magenta",
  46: "ansi-bg-cyan",
  47: "ansi-bg-white",
};

export const styleMap: { [key: string]: string } = {
  0: "",
  1: "ansi-bold",
  4: "ansi-underline",
};

export function toHTML(ansi: string): string {
  // TODO: Parse ANSI string and map colors to HTML style classes.
  const regHasANSI = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/;
  const regANSIBg = /\x1b\[(4[0-7])m/;
  const regANSIFg = /\x1b\[([014]);(3[0-7])m/;
  const reg = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/g;
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
  let currentSpanClasses: [string, string, string] = ["", "", ""]; // [FG, BG, Style]
  const res: string[] = [];
  tokens.forEach((token, i) => {
    if (!regHasANSI.test(token)) {
      res.push(token);
      if (i == tokens.length - 1) {
        // last item
        if (hasOpenSpan) {
          res[currentSpanIndex] = `<span class="${
            currentSpanClasses.join(" ").trim()
          }">`;
          res.push("</span>");
        }
        return;
      }
    } else if (regANSIFg.test(token)) {
      const m = regANSIFg.exec(token);
      if (m == null) return;
      const style = styleMap[m[1]];
      const color = colorMap[m[2]];
      if (hasOpenSpan) {
        if (currentSpanClasses[0].length > 0) {
          // Close out
          res[currentSpanIndex] = `<span class="${
            currentSpanClasses.join(" ").trim()
          }">`;
          currentSpanClasses = [color, "", style];
          res.push("</span>");
          currentSpanIndex = res.push("<span goes here>") - 1;
        } else {
          currentSpanClasses[0] = color;
          currentSpanClasses[2] = style;
        }
      } else {
        currentSpanClasses[0] = color;
        currentSpanClasses[2] = style;
        currentSpanIndex = res.push("<span goes here>") - 1;
        hasOpenSpan = true;
      }
    } else if (regANSIBg.test(token)) {
      const m = regANSIBg.exec(token);
      if (m == null) return;
      const color = colorMap[m[1]];
      if (hasOpenSpan) {
        if (currentSpanClasses[1].length > 0) {
          // close out
          res[currentSpanIndex] = `<span class="${
            currentSpanClasses.join(" ").trim()
          }">`;
          currentSpanClasses = ["", color, ""];
          res.push("</span>");
          currentSpanIndex = res.push("<span goes here>") - 1;
        } else {
          currentSpanClasses[1] = color;
        }
      } else {
        currentSpanClasses[1] = color;
        currentSpanIndex = res.push("<span goes here>") - 1;
        hasOpenSpan = true;
      }
    } else {
      if (hasOpenSpan) {
        // reset
        hasOpenSpan = false;
        res.push("</span>");
        res[currentSpanIndex] = `<span class="${
          currentSpanClasses.join(" ").trim()
        }">`;
        currentSpanClasses = ["", "", ""];
        currentSpanIndex = -1;
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
  });
  return res.join("");
}
