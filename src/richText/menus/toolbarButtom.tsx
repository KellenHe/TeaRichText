import React, { useCallback } from 'react';
import { Tooltip } from 'antd';
import { useConfigContext, useUpdateMenuContext } from '../config-provider';

interface ToolbarButtomProps {
  disabled?: boolean;
  active?: boolean;
  title?: string;
  content: JSX.Element;
  action: (
    state: EditorState<S>,
    dispatch: (tr: Transaction<S>) => void,
    view: EditorView
  ) => boolean
}

function ToolbarButtom(props: ToolbarButtomProps) {
  const { disabled, active, title, content } = props;
  const config = useConfigContext();

  const handleClick = useCallback(() => {
    if (!disabled) {

    }
  }, []);

  return (
    <div
      className={[
        `${config.prefixCls}-menu-item`,
        active ? `${config.prefixCls}-menu-item-active` : '',
        disabled ? `${config.prefixCls}-menu-item-disabled` : ''
      ].join(' ')}
      onClick={() => {}}
    >
      {title ? <Tooltip title={title}>{content}</Tooltip> : { content }}
    </div>
  );
}

export default ToolbarButtom;
