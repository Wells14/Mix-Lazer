import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
}

export function RichTextEditor({ initialValue = '', onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (window.tinymce && editorRef.current) {
      window.tinymce.init({
        selector: '.tinymce-editor',
        plugins: 'lists link image table code help wordcount',
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | code',
        height: 300,
        menubar: false,
        init_instance_callback: (editor) => {
          editor.setContent(initialValue);
        },
        setup: (editor) => {
          editor.on('change', () => {
            onChange?.(editor.getContent());
          });
        }
      });
    }

    return () => {
      if (window.tinymce) {
        window.tinymce.remove('.tinymce-editor');
      }
    };
  }, [initialValue, onChange]);

  return <textarea ref={editorRef} className="tinymce-editor" />;
}
