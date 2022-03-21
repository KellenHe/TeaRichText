import { Plugin } from 'prosemirror-state';

export default function menuBarPlugin(handleUpdateMenu: (view: any) => void) {
  return new Plugin({
    view(editorView) {
      return {
        update: () => {
          if (handleUpdateMenu) {
            handleUpdateMenu(editorView);
          }
        },
      };
    },
  });
}
