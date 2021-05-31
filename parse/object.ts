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

export interface AnsiObject {
  classes: string[];
  text: string;
}

export function toAnsiObjects(ansi: string): AnsiObject[] {
  const regHasANSI = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/;
  const reg = /\x1b\[(?:(?:[014];3[0-7])|4[0-7]|0)m/g;
  const regParse = /\x1b\[((?:(?:[014];3[0-7])|4[0-7]|0))m/;
  const tokens: string[] = [];
  let match = reg.exec(ansi);
  if (match == null) return [{ classes: [], text: ansi }];
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
  if (index != ansi.length - 1) {
    tokens.push(ansi.substring(index));
  }
  let hasOpenSpan = false;
  let currentSpanClasses: [string, string] = ["", ""]; // [FG, BG]
  let tempText: string[] = [];
  const res: AnsiObject[] = [];
  function closeTag() {
    if (hasOpenSpan) {
      res.push({
        classes: currentSpanClasses.slice().filter((v) => v != ""),
        text: tempText.join(" "),
      });
      tempText = [];
      currentSpanClasses = ["", ""];
    } else if (tempText.length > 0 && tempText.join(" ").length > 0) {
      res.push({
        classes: [],
        text: tempText.join(" "),
      });
    }
  }
  function isForegroundColor(d: string): boolean {
    return d.startsWith("0;3") || d.startsWith("1;3") || d.startsWith("4;3");
  }
  tokens.forEach((token, i) => {
    if (!regHasANSI.test(token)) {
      tempText.push(token);
      if (i == tokens.length - 1) {
        // last item
        closeTag();
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
          }
          currentSpanClasses[0] = mapped;
        } else if (clv.startsWith("4")) {
          // background color
          if (currentSpanClasses[1] != "") {
            closeTag();
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
        if (tempText.length > 0) {
          res.push({ classes: [], text: tempText.join(" ") });
          tempText = [];
        }
        hasOpenSpan = true;
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
        closeTag();
      }
    }
  });
  return res;
}
