export enum MenuMarksEnum {
  BOLD = 'bold',
  ITALIC = 'italic',
}

export const MenuMarksStateMap: Record<MenuMarksEnum | MenuNodesEnum, boolean> =
  {
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    h5: false,
    normal: false,
    bullet: false,
    ordered: false,
  };

export enum MenuNodesEnum {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  NORMAL = 'normal',
  bullet = 'bullet',
  ordered = 'ordered',
}
