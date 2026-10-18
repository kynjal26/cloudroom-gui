import { describe, expect, it } from "vitest";
import {
  createDesktopUpdateFeedUrl,
  resolveDesktopUpdateSupport,
} from "../src/desktop-update-provider.js";

describe("desktop update feed url", () => {
  it("gives each platform its own feed file inside one release tag", () => {
    expect(createDesktopUpdateFeedUrl("macos")).toBe(
      "https://github.com/davidondrej/cloudroom-gui/releases/latest/download/desktop-version.json",
    );
    expect(createDesktopUpdateFeedUrl("linux")).toBe(
      "https://github.com/davidondrej/cloudroom-gui/releases/latest/download/desktop-version-linux.json",
    );
  });
});

const APP_IMAGE_PATH = "/home/user/Apps/bb-0.37.0-x86_64.AppImage";
const alwaysReplaceable = () => true;
const neverReplaceable = () => false;

describe("desktop update support", () => {
  it("never checks or installs the upstream releases in this fork", () => {
    for (const args of [
      { canReplaceAppImage: alwaysReplaceable, env: {}, platform: "macos" as const },
      { canReplaceAppImage: alwaysReplaceable, env: { APPIMAGE: APP_IMAGE_PATH }, platform: "linux" as const },
      { canReplaceAppImage: neverReplaceable, env: {}, platform: "linux" as const },
    ]) {
      expect(resolveDesktopUpdateSupport(args)).toEqual({ autoUpdate: false, versionCheck: false });
    }
  });
});
