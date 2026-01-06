import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { marked } from 'marked';

// Custom preview component that substitutes variables
function CustomPreview({ source }: { source: string }) {
  const html = marked(source, { breaks: true, gfm: true });
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: typeof html === 'string' ? html : '' }}
      className="w-md-editor-text-preview"
    />
  );
}

interface MarkdownEditorProps {
  initialValue?: string;
  onChange: (markdown: string, html: string) => void;
  label?: string;
  variables?: Record<string, string>;
}

export default function MarkdownEditor({ 
  initialValue = '', 
  onChange, 
  label = 'Event Description',
  variables = {}
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);

  const substituteVariables = (text: string): string => {
    let processedText = text;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedText = processedText.replace(regex, value);
    });
    return processedText;
  };

  const handleChange = (value: string | undefined) => {
    const newMarkdown = value || '';
    setMarkdown(newMarkdown);
    
    // Substitute variables before converting to HTML
    const markdownWithVariables = substituteVariables(newMarkdown);
    
    // Convert markdown to HTML for Google Form
    const htmlPromise = marked(markdownWithVariables, {
      breaks: true,
      gfm: true
    });
    
    const processHTML = (html: string) => {
      const minifiedHTML = minifyHTML(html);
      onChange(newMarkdown, minifiedHTML);
    };
    
    if (typeof htmlPromise === 'string') {
      processHTML(htmlPromise);
    } else {
      htmlPromise.then(processHTML);
    }
  };

  // For live preview, show substituted markdown
  const previewMarkdown = substituteVariables(markdown);

  // Function to minify HTML by removing extra whitespace and newlines
  const minifyHTML = (html: string): string => {
    return html
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Trim leading/trailing whitespace
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
        
        {/* Live preview with variables substituted */}
        <div className="mt-2 border border-gray-300 rounded-sm p-2 bg-gray-50">
          <div className="text-xs text-gray-600 mb-1 font-medium">Preview (variables replaced):</div>
          <CustomPreview source={previewMarkdown} />
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Write in Markdown. Use {'{'}{'}variable{'}{'}'} for dynamic content. HTML will be generated for Google Form.
      </div>
      {Object.keys(variables).length > 0 && (
        <div className="text-xs text-gray-400">
          Available variables: {Object.keys(variables).map(v => `{{${v}}}`).join(', ')}
        </div>
      )}
    </div>
  );
}