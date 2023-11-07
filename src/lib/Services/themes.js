import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  Hct,
} from "@material/material-color-utilities";
import { EventEmitter } from "../helper/event";

const defaultColor = "#05ff8f";

export class createThemesGenerator {
  events = new EventEmitter();

  constructor() {
    this.currentColor = defaultColor;

    this.currentMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    this.currentHCT = Hct.fromInt(argbFromHex(this.currentColor));

    this.currentTheme = themeFromSourceColor(
      argbFromHex(this.currentColor)
    );

    applyTheme(this.currentTheme, {
      target: document.body,
      dark: this.currentMode,
    });
  }

  /**
   * @param {string} hex
   */
  changeColorHex(hex) {
    this.currentColor = hex;
    this.updateHCT();
    this.update();
  }

  /**
   * @param {number} hue
   */
  changeHue(hue) {
    this.currentHCT.hue = hue;
    this.updateColorHex();
    this.update();
  }

  /**
   * @param {number} chroma
   */
  changeChroma(chroma) {
    this.currentHCT.chroma = chroma;
    this.updateColorHex();
    this.update();
  }

  /**
   * @param {number} tone
   */
  changeTone(tone) {
    this.currentHCT.tone = tone;
    this.updateColorHex();
    this.update();
  }

  /**
   * @param {"system" | "light" | "dark"} mode
   */
  changeMode(mode) {
    if (mode === "system") {
      this.currentMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }

    this.currentMode = mode === "dark";
    this.update();
  }

  updateColorHex() {
    this.currentColor = this.currentHCT.toInt().toString(16);
    this.events.emit("update-color", {
      color: this.currentColor,
    });
  }

  updateHCT() {
    this.currentHCT = Hct.fromInt(argbFromHex(this.currentColor));
    this.events.emit("update-hct", {
      hue: this.currentHCT.hue,
      chroma: this.currentHCT.chroma,
      tone: this.currentHCT.tone,
    });
  }

  update() {
    applyTheme(themeFromSourceColor(this.currentHCT.toInt()), {
      target: document.body,
      dark: this.currentMode,
    });
  }
}

export const ThemesGenerator = new createThemesGenerator();
