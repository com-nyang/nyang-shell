import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import {CatManager} from './lib/catManager.js';
import {DockerMonitor} from './lib/monitors/docker.js';
import {KubernetesMonitor} from './lib/monitors/kubernetes.js';
import {FRAME_INTERVAL_MS} from './lib/constants.js';

export default class NyangWalkExtension extends Extension {
    enable() {
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

        Main.layoutManager.uiGroup.add_child(this._overlay);
        Main.layoutManager.uiGroup.set_child_above_sibling(this._overlay, Main.layoutManager.panelBox);

        this._catManager = new CatManager(this._overlay);
        this._catManager.addCat('default');

        this._dockerMonitor = new DockerMonitor(count => {
            this._catManager.setDockerCount(count);
        });

        this._k8sMonitor = new KubernetesMonitor(count => {
            this._catManager.setK8sCount(count);
        });

        this._dockerMonitor.start();
        this._k8sMonitor.start();

        this._tickId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, FRAME_INTERVAL_MS, () => {
            this._catManager.tick();
            return GLib.SOURCE_CONTINUE;
        });
    }

    disable() {
        if (this._tickId) {
            GLib.Source.remove(this._tickId);
            this._tickId = null;
        }

        this._dockerMonitor?.stop();
        this._dockerMonitor = null;

        this._k8sMonitor?.stop();
        this._k8sMonitor = null;

        this._catManager?.destroy();
        this._catManager = null;

        this._overlay?.destroy();
        this._overlay = null;
    }
}
