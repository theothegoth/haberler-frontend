import { useRef, useMemo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...' }) => {
  const editorRef = useRef(null);

  // Calculate character count by stripping HTML tags
  const charCount = useMemo(() => {
    const tmp = document.createElement('div');
    tmp.innerHTML = value || '';
    return (tmp.textContent || tmp.innerText || '').length;
  }, [value]);

  return (
    <div className="rich-text-editor">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: false,
          license_key: 'gpl',
          plugins: [
            'lists', 'link', 'code', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic underline | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist | ' +
            'link | removeformat | code',
          statusbar: true,
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              padding: 16px;
            }
            p { margin: 0 0 16px 0; }
            h1, h2, h3, h4, h5, h6 { margin: 24px 0 16px 0; font-weight: 600; line-height: 1.3; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            ul, ol { margin: 0 0 16px 0; padding-left: 32px; }
            li { margin-bottom: 8px; }
            a { color: #3b82f6; text-decoration: underline; }
            blockquote { border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; color: #6b7280; }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          formats: {
            h1: { block: 'h1' },
            h2: { block: 'h2' },
            h3: { block: 'h3' },
            p: { block: 'p' }
          },
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3',
        }}
      />
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span className={charCount < 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
          {charCount} characters
        </span>
        {charCount < 100 && <span className="ml-2">(minimum 100 characters)</span>}
      </div>
    </div>
  );
};

export default RichTextEditor;
