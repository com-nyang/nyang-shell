# Nyang Walk

> A tiny ASCII cat that strolls across your GNOME top bar — jumping over panel icons, occasionally sitting down for a nap.

```
ᓚᘏᗢ₎₎  ···  (=^◡ω◡^=)  ···  ₍₍ᓚᘏᗢ
```

---

## What it does

Nyang Walk adds a small animated cat to your GNOME Shell panel. It walks left and right along the top bar, automatically detecting and leaping over any panel applets (clock, system tray, app indicators, etc.) so it never overlaps them. Every once in a while it stops, sits down, and idles — then gets back up and keeps walking.

| State   | Preview             |
|---------|---------------------|
| Walking | `ᓚᘏᗢ` `₍ᓚᘏᗢ`       |
| Trotting| `ᓚᘏᗢ₎` `₍₍ᓚᘏᗢ`     |
| Idle    | `(=^-ω-^=)` `(=^◡ω◡^=)` |

---

## Requirements

- GNOME Shell **44 – 49**

---

## Installation

**Manual install:**

```bash
# Clone or download this repo, then:
cp -r . ~/.local/share/gnome-shell/extensions/nyang-walk@luke
```

**Restart GNOME Shell:**

| Session | Method |
|---------|--------|
| X11     | `Alt` + `F2` → type `r` → Enter |
| Wayland | Log out and log back in |

**Enable the extension:**

```bash
gnome-extensions enable nyang-walk@luke
```

Or use the **Extensions** app / GNOME Extensions website toggle.

---

## Uninstall

```bash
gnome-extensions disable nyang-walk@luke
rm -rf ~/.local/share/gnome-shell/extensions/nyang-walk@luke
```

---

## How it works

- Renders an `St.Label` in an overlay widget bound to the panel's position and size — no panel slot is claimed, so the cat floats freely.
- Every **100 ms** the label text cycles through walk frames, giving the illusion of animated legs.
- The extension reads all children of `_leftBox`, `_centerBox`, and `_rightBox` each tick, collects their screen positions, merges overlapping regions (with a 12 px safety gap), and teleports the cat past any blocked zone rather than walking through it.
- On a random ~0.4 % chance per tick the cat switches to an **idle** animation for ~3 seconds, then resumes walking.

---

## Files

```
nyang-walk@luke/
├── extension.js     — animation loop, panel-aware collision avoidance
├── metadata.json    — GNOME extension manifest
└── stylesheet.css   — font size, color, and glow styling
```

---

## License

Do whatever you want with it. It's a cat.
