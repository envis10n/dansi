export enum ColorValue {
  NONE = -1,
  BLACK,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE,
}

export enum ColorType {
  FOREGROUND = 3,
  BACKGROUND = 4,
  INTENSE = 9,
  INTENSE_BG = 10,
}

export enum ColorStyle {
  REGULAR = 0,
  BOLD = 1,
  UNDERLINE = 4,
}

export function foregroundColor(text: string, color: ColorValue): string {
  return `\x1b[0;3${color}m${text}${RESET}`;
}

export function backgroundColor(text: string, color: ColorValue): string {
  return `\x1b[4${color}m${text}${RESET}`;
}

export const bg = {
  black(text: string): string {
    return backgroundColor(text, ColorValue.BLACK);
  },
  red(text: string): string {
    return backgroundColor(text, ColorValue.RED);
  },
  green(text: string): string {
    return backgroundColor(text, ColorValue.GREEN);
  },
  yellow(text: string): string {
    return backgroundColor(text, ColorValue.YELLOW);
  },
  blue(text: string): string {
    return backgroundColor(text, ColorValue.BLUE);
  },
  magenta(text: string): string {
    return backgroundColor(text, ColorValue.MAGENTA);
  },
  cyan(text: string): string {
    return backgroundColor(text, ColorValue.CYAN);
  },
  white(text: string): string {
    return backgroundColor(text, ColorValue.WHITE);
  },
};

export function black(text: string): string {
  return foregroundColor(text, ColorValue.BLACK);
}

export function red(text: string): string {
  return foregroundColor(text, ColorValue.RED);
}

export function green(text: string): string {
  return foregroundColor(text, ColorValue.GREEN);
}

export function yellow(text: string): string {
  return foregroundColor(text, ColorValue.YELLOW);
}

export function blue(text: string): string {
  return foregroundColor(text, ColorValue.BLUE);
}

export function magenta(text: string): string {
  return foregroundColor(text, ColorValue.MAGENTA);
}

export function cyan(text: string): string {
  return foregroundColor(text, ColorValue.CYAN);
}

export function white(text: string): string {
  return foregroundColor(text, ColorValue.WHITE);
}

export function bold(text: string): string {
  return text.replace(/\[[04];3/g, "[1;3");
}

export function underline(text: string): string {
  return text.replace(/\[[01];3/g, "[4;3");
}

export const RESET = "\x1b[0m";

export class Color {
  private style: ColorStyle = ColorStyle.REGULAR;
  public foreground: ColorValue;
  public background: ColorValue = ColorValue.NONE;
  constructor(color: ColorValue = ColorValue.WHITE) {
    this.foreground = color;
  }
  public bold(): this {
    this.style = ColorStyle.BOLD;
    return this;
  }
  public underline(): this {
    this.style = ColorStyle.UNDERLINE;
    return this;
  }
  public colorize(input: string): string {
    return `${this.toString()}${input}${RESET}`;
  }
  public toString(): string {
    const foreground = `\x1b[${this.style};3${this.foreground}m`;
    const background = this.background == ColorValue.NONE
      ? ""
      : `\x1b[4${this.background}m`;
    return `${background}${foreground}`;
  }
  public reset(): this {
    this.foreground = ColorValue.WHITE;
    this.background = ColorValue.NONE;
    this.style = ColorStyle.REGULAR;
    return this;
  }
  public static black(): Color {
    return new Color(ColorValue.BLACK);
  }
  public static red(): Color {
    return new Color(ColorValue.RED);
  }
  public static green(): Color {
    return new Color(ColorValue.GREEN);
  }
  public static yellow(): Color {
    return new Color(ColorValue.YELLOW);
  }
  public static blue(): Color {
    return new Color(ColorValue.BLUE);
  }
  public static magenta(): Color {
    return new Color(ColorValue.MAGENTA);
  }
  public static cyan(): Color {
    return new Color(ColorValue.CYAN);
  }
  public static white(): Color {
    return new Color();
  }
}
