import { toggleMark, setBlockType, lift } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { MenuMarksEnum, MenuNodesEnum } from '../type';
import { schemaContext as schema } from '../schema';

const nodesCommand: { [key in MenuNodesEnum]: any } = {
  h1: setBlockType(schema.nodes.heading, {
    level: 1,
  }),
  h2: setBlockType(schema.nodes.heading, {
    level: 2,
  }),
  h3: setBlockType(schema.nodes.heading, {
    level: 3,
  }),
  h4: setBlockType(schema.nodes.heading, {
    level: 4,
  }),
  h5: setBlockType(schema.nodes.heading, {
    level: 5,
  }),
  normal: setBlockType(schema.nodes.paragraph),
  bullet: wrapInList(schema.nodes.bullet_list),
  ordered: wrapInList(schema.nodes.ordered_list),
};

const marksCommand: { [key in MenuMarksEnum]: any } = {
  bold: (state: any) => {
    return markActive(state, schema.marks.strong);
  },
  italic: (state: any) => {
    return markActive(state, schema.marks.em);
  },
};

const menuCommand: { [key in MenuMarksEnum | MenuNodesEnum]: any } = {
  bold: toggleMark(schema.marks.strong),
  italic: toggleMark(schema.marks.em),
  ...nodesCommand,
};

function markActive(state: any, type: any) {
  let { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

export function getMenuCommand(type: MenuMarksEnum | MenuNodesEnum) {
  return menuCommand[type];
}

export function getIsMarkCommand(type: MenuMarksEnum) {
  return marksCommand[type];
}

export function getIsNodeCommand(type: MenuNodesEnum) {
  return nodesCommand[type];
}
