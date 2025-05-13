/**
 * TiptapEditor - A rich text editor component for creating formatted messages
 * 
 * This component uses TipTap to provide a rich text editing experience with
 * formatting options like bold, italic, headings, lists, quotes, links, and images.
 * It includes both a toolbar and a bubble menu for formatting selected text.
 *
 * @module components
 */
"use client";

import { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Undo, 
  Redo 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

/**
 * Props for the TiptapEditor component
 * 
 * @interface TiptapEditorProps
 */
interface TiptapEditorProps {
  /**
   * Initial HTML content to load in the editor
   * @default '<h2>My Final Note</h2><p>Dear family and friends,</p><p>If you\'re reading this, it means I\'m no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p>'
   */
  initialContent?: string;
  
  /**
   * Callback function triggered when content changes
   * @param content The HTML string of the editor content
   */
  onChange: (content: string) => void;
  
  /**
   * Placeholder text to show when editor is empty
   * @default 'Start writing your note...'
   */
  placeholder?: string;
  
  /**
   * Additional CSS class names to apply to the editor container
   * @default ''
   */
  className?: string;
}

/**
 * TiptapEditor component for rich text editing
 * 
 * @param props - Component props
 * @returns A rich text editor component
 */
export function TiptapEditor({ 
  initialContent = '<h2>My Final Note</h2><p>Dear family and friends,</p><p>If you\'re reading this, it means I\'m no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p>', 
  onChange, 
  placeholder = 'Start writing your note...',
  className = ''
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  /**
   * Initialize the TipTap editor instance with plugins and configuration
   */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full my-4',
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-none h-full min-h-[300px] p-4',
      },
    },
  });

  /**
   * Adds a link to the selected text in the editor
   */
  const addLink = () => {
    if (!linkUrl || !editor) return;
    
    // Check if a URL has the protocol, if not add it
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
      
    setShowLinkInput(false);
    setLinkUrl('');
  };

  /**
   * Adds an image at the current cursor position
   */
  const addImage = () => {
    if (!imageUrl || !editor) return;
    
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl })
      .run();
      
    setShowImageInput(false);
    setImageUrl('');
  };

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/20 border-b">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`${editor?.isActive('bold') ? 'bg-muted' : ''}`}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          {/* Additional toolbar buttons... */}
          {/* ... */}
          
          <div className="flex-1"></div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Link Input UI */}
      {showLinkInput && (
        <div className="flex items-center gap-2 p-2 bg-muted/10 border-b">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <Button size="sm" onClick={addLink}>
            Add Link
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>
            Cancel
          </Button>
        </div>
      )}
      
      {/* Image Input UI */}
      {showImageInput && (
        <div className="flex items-center gap-2 p-2 bg-muted/10 border-b">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
          />
          <Button size="sm" onClick={addImage}>
            Add Image
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Bubble Menu for selected text */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex rounded-md overflow-hidden border shadow-md bg-background">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${editor.isActive('bold') ? 'bg-muted' : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${editor.isActive('italic') ? 'bg-muted' : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none ${editor.isActive('link') ? 'bg-muted' : ''}`}
              onClick={() => setShowLinkInput(true)}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}

      {/* Main Editor Content */}
      <EditorContent editor={editor} className="p-1" />
    </div>
  );
} 