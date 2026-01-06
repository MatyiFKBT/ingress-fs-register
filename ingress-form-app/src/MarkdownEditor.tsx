import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { marked } from 'marked';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange: (markdown: string, html: string) => void;
  label?: string;
}

export default function MarkdownEditor({ 
  initialValue = '', 
  onChange, 
  label = 'Event Description' 
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);

  const handleChange = (value: string | undefined) => {
    const newMarkdown = value || '';
    setMarkdown(newMarkdown);
    
    // Convert markdown to HTML for Google Form
    const htmlPromise = marked(newMarkdown, {
      breaks: true,
      gfm: true
    });
    
    if (typeof htmlPromise === 'string') {
      onChange(newMarkdown, htmlPromise);
    } else {
      htmlPromise.then(html => {
        onChange(newMarkdown, html);
      });
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <div className="border border-gray-300 rounded-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <MDEditor
          value={markdown}
          onChange={handleChange}
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
          height={200}
          textareaProps={{
            placeholder: 'Enter event description in Markdown...',
            className: 'text-xs'
          }}
          data-color-mode="light"
          className="markdown-editor"
        />
      </div>
      <div className="text-xs text-gray-500">
        Write in Markdown. HTML will be generated for Google Form.
      </div>
    </div>
  );
}