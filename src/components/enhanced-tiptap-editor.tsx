/**
 * EnhancedTiptapEditor - A simplified rich text editor with essential formatting options
 * 
 * Based on the TipTap Simple Editor Template with additional features including:
 * - Typography
 * - Task lists
 * - Text alignment
 * - More rich formatting options
 * - Responsive design
 * - Light/dark mode support
 *
 * @module components
 */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered,
  ListChecks,
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1, 
  Heading2,
  Heading3,
  Undo, 
  Redo,
  ChevronDown,
  X,
  FileCheck,
  Edit,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TemplateCombobox } from './template-combobox';
import { PromptInput } from './prompt-input';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

/**
 * Props for the EnhancedTiptapEditor component
 */
interface EnhancedTiptapEditorProps {
  /**
   * Initial HTML content to load in the editor
   */
  initialContent?: string;
  
  /**
   * Callback function triggered when content changes
   * @param content The HTML string of the editor content
   */
  onChange: (content: string) => void;
  
  /**
   * Placeholder text to show when editor is empty
   */
  placeholder?: string;
  
  /**
   * Additional CSS class names to apply to the editor container
   */
  className?: string;
}

// Default template content matching the "Goodbye Note" template
const DEFAULT_CONTENT = `<h1>Goodbye Note</h1>
<p>Dear family and friends,</p>
<p>&nbsp;</p>
<p>If you're reading this, it means I'm no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p>
<p>First and foremost, thank you for being part of my life journey. Each of you has contributed to making my life meaningful and full of joy.</p>
<p>Please remember me not with sadness, but with the happy memories we've shared together. Celebrate the life we shared, the laughter we enjoyed, and the love that connected us.</p>
<p>Know that you made my life better simply by being in it. I am grateful for every moment we shared.</p>
<p>&nbsp;</p>
<p>All my love,</p>
<p>Eight Lee</p>
<p>❤️</p>`;

/**
 * EnhancedTiptapEditor component for rich text editing
 */
export function EnhancedTiptapEditor({ 
  initialContent = DEFAULT_CONTENT, 
  onChange, 
  placeholder = 'Start writing your note...',
  className = ''
}: EnhancedTiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  
  // Get user information from Clerk
  const { user } = useUser();
  const userFullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  // Check if we're in the client-side environment 
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Initialize the TipTap editor instance with enhanced plugins and configuration
   */
  const editor = useEditor({
    extensions: [
      // Properly configure StarterKit with explicitly enabled list extensions and markdown support
      StarterKit.configure({
        heading: false, // We'll add heading separately to avoid duplication
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-4',
          },
          keepMarks: true, // Preserve marks when toggling list
          keepAttributes: true, // Preserve attributes when toggling list
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-4',
          },
          keepMarks: true, // Preserve marks when toggling list
          keepAttributes: true, // Preserve attributes when toggling list
        },
        code: {
          HTMLAttributes: {
            class: 'rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-sm',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-md bg-muted p-4 font-mono font-medium text-sm',
          },
        },
        // Configure other StarterKit extensions to handle markdown syntax well
        bold: { HTMLAttributes: { class: 'font-bold' } },
        italic: { HTMLAttributes: { class: 'italic' } },
        strike: { HTMLAttributes: { class: 'line-through' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-primary/20 pl-4 italic my-4' } },
      }),
      Heading.configure({
        levels: [1],
        HTMLAttributes: {
          class: (level: number) => {
            if (level === 1) return 'text-[10rem] font-extrabold mt-2 mb-6 border-b pb-2';
            return '';
          }
        }
      }),
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
      Placeholder.configure({
        placeholder,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list pl-6 my-4',
        }
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item flex gap-2 items-start',
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Typography,
      Underline,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-none h-full min-h-[300px] p-4',
      },
      // Enhanced keyboard handler for Markdown shortcuts
      handleKeyDown: (view, event) => {
        // Handle keydown events for markdown shortcuts
        // This is just to ensure the default markdown shortcuts work
        // (they should work by default, but we're being explicit)
        
        // Check if Markdown syntax is being typed
        if (event.key === '#' || 
            event.key === '*' || 
            event.key === '_' || 
            event.key === '`' || 
            event.key === '>' || 
            event.key === '~' || 
            (event.key === '1' && event.altKey) || 
            (event.key === '-' && !event.shiftKey) ||
            (event.key === '[' && !event.shiftKey)) {
          // Let TipTap handle these keys naturally
          return false;
        }
        
        // Return false to let TipTap handle the event
        return false;
      },
    },
    // Fix SSR hydration mismatch issue
    immediatelyRender: false,
  });

  // Clean up editor on component unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  // Apply heading to current selection or entire line
  const applyHeading = useCallback((level: 1 | 2 | 3 | 4) => {
    if (!editor) return;
    
    // If there's no selection, select the current paragraph or heading
    if (editor.state.selection.empty) {
      editor.chain()
        .focus()
        .command(({ commands, state }) => {
          const { from, to } = state.selection;
          const $from = state.doc.resolve(from);
          const startPos = $from.start();
          const endPos = $from.end();
          
          return commands.setTextSelection({ from: startPos, to: endPos });
        })
        .toggleHeading({ level })
        .run();
    } else {
      // If there is a selection, apply heading to the selection
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, [editor]);

  /**
   * Adds a link to the selected text in the editor
   */
  const addLink = useCallback(() => {
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
  }, [editor, linkUrl]);

  /**
   * Adds an image at the current cursor position
   */
  const addImage = useCallback(() => {
    if (!imageUrl || !editor) return;
    
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl })
      .run();
      
    setShowImageInput(false);
    setImageUrl('');
  }, [editor, imageUrl]);

  /**
   * Handle template selection by updating the editor content
   * Replaces [Your Name] with the actual user's name from Clerk
   */
  const handleTemplateSelect = useCallback((content: string) => {
    if (editor) {
      // Replace [Your Name] with the actual user's name from Clerk
      const processedContent = content.replace('[Your Name]', userFullName);
      
      editor.commands.setContent(processedContent);
      // This ensures the onChange callback is triggered
      onChange(processedContent);
    }
  }, [editor, onChange, userFullName]);

  /**
   * Handle generated content from the AI prompt
   */
  const handleGeneratedContent = useCallback((content: string) => {
    if (editor) {
      editor.commands.setContent(content);
      // This ensures the onChange callback is triggered
      onChange(content);
    }
  }, [editor, onChange]);

  // If not on client side yet, render a simplified version to avoid hydration issues
  if (!isClient) {
    return (
      <div className={`border rounded-md ${className}`}>
        <div className="p-4 min-h-[400px] bg-muted/5">
          Loading editor...
        </div>
      </div>
    );
  }

  // Helper function to check if editor is valid
  const isEditorReady = editor !== null;

  // Create a bullet list
  const createBulletList = () => {
    if (!isEditorReady) return;
    
    // If cursor is in a list, toggle it off; otherwise create a new bullet list
    if (editor.isActive('bulletList')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      editor.chain().focus().toggleBulletList().run();
    }
  };

  // Create an ordered list
  const createOrderedList = () => {
    if (!isEditorReady) return;
    
    // If cursor is in a list, toggle it off; otherwise create a new ordered list
    if (editor.isActive('orderedList')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  // Create a task list
  const createTaskList = () => {
    if (!isEditorReady) return;
    
    // If cursor is in a list, toggle it off; otherwise create a new task list
    if (editor.isActive('taskList')) {
      editor.chain().focus().liftListItem('listItem').run();
    } else {
      editor.chain().focus().toggleTaskList().run();
    }
  };

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Template and Prompt Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-muted/10 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            {showAdvancedTools ? 'Hide' : 'Advanced'} Editing Tools
            {showAdvancedTools ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
          </Button>
          <PromptInput onGenerate={handleGeneratedContent} />
        </div>
        <div className="flex items-center">
          <TemplateCombobox onSelect={handleTemplateSelect} />
        </div>
      </div>

      {/* Simplified Editor Toolbar - Now conditionally rendered */}
      {showAdvancedTools && (
        <div className="flex flex-wrap gap-1 p-2 bg-muted/20 border-b overflow-x-auto">
          {/* Text Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-muted/40 hover:bg-muted flex items-center gap-1 min-w-[120px] justify-start"
              >
                {isEditorReady && editor.isActive('heading', { level: 1 }) ? (
                  <span className="flex items-center text-primary">Title Text</span>
                ) : (
                  <span className="text-sm font-medium flex items-center text-muted-foreground">Normal Text</span>
                )}
                <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32" align="start" alignOffset={-5} forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => isEditorReady && editor.chain().focus().setParagraph().run()}
                  className={`${isEditorReady && editor.isActive('paragraph') ? 'bg-muted' : ''}`}
                >
                  Normal Text
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => isEditorReady && applyHeading(1)}
                  className={`${isEditorReady && editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}`}
                >
                  Title Text
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().toggleBold().run()}
            className={`${isEditorReady && editor.isActive('bold') ? 'bg-muted' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().toggleItalic().run()}
            className={`${isEditorReady && editor.isActive('italic') ? 'bg-muted' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().toggleUnderline().run()}
            className={`${isEditorReady && editor.isActive('underline') ? 'bg-muted' : ''}`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(true)}
            className={`${isEditorReady && editor.isActive('link') ? 'bg-muted' : ''}`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {/* Lists - Updated with enhanced handlers */}
          <Button
            variant="ghost"
            size="sm"
            onClick={createBulletList}
            className={`${isEditorReady && editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={createOrderedList}
            className={`${isEditorReady && editor.isActive('orderedList') ? 'bg-muted' : ''}`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={createTaskList}
            className={`${isEditorReady && editor.isActive('taskList') ? 'bg-muted' : ''}`}
          >
            <ListChecks className="h-4 w-4" />
          </Button>

          {/* Text Alignment */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {isEditorReady && editor.isActive({ textAlign: 'left' }) ? (
                  <AlignLeft className="h-4 w-4" />
                ) : isEditorReady && editor.isActive({ textAlign: 'center' }) ? (
                  <AlignCenter className="h-4 w-4" />
                ) : isEditorReady && editor.isActive({ textAlign: 'right' }) ? (
                  <AlignRight className="h-4 w-4" />
                ) : isEditorReady && editor.isActive({ textAlign: 'justify' }) ? (
                  <AlignJustify className="h-4 w-4" />
                ) : (
                  <AlignLeft className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => isEditorReady && editor.chain().focus().setTextAlign('left').run()}
                className={`${isEditorReady && editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
              >
                <AlignLeft className="h-4 w-4 mr-2" /> Left
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => isEditorReady && editor.chain().focus().setTextAlign('center').run()}
                className={`${isEditorReady && editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
              >
                <AlignCenter className="h-4 w-4 mr-2" /> Center
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => isEditorReady && editor.chain().focus().setTextAlign('right').run()}
                className={`${isEditorReady && editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
              >
                <AlignRight className="h-4 w-4 mr-2" /> Right
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => isEditorReady && editor.chain().focus().setTextAlign('justify').run()}
                className={`${isEditorReady && editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}`}
              >
                <AlignJustify className="h-4 w-4 mr-2" /> Justify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().toggleBlockquote().run()}
            className={`${isEditorReady && editor.isActive('blockquote') ? 'bg-muted' : ''}`}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(true)}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-muted-foreground px-2 self-center">You can use Markdown too!</span>
          
          <div className="flex-1"></div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().undo().run()}
            disabled={!isEditorReady || !editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditorReady && editor.chain().focus().redo().run()}
            disabled={!isEditorReady || !editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}
      
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
            autoFocus
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
            autoFocus
          />
          <Button size="sm" onClick={addImage}>
            Add Image
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>
            Cancel
          </Button>
        </div>
      )}

      {/* Main Editor Content */}
      <EditorContent editor={editor} className="p-1" />
    </div>
  );
}