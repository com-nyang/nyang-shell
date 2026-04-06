import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const FRAME_INTERVAL_MS = 100;
const STEP_SIZE = 2;
const SAFE_GAP = 12;
const IDLE_CHANCE = 0.004;
const IDLE_DURATION = 32;

const WALK_FRAMES = [
    'ᓚᘏᗢ',
    'ᓚᘏᗢ₎',
    'ᓚᘏᗢ₎₎',
    'ᓚᘏᗢ₎',
    'ᓚᘏᗢ',
    '₍ᓚᘏᗢ',
    '₍₍ᓚᘏᗢ',
    '₍ᓚᘏᗢ',
];

const IDLE_FRAMES = [
    '(=^･ω･^=)',
    '(=^･ω･^=)',
    '(=^-ω-^=)',
    '(=^-ω-^=)',
    '(=^-ω-^=)',
    '(=^･ω･^=)',
    '(=^◡ω◡^=)',
    '(=^◡ω◡^=)',
    '(=^･ω･^=)',
    '(=^･ω･^=)',
];

export default class NyangWalkExtension extends Extension {
    enable() {
        this._catLabel = new St.Label({
            text: WALK_FRAMES[0],
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'nyang-walk-cat',
        });

        this._overlay = new St.Widget({
            reactive: false,
            x_expand: true,
            y_expand: true,
        });
        this._overlay.add_constraint(new Clutter.BindConstraint({
            source: Main.panel,
            coordinate: Clutter.BindCoordinate.POSITION,
        }));
        this._overlay.add_constraint(new Clutter.BindConstraint({
            source: Main.panel,
            coordinate: Clutter.BindCoordinate.SIZE,
        }));
        this._overlay.add_child(this._catLabel);

        Main.layoutManager.uiGroup.add_child(this._overlay);
        Main.layoutManager.uiGroup.set_child_above_sibling(this._overlay, Main.layoutManager.panelBox);

        this._frameIndex = 0;
        this._offset = 0;
        this._direction = 1;
        this._blockedRanges = [];
        this._state = 'walking';
        this._idleTimer = 0;
        this._tickId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, FRAME_INTERVAL_MS, () => {
            this._tick();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._tickId) {
            GLib.Source.remove(this._tickId);
            this._tickId = null;
        }

        this._frameIndex = 0;
        this._offset = 0;
        this._direction = 1;
        this._blockedRanges = [];
        this._state = 'walking';
        this._idleTimer = 0;

        this._overlay?.destroy();
        this._overlay = null;
        this._catLabel = null;
    }

    _tick() {
        if (!this._catLabel || !this._overlay)
            return;

        if (this._state === 'idle')
            this._tickIdle();
        else
            this._tickWalking();
    }

    _tickWalking() {
        this._frameIndex = (this._frameIndex + 1) % WALK_FRAMES.length;
        this._catLabel.text = WALK_FRAMES[this._frameIndex];

        const [labelWidth] = this._catLabel.get_preferred_width(-1);
        const [, labelHeight] = this._catLabel.get_preferred_height(-1);
        const maxOffset = Math.max(0, this._overlay.width - labelWidth);
        const centeredY = Math.max(0, Math.floor((this._overlay.height - labelHeight) / 2));
        const bounce = Math.round(Math.sin(this._frameIndex * Math.PI / 4) * 1.5);

        this._blockedRanges = this._collectBlockedRanges(labelWidth);
        this._offset += STEP_SIZE * this._direction;
        this._offset = this._skipBlockedRanges(this._offset, this._direction, maxOffset);

        if (this._offset <= 0 || this._offset >= maxOffset) {
            this._offset = Math.max(0, Math.min(maxOffset, this._offset));
            this._direction *= -1;
            this._catLabel.scale_x = this._direction > 0 ? 1 : -1;
        }

        this._catLabel.set_position(this._offset, centeredY + bounce);

        if (Math.random() < IDLE_CHANCE) {
            this._state = 'idle';
            this._idleTimer = IDLE_DURATION;
            this._frameIndex = 0;
        }
    }

    _tickIdle() {
        this._frameIndex = (this._frameIndex + 1) % IDLE_FRAMES.length;
        this._catLabel.text = IDLE_FRAMES[this._frameIndex];

        const [labelWidth] = this._catLabel.get_preferred_width(-1);
        const [, labelHeight] = this._catLabel.get_preferred_height(-1);
        const centeredY = Math.max(0, Math.floor((this._overlay.height - labelHeight) / 2));
        this._catLabel.set_position(this._offset, centeredY);

        this._idleTimer--;
        if (this._idleTimer <= 0) {
            this._state = 'walking';
            this._frameIndex = 0;
            this._catLabel.scale_x = this._direction > 0 ? 1 : -1;
        }
    }

    _collectBlockedRanges(labelWidth) {
        const blockedRanges = [];
        const panelBoxes = [
            Main.panel._leftBox,
            Main.panel._centerBox,
            Main.panel._rightBox,
        ];

        for (const box of panelBoxes) {
            if (!box)
                continue;

            for (const child of box.get_children()) {
                if (!child.visible)
                    continue;

                const [x] = child.get_transformed_position();
                const width = child.width;
                if (width <= 0)
                    continue;

                blockedRanges.push([
                    Math.max(0, Math.floor(x - SAFE_GAP)),
                    Math.min(this._overlay.width, Math.ceil(x + width + SAFE_GAP)),
                ]);
            }
        }

        blockedRanges.sort((a, b) => a[0] - b[0]);

        const mergedRanges = [];
        for (const range of blockedRanges) {
            const lastRange = mergedRanges.at(-1);
            if (!lastRange || range[0] > lastRange[1]) {
                mergedRanges.push(range);
                continue;
            }

            lastRange[1] = Math.max(lastRange[1], range[1]);
        }

        return mergedRanges;
    }

    _skipBlockedRanges(offset, direction, maxOffset) {
        let nextOffset = offset;

        for (const [start, end] of this._blockedRanges) {
            if (nextOffset < start || nextOffset > end)
                continue;

            nextOffset = direction > 0 ? end : start;
        }

        return Math.max(0, Math.min(maxOffset, nextOffset));
    }
}
