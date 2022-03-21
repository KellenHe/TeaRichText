import React from 'react';
import { TeaRichText, TeaConfigProvider } from 'TeaRichText';

function BasicDemo() {
  return (
    <TeaConfigProvider>
      <TeaRichText />
    </TeaConfigProvider>
  );
}

export default BasicDemo;
