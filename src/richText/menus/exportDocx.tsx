import React, { useCallback } from 'react';
import { FileWordOutlined } from '@ant-design/icons';
import { Tooltip, Popconfirm } from 'antd';
import { EditorView } from 'prosemirror-view';
import { defaultDocxSerializer, writeDocx } from 'prosemirror-docx';
import { saveAs } from 'file-saver';

interface ExportDocxProps {
  editorView: EditorView;
}

function ExportDocx(props: ExportDocxProps) {
  const { editorView } = props;

  const onClick = useCallback(
    (e: any) => {
      e.preventDefault();
      editorView.focus();

      const opts = {
        getImageBuffer(src: string) {
          return Buffer.from('', 'base64');
        },
      };

      const wordDocument = defaultDocxSerializer.serialize(
        editorView.state.doc,
        opts,
      );

      writeDocx(wordDocument, (buffer) => {
        saveAs(new Blob([buffer]), 'TeaRichText.docx');
      });
    },
    [editorView],
  );

  return (
    <Popconfirm
      title="是否导出?"
      onConfirm={onClick}
      okText="导出"
      cancelText="取消"
    >
      <Tooltip title="导出Docx">
        <FileWordOutlined className="point" />
      </Tooltip>
    </Popconfirm>
  );
}

export default ExportDocx;
