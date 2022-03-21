import { toggleMark, setBlockType, Command } from 'prosemirror-commands';
import { MarkType, NodeType, ResolvedPos } from 'prosemirror-model';
import { EditorState, NodeSelection, Selection } from 'prosemirror-state';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { schemaContext as schema } from '../schema';

// marks

export const toggleMarkBold = toggleMark(schema.marks.bold);
export const toggleMarkItalic = toggleMark(schema.marks.italic);
export const toggleMarkCode = toggleMark(schema.marks.code);
export const toggleMarkSubscript = toggleMark(schema.marks.subscript);
export const toggleMarkSuperscript = toggleMark(schema.marks.superscript);
export const toggleMarkUnderline = toggleMark(schema.marks.underline);
export const toggleMarkStrikethrough = toggleMark(schema.marks.strikethrough);

export const isMarkActive =
  (markType: MarkType) =>
  (state: EditorState): boolean => {
    const { from, $from, to, empty } = state.selection;

    if (empty) {
      return Boolean(markType.isInSet(state.storedMarks || $from.marks()));
    }

    return state.doc.rangeHasMark(from, to, markType);
  };

// nodes

export const parentInGroupPos = (
  $pos: ResolvedPos,
  nodeTypeGroup: string,
): number | undefined => {
  for (let depth = $pos.depth; depth >= 0; depth--) {
    const parent = $pos.node(depth);

    const { group } = parent.type.spec;

    if (group && group.split(/\s+/).includes(nodeTypeGroup)) {
      return $pos.before(depth);
    }
  }
};

export const setListTypeOrWrapInList =
  (listType: NodeType, attrs: { type: string }): Command =>
  (state, dispatch) => {
    const { $from, $to } = state.selection;

    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    const parentPos = parentInGroupPos(range.$from, 'list');

    if (typeof parentPos === 'number') {
      // already in list
      const $pos = state.doc.resolve(parentPos);

      const node = $pos.nodeAfter;

      if (node && node.type === listType && node.attrs.type === attrs.type) {
        // return false if the list type already matches
        return false;
      }

      if (dispatch) {
        dispatch(
          state.tr.setNodeMarkup(
            parentPos,
            listType,
            node ? { ...node.attrs, ...attrs } : attrs,
          ),
        );
      }

      return true;
    } else {
      const wrapping = findWrapping(range, listType, attrs);

      if (!wrapping) {
        return false;
      }

      if (dispatch) {
        dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
      }

      return true;
    }
  };

const isNodeSelection = (selection: Selection): selection is NodeSelection =>
  'node' in selection;

export const setBlockTypeHeading =
  () =>
  (level: number): Command =>
    setBlockType(schema.nodes.heading, { level });

export const setListTypeBullet = setListTypeOrWrapInList(schema.nodes.list, {
  type: 'bullet',
});
export const setListTypeOrdered = setListTypeOrWrapInList(schema.nodes.list, {
  type: 'ordered',
});

export const isBlockActive =
  (type: NodeType, attrs: Record<string, unknown> = {}) =>
  (state: EditorState): boolean => {
    if (isNodeSelection(state.selection)) {
      return state.selection.node.hasMarkup(type, attrs);
    }

    const { $from, to } = state.selection;

    return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
  };
