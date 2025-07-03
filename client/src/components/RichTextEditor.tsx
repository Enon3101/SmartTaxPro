import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (richText: string) => void;
  editable?: boolean;
  className?: string;
}

const TiptapEditor: React.FC<RichTextEditorProps> = ({ content, onChange, editable = true, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure extensions as needed
        // Example: Disable heading levels 3-6 if you only want H1, H2
        // heading: {
        //   levels: [1, 2],
        // },
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }: { editor: Editor }) => { // Added type for editor
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Basic toolbar (can be greatly expanded)
  const Toolbar = ({ editor }: { editor: Editor }) => (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex space-x-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1 rounded ${editor.isActive('strike') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
      >
        Strike
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-1 rounded ${editor.isActive('paragraph') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
      >
        Paragraph
      </button>
      {/* Add more buttons for headings, lists, blockquotes, etc. */}
    </div>
  );

  return (
    <div className={`border border-input bg-transparent rounded-md ${className}`}>
      {editable && editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="p-2 min-h-[150px] prose dark:prose-invert max-w-full focus:outline-none" />
    </div>
  );
};

export default TiptapEditor;
