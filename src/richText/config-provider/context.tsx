import React from 'react';

interface ConfigProviderProps {
  prefixCls?: string;
}

interface UpdateMenuProviderProps {
  value?: boolean;
  editorView?: any;
  handleUpdateMenu?: (view: any) => void;
}

export const context = React.createContext<ConfigProviderProps>({});
export const updateMenuContext = React.createContext<UpdateMenuProviderProps>(
  {},
);

const getPrefixCls = (cusPrefixCls?: string) => {
  return cusPrefixCls ? cusPrefixCls : 'tea';
};

function useConfigContext() {
  const config = React.useContext(context);
  config.prefixCls = getPrefixCls(config.prefixCls);
  return config;
}

function useUpdateMenuContext() {
  const config = React.useContext(updateMenuContext);
  return config;
}

export { useConfigContext, useUpdateMenuContext };
