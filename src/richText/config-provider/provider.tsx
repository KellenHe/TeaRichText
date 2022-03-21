import React, { useState, useRef } from 'react';
import { context, updateMenuContext } from './context';

interface TeaConfigProviderProps {
  prefixCls?: string;
}

const TeaConfigProvider: React.FC<TeaConfigProviderProps> = (props) => {
  const { prefixCls } = props;

  return (
    <context.Provider value={{ prefixCls: prefixCls }}>
      {props.children}
    </context.Provider>
  );
};

const UpdateMenuProvider: React.FC = (props) => {
  const editorView = useRef();
  const [isUpdate, setUpdate] = useState<boolean>(false);

  const handleUpdateMenu = (view: any) => {
    editorView.current = view;
    setUpdate((value) => !value);
  };

  return (
    <updateMenuContext.Provider
      value={{
        value: isUpdate,
        handleUpdateMenu: handleUpdateMenu,
        editorView: editorView.current,
      }}
    >
      {props.children}
    </updateMenuContext.Provider>
  );
};

export { TeaConfigProvider, UpdateMenuProvider };
