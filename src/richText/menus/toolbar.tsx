import React from 'react';
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CodeOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  toggleMarkBold,
  toggleMarkItalic,
  toggleMarkCode,
  toggleMarkUnderline,
  toggleMarkStrikethrough,
  isMarkActive,
  setBlockTypeHeading,
  isBlockActive,
  setListTypeBullet,
  setListTypeOrdered,
} from './commands';
import Heading, { HeadingType } from './heading';
import { schemaContext as schema } from '../schema';

interface ToolbarItem<S extends Schema = any> {
  id: string;
  action?: (
    state: EditorState<S>,
    dispatch: (tr: Transaction<S>) => void,
    view: EditorView,
  ) => boolean;
  content: JSX.Element;
  title?: string;
  active?: (state: EditorState<S>) => boolean;
  enable?: (state: EditorState<S>) => boolean;
}

interface ToolbarGroup<S extends Schema = any> {
  id: string;
  items: ToolbarItem<S>[];
}

export const toolbar: ToolbarGroup[] = [
  {
    id: 'marks',
    items: [
      {
        id: 'toggle-bold',
        title: '粗体(ctrl+b)',
        content: <BoldOutlined />,
        action: toggleMarkBold,
        enable: toggleMarkBold,
        active: isMarkActive(schema.marks.bold),
      },
      {
        id: 'toggle-italic',
        title: '斜体(ctrl+i)',
        content: <ItalicOutlined />,
        action: toggleMarkItalic,
        enable: toggleMarkItalic,
        active: isMarkActive(schema.marks.italic),
      },
      {
        id: 'toggle-code',
        title: '代码',
        content: <CodeOutlined />,
        action: toggleMarkCode,
        enable: toggleMarkCode,
        active: isMarkActive(schema.marks.code),
      },
      {
        id: 'toggle-underline',
        title: '下划线',
        content: <UnderlineOutlined />,
        action: toggleMarkUnderline,
        enable: toggleMarkUnderline,
        active: isMarkActive(schema.marks.underline),
      },
      {
        id: 'toggle-strikethrough',
        title: '删除线',
        content: <StrikethroughOutlined />,
        action: toggleMarkStrikethrough,
        enable: toggleMarkStrikethrough,
        active: isMarkActive(schema.marks.strikethrough),
      },
    ],
  },
  {
    id: 'switch-blocks',
    items: [
      {
        id: 'block-heading',
        title: 'Change to heading level 1',
        content: <Heading />,
      },
    ],
  },
  {
    id: 'lists',
    items: [
      {
        id: 'block-bullet-list',
        title: '无序列表',
        content: <UnorderedListOutlined />,
        action: setListTypeBullet,
        enable: setListTypeBullet,
        active: isBlockActive(schema.nodes.list, { type: 'bullet' }),
      },
      {
        id: 'block-ordered-list',
        title: '有序列表',
        content: <OrderedListOutlined />,
        action: setListTypeOrdered,
        enable: setListTypeOrdered,
        active: isBlockActive(schema.nodes.list, { type: 'ordered' }),
      },
    ],
  },
];
