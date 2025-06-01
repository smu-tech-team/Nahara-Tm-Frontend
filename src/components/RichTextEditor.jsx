import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Iframe } from '../store/Iframe'; // Ensure this is a valid Tiptap extension
import EmbedModal from './EmbedModal';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  PlayCircle
} from 'lucide-react';

export default function RichTextEditor({ content, onChange }) {
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: true }),
      Iframe,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleAddLink = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  };

  const handleEmbed = ({ value }) => {
    if (editor) {
      editor.chain().focus().insertContent(
        `<iframe src="${value}" width="100%" height="315" frameborder="0" allowfullscreen class="rounded-md w-full"></iframe>`
      ).run();
    }
  };

  if (!editor) return null;

  const ToolbarButton = ({ icon: Icon, action, isActive, title }) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isActive ? 'bg-gray-300 dark:bg-gray-600' : ''
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white dark:bg-gray-900 w-full max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 items-center border-b pb-2">
        {/* Text Styles */}
        <ToolbarButton icon={Bold} title="Bold" isActive={editor.isActive('bold')} action={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton icon={Italic} title="Italic" isActive={editor.isActive('italic')} action={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton icon={UnderlineIcon} title="Underline" isActive={editor.isActive('underline')} action={() => editor.chain().focus().toggleUnderline().run()} />

        {/* Lists */}
        <ToolbarButton icon={List} title="Bullet List" isActive={editor.isActive('bulletList')} action={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton icon={ListOrdered} title="Ordered List" isActive={editor.isActive('orderedList')} action={() => editor.chain().focus().toggleOrderedList().run()} />

        {/* Headings */}
        <ToolbarButton icon={Heading1} title="Heading 1" isActive={editor.isActive('heading', { level: 1 })} action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <ToolbarButton icon={Heading2} title="Heading 2" isActive={editor.isActive('heading', { level: 2 })} action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />

        {/* Quote and Code Block */}
        <ToolbarButton icon={Quote} title="Blockquote" isActive={editor.isActive('blockquote')} action={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolbarButton icon={Code} title="Code Block" isActive={editor.isActive('codeBlock')} action={() => editor.chain().focus().toggleCodeBlock().run()} />

        {/* Media */}
        <ToolbarButton icon={LinkIcon} title="Insert Link" action={handleAddLink} />
        <ToolbarButton icon={ImageIcon} title="Insert Image" action={handleAddImage} />
        <ToolbarButton icon={PlayCircle} title="Embed Iframe" action={() => setIsEmbedModalOpen(true)} />
      </div>

      {/* Editor */}
      <div className="min-h-[200px] border border-gray-300 rounded-lg p-3 bg-white dark:bg-gray-800 focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      {/* Embed Modal */}
      {isEmbedModalOpen && (
        <EmbedModal
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
          onEmbed={handleEmbed}
        />
      )}
    </div>
  );
}
