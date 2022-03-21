import React, { useCallback, useEffect, useState } from 'react';
import { Space, Tooltip, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { EditorView } from 'prosemirror-view';
import { MenuMarksEnum, MenuMarksStateMap, MenuNodesEnum } from '../type';
import { getMenuCommand, getIsMarkCommand, getIsNodeCommand } from './command';
import Heading, { HeadingType } from './heading';
import { useConfigContext, useUpdateMenuContext } from '../config-provider';
import { toolbar } from './toolbar';
import ExportDocx from './exportDocx';

interface MenuType {
  bold?: boolean;
  italic?: boolean;
  heading?: boolean | HeadingType;
  unOrder?: boolean;
  order?: boolean;
  exportDocx?: boolean;
}

interface RichTextMenusProps {
  menus?: MenuType;
  editorView: EditorView;
  menuStyle?: React.CSSProperties;
}

function MenusView(props: RichTextMenusProps) {
  const {
    menus = {
      bold: true,
      italic: true,
      heading: true,
      exportDocx: true,
    },
    editorView,
    menuStyle = {},
  } = props;
  const [menuState, setMenuState] =
    useState<Record<MenuMarksEnum | MenuNodesEnum, boolean>>(MenuMarksStateMap);
  const config = useConfigContext();
  const updateMenuConfig = useUpdateMenuContext();

  useEffect(() => {
    if (updateMenuConfig.editorView) {
      for (const markKey of Object.keys(MenuMarksEnum)) {
        const markCommand = getIsMarkCommand(
          markKey.toLowerCase() as MenuMarksEnum,
        );
        const markActive = markCommand(updateMenuConfig.editorView.state);
        menuState[markKey.toLowerCase() as MenuMarksEnum] = markActive;
      }
      for (const nodeKey of Object.keys(MenuNodesEnum)) {
        const nodeCommand = getIsNodeCommand(
          nodeKey.toLowerCase() as MenuNodesEnum,
        );
        const nodeActive = nodeCommand(updateMenuConfig.editorView.state);
        menuState[nodeKey.toLowerCase() as MenuNodesEnum] = !nodeActive;
      }
      setMenuState({ ...menuState });
    }
  }, [updateMenuConfig.value]);

  const onMenuClick = useCallback(
    (e: any, type: MenuNodesEnum | MenuMarksEnum) => {
      e.preventDefault();
      editorView.focus();
      const command = getMenuCommand(type);
      command(editorView.state, editorView.dispatch, editorView);
    },
    [editorView],
  );

  return (
    <div className={`${config.prefixCls}-menu`} style={menuStyle}>
      <Space size={4}>
        {toolbar.map(group => {
          return (<>{group.items.map(item => )}<Divider type="vertical" /></>);
        })}
        {menus.heading ? (
          <Heading
            headingList={menus.heading as HeadingType}
            editorView={editorView}
          />
        ) : null}
        <Divider type="vertical" />
        {menus.bold ? (
          <div
            className={[
              `${config.prefixCls}-menu-item`,
              menuState.bold ? `${config.prefixCls}-menu-item-active` : '',
            ].join(' ')}
          >
            <Tooltip title="粗体(ctrl+b)">
              <BoldOutlined
                className="point"
                onClick={(e) => onMenuClick(e, MenuMarksEnum.BOLD)}
              />
            </Tooltip>
          </div>
        ) : null}
        {menus.italic ? (
          <div
            className={[
              `${config.prefixCls}-menu-item`,
              menuState.italic ? `${config.prefixCls}-menu-item-active` : '',
            ].join(' ')}
          >
            <Tooltip title="斜体(ctrl+i)">
              <ItalicOutlined
                className="point"
                onClick={(e) => onMenuClick(e, MenuMarksEnum.ITALIC)}
              />
            </Tooltip>
          </div>
        ) : null}
        <Divider type="vertical" />
        <div
          className={[
            `${config.prefixCls}-menu-item`,
            menuState.ordered ? `${config.prefixCls}-menu-item-active` : '',
          ].join(' ')}
        >
          <Tooltip title="有序列表">
            <OrderedListOutlined
              className="point"
              onClick={(e) => onMenuClick(e, MenuNodesEnum.ordered)}
            />
          </Tooltip>
        </div>
        <div
          className={[
            `${config.prefixCls}-menu-item`,
            menuState.bullet ? `${config.prefixCls}-menu-item-active` : '',
          ].join(' ')}
        >
          <Tooltip title="无序列表">
            <UnorderedListOutlined
              className="point"
              onClick={(e) => onMenuClick(e, MenuNodesEnum.bullet)}
            />
          </Tooltip>
        </div>

        {/* {menus.exportDocx ? <ExportDocx editorView={editorView} /> : null} */}
      </Space>
    </div>
  );
}

export default React.memo(MenusView);
export { MenuType };
