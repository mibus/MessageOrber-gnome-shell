/*
 * Copyright (C) 2011 Marco Barisione <marco@barisione.org>
 *		 2012 Robert Mibus    <mibus@mibus.org>
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

 
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const MessageTray = imports.ui.messageTray;
const Lang = imports.lang;

let serialFile;
let serialOutputStream;

function updateCount() {
        let count = 0;

        let items = Main.messageTray._summaryItems;
        for (let i = 0; i < items.length; i++) {
            let s = items[i].source;
            if (s._counterBin.visible && s._counterLabel.get_text() != '0') {
                count++;
            }
        }

	// Do something with "count" now...
	print(serialOutputStream.write(""+count,null));
	print(serialOutputStream.write("\n",null));
}

let originalSetCount;

function customSetCount(count, visible) {
    let fallbackSetCount = Lang.bind(this, originalSetCount);
    fallbackSetCount(count, visible);
    updateCount();
}

function init() {
	serialFile = Gio.file_new_for_path('/tmp/pretend-serial-port');
	originalSetCount = MessageTray.Source.prototype._setCount;
}

function enable() {
	MessageTray.Source.prototype._setCount = customSetCount;
	serialOutputStream = serialFile.append_to(0,null);
	updateCount();	
}

function disable() {
	MessageTray.Source.prototype._setCount = originalSetCount;
	serialOutputStream.close(null);
}

