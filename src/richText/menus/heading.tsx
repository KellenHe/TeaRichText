import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Menu, Dropdown, Typography, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { EditorView } from 'prosemirror-view';
import { MenuNodesEnum } from '../type';
import { getMenuCommand, getIsNodeCommand } from './command';
import { useUpdateMenuContext } from '../config-provider';

const { Title, Text } = Typography;

enum HeadingTypeEnum {
  H1 = '标题1',
  H2 = '标题2',
  H3 = '标题3',
  H4 = '标题4',
  H5 = '标题5',
  NORMAL = '正文',
}

export interface HeadingType {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  normal?: boolean;
}

type types = keyof typeof HeadingTypeEnum;

interface HeadingProps {
  headingList?: HeadingType;
}

const Heading = (props: HeadingProps) => {
  const {
    headingList = {
      h1: true,
      h2: true,
      h3: true,
      h4: true,
      h5: true,
      normal: true,
    },
  } = props;
  const [curText, setText] = useState<string>(HeadingTypeEnum.NORMAL);
  const updateMenuConfig = useUpdateMenuContext();

  useEffect(() => {
    if (updateMenuConfig.editorView) {
      for (const key of Object.keys(MenuNodesEnum)) {
        const command = getIsNodeCommand(key.toLowerCase() as MenuNodesEnum);
        const active = command(updateMenuConfig.editorView.state);
        if (!active && key in HeadingTypeEnum) {
          setText(HeadingTypeEnum[key as types]);
        }
      }
    }
  }, [updateMenuConfig.value]);

  const selected = useCallback(
    (e, type, text) => {
      e.preventDefault();
      updateMenuConfig.editorView.focus();
      setText(text);
      const command = getMenuCommand(type);
      command(
        updateMenuConfig.editorView.state,
        updateMenuConfig.editorView.dispatch,
        updateMenuConfig.editorView,
      );
    },
    [updateMenuConfig.editorView],
  );

  const menu = useMemo(() => {
    return (
      <Menu>
        <Menu.Item>
          <Title
            onClick={(e) => selected(e, MenuNodesEnum.H1, HeadingTypeEnum.H1)}
          >
            {HeadingTypeEnum.H1}
          </Title>
        </Menu.Item>
        <Menu.Item>
          <Title
            onClick={(e) => selected(e, MenuNodesEnum.H2, HeadingTypeEnum.H2)}
            level={2}
          >
            {HeadingTypeEnum.H2}
          </Title>
        </Menu.Item>
        <Menu.Item>
          <Title
            onClick={(e) => selected(e, MenuNodesEnum.H3, HeadingTypeEnum.H3)}
            level={3}
          >
            {HeadingTypeEnum.H3}
          </Title>
        </Menu.Item>
        <Menu.Item>
          <Title
            onClick={(e) => selected(e, MenuNodesEnum.H4, HeadingTypeEnum.H4)}
            level={4}
          >
            {HeadingTypeEnum.H4}
          </Title>
        </Menu.Item>
        <Menu.Item>
          <Title
            onClick={(e) => selected(e, MenuNodesEnum.H5, HeadingTypeEnum.H5)}
            level={5}
          >
            {HeadingTypeEnum.H5}
          </Title>
        </Menu.Item>
        <Menu.Item>
          <Text
            onClick={(e) =>
              selected(e, MenuNodesEnum.NORMAL, HeadingTypeEnum.NORMAL)
            }
          >
            {HeadingTypeEnum.NORMAL}
          </Text>
        </Menu.Item>
      </Menu>
    );
  }, [selected]);

  return (
    <Dropdown overlay={menu}>
      <span>
        {curText} <DownOutlined />
      </span>
    </Dropdown>
  );
};

export default Heading;
