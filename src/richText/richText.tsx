import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { Card } from 'antd';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { schemaContext } from './schema';
import { registerPlugins } from './registerPlugins';
import MenusView, { MenuType } from './menus';
import {
  useConfigContext,
  useUpdateMenuContext,
  UpdateMenuProvider,
} from './config-provider';

/**
 * 富文本
 */
interface RichTextProps {
  /**
   * 菜单选项
   */
  Menus?: boolean | MenuType;
  /**
   * 富文本文字变动回调方法
   */
  onChange?: (value: string) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 富文本外层card样式
   */
  style?: React.CSSProperties;
  /**
   * 菜单外层样式
   */
  menuStyle?: React.CSSProperties;
}

const TeaRichText: React.FC<RichTextProps> = (props) => {
  const {
    Menus = true,
    onChange,
    disabled = false,
    style = { padding: 0 },
    menuStyle,
  } = props;
  const editorRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView>();
  const config = useConfigContext();
  const updateMenuConfig = useUpdateMenuContext();
  useEffect(() => {
    if (editorRef?.current && contentRef?.current) {
      const state = EditorState.create({
        doc: DOMParser.fromSchema(schemaContext).parse(contentRef.current),
        plugins: registerPlugins({
          schema: schemaContext,
          handleUpdateMenu: updateMenuConfig.handleUpdateMenu,
        }),
      });
      const editProps: DirectEditorProps = {
        state: state,
        attributes: {
          class: `${config.prefixCls}`,
        },
        handleScrollToSelection: (newView) => {
          return true;
        },
      };
      const view = new EditorView(editorRef.current!, editProps);
      setEditorView(view);
    }
  }, []);

  useEffect(() => {
    if (contentRef?.current) {
      const value = props.children?.toString() || '';
      contentRef.current.innerHTML = value;
      if (editorView) {
        const state = EditorState.create({
          doc: DOMParser.fromSchema(schemaContext).parse(contentRef.current),
          plugins: editorView.state.plugins,
        });
        editorView.updateState(state);
      }
    }
  }, [props.children, editorView]);

  return (
    <Card bodyStyle={style}>
      {Menus ? (
        typeof Menus !== 'boolean' ? (
          <MenusView menus={Menus} editorView={editorView!} />
        ) : (
          <MenusView editorView={editorView!} />
        )
      ) : null}
      <div className={`${config.prefixCls}-p-xs`} ref={editorRef} />
      <div ref={contentRef} style={{ display: 'none' }} />
    </Card>
  );
};

const WidthProvider = () => {
  return (
    <UpdateMenuProvider>
      <TeaRichText />
    </UpdateMenuProvider>
  );
};

export default WidthProvider;
