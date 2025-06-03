import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  readOnly?: boolean;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your content...", 
  height = "200px",
  readOnly = false 
}: RichTextEditorProps) => {
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    // Convert HTML to plain text for editing
    const htmlToPlainText = (html: string) => {
      return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<p>/gi, '')
        .replace(/<h1>/gi, '# ')
        .replace(/<\/h1>/gi, '\n')
        .replace(/<h2>/gi, '## ')
        .replace(/<\/h2>/gi, '\n')
        .replace(/<strong>/gi, '**')
        .replace(/<\/strong>/gi, '**')
        .replace(/<em>/gi, '*')
        .replace(/<\/em>/gi, '*')
        .replace(/<u>/gi, '_')
        .replace(/<\/u>/gi, '_')
        .replace(/<ul><li>/gi, '• ')
        .replace(/<\/li><\/ul>/gi, '\n')
        .replace(/<ol><li>/gi, '1. ')
        .replace(/<\/li><\/ol>/gi, '\n')
        .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
    };
    
    setEditorValue(htmlToPlainText(value));
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    
    // Convert plain text to HTML
    const plainTextToHtml = (text: string) => {
      return text
        // Handle line breaks first
        .replace(/\n/g, '<br>')
        // Handle headings
        .replace(/^### (.*?)(<br>|$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*?)(<br>|$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*?)(<br>|$)/gm, '<h1>$1</h1>')
        // Handle bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Handle italic
        .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>')
        // Handle underline
        .replace(/_(.*?)_/g, '<u>$1</u>')
        // Handle bullet lists
        .replace(/^• (.*?)(<br>|$)/gm, '<ul><li>$1</li></ul>')
        // Handle numbered lists
        .replace(/^\d+\. (.*?)(<br>|$)/gm, '<ol><li>$1</li></ol>')
        // Clean up consecutive list items
        .replace(/<\/ul><br><ul>/g, '')
        .replace(/<\/ol><br><ol>/g, '')
        .replace(/<\/li><\/ul><ul><li>/g, '</li><li>')
        .replace(/<\/li><\/ol><ol><li>/g, '</li><li>');
    };
    
    onChange(plainTextToHtml(content));
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorValue.substring(start, end);
    
    const newText = editorValue.substring(0, start) + 
                   prefix + selectedText + suffix + 
                   editorValue.substring(end);
    
    handleChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  if (readOnly) {
    return (
      <div 
        className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ minHeight: '100px' }}
      />
    );
  }

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="border border-gray-300 border-b-0 rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => insertFormatting('# ', '')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('## ', '')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('_', '_')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200 underline"
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('• ', '')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('1. ', '')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
          title="Numbered List"
        >
          1.
        </button>
      </div>
      
      {/* Text Area */}
      <textarea
        value={editorValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder + "\n\nFormatting tips:\n**bold text**, *italic text*, _underlined text_\n# Heading 1, ## Heading 2\n• Bullet point, 1. Numbered list"}
        className="w-full p-4 border border-gray-300 rounded-b-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        style={{ height: height, minHeight: '200px' }}
      />
      
      {/* Preview */}
      <div className="mt-2 p-3 border rounded-lg bg-gray-50">
        <div className="text-sm text-gray-600 mb-2">Preview:</div>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;