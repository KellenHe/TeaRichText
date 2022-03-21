import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { buildKeymap } from './keymap';
import { menuBarPlugin } from './menus';

export function registerPlugins(options: any) {
  const plugins = [
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];

  if (options.history !== false) plugins.push(history());

  if (options.menuBar !== false) {
    plugins.push(menuBarPlugin(options.handleUpdateMenu));
  }

  return plugins;
}
