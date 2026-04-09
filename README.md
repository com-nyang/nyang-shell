# Nyang Walk

> A tiny ASCII cat that strolls across your GNOME top bar — dodging panel icons, occasionally sitting down for a nap.

```
ᓚᘏᗢ₎₎  ···  (=^◡ω◡^=)  ···  ₍₍ᓚᘏᗢ
[=]ᓚᘏᗢ₎₎[===]  ···  [==]ᓚᘏᗢ[======]  ···  [=====]₍₍ᓚᘏᗢ[=]
```

[![GNOME Extensions](https://img.shields.io/badge/GNOME%20Extensions-9664-blue?logo=gnome&logoColor=white)](https://extensions.gnome.org/extension/9664/nyang-walk/)
[![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-44--49-4A86CF?logo=gnome&logoColor=white)](https://extensions.gnome.org/extension/9664/nyang-walk/)
[![License](https://img.shields.io/badge/license-do%20whatever-green)](#license)

---

## Install

**Recommended — GNOME Extensions website:**

👉 **[extensions.gnome.org/extension/9664/nyang-walk](https://extensions.gnome.org/extension/9664/nyang-walk/)**

**Manual:**

```bash
cp -r . ~/.local/share/gnome-shell/extensions/nyang-walk@com-nyang
gnome-extensions enable nyang-walk@com-nyang
```

> **Wayland:** log out and back in to restart the shell.
> **X11:** `Alt` + `F2` → `r` → Enter.

---

## What it does

Nyang Walk puts a small animated cat on your GNOME Shell panel. It walks left and right, automatically detecting and jumping over any panel applets — clock, system tray, app indicators — so it never overlaps them. Every once in a while it stops, sits down, idles, then gets back up and keeps walking.

If Docker or Kubernetes is running, extra cats join the walk — one per running container, one per running pod. The more your system is doing, the busier the top bar gets.

| State    | Frames |
|----------|--------|
| Walking  | `ᓚᘏᗢ` `₍ᓚᘏᗢ` `₍₍ᓚᘏᗢ` |
| Trotting | `ᓚᘏᗢ₎` `ᓚᘏᗢ₎₎` |
| Idle     | `(=^･ω･^=)` `(=^-ω-^=)` `(=^◡ω◡^=)` |

---

## How it works

- An `St.Label` is rendered in an overlay widget bound to the panel — no panel slot claimed, the cat floats freely on top.
- Every **100 ms** the label cycles through walk frames, giving the illusion of animated legs.
- Each tick, the extension reads all children of `_leftBox`, `_centerBox`, and `_rightBox`, collects their screen positions, merges overlapping regions (with a 12 px safety gap), and teleports the cat past any blocked zone.
- On a random **~0.4%** chance per tick, the cat switches to idle animation for ~3 seconds, then resumes walking.

---

## Uninstall

```bash
gnome-extensions disable nyang-walk@com-nyang
rm -rf ~/.local/share/gnome-shell/extensions/nyang-walk@com-nyang
```

---

## Files

```
nyang-walk@com-nyang/
├── extension.js     — animation loop, panel-aware collision avoidance
├── metadata.json    — GNOME extension manifest
└── stylesheet.css   — font size, color, and glow styling
```

---

## License

Do whatever you want with it. It's a cat.
