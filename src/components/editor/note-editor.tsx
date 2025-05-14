/**
 * NoteEditor - A dedicated component for editing and managing Death Note content
 * 
 * This component combines the TipTap rich text editor with auto-saving functionality.
 * It provides visual feedback for the save status and handles all editor-related
 * functionality separately from the main dashboard.
 * 
 * @module components/editor
 */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { EnhancedTiptapEditor } from '@/components/enhanced-tiptap-editor';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Props for the NoteEditor component
 */
interface NoteEditorProps {
  /**
   * Initial HTML content to load in the editor
   */
  initialContent: string;
  
  /**
   * Callback function to update parent component's state when content changes
   */
  onContentChange?: (content: string) => void;
  
  /**
   * Optional callback function for explicitly saving content 
   * (used for "Update Note" button)
   */
  onSave?: (content: string) => Promise<void>;
  
  /**
   * Editor title to display in the card header
   */
  title?: string;
  
  /**
   * Description to display below the editor title
   */
  description?: string;
}

/**
 * The default content to use if no initialContent is provided
 */
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
 * NoteEditor component that provides a rich text editor with auto-save functionality
 */
export function NoteEditor({
  initialContent = DEFAULT_CONTENT,
  onContentChange,
  onSave,
  title = "Note Editor",
  description = "This is the note that will be sent to your trusted contacts"
}: NoteEditorProps) {
  // State for managing the editor content and save status
  const [noteContent, setNoteContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState(false);
  
  /**
   * Handles content changes in the editor
   * @param content The new HTML content from the editor
   */
  const handleContentChange = (content: string) => {
    setNoteContent(content);
    
    // If a callback was provided, update parent component state
    if (onContentChange) {
      onContentChange(content);
    }
  };
  
  /**
   * Saves the current editor content
   * @param isAutoSave Whether this save is triggered automatically
   */
  const saveNote = async (isAutoSave = true) => {
    try {
      setIsSaving(true);
      setSaveError(false);
      
      if (onSave && !isAutoSave) {
        // Use the provided callback for explicit saves
        await onSave(noteContent);
      } else {
        // Default implementation for auto-saves
        // In a real app, this would call your API to save the note
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Update lastSaved timestamp
      setLastSaved(new Date());
      
      // Only show toast for manual updates, not auto-saves
      if (!isAutoSave) {
        toast.success("Note updated successfully");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveError(true);
      
      if (!isAutoSave) {
        toast.error("Failed to save note. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Debounced version of saveNote for auto-saving
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(() => {
      saveNote(true);
    }, 2000),
    [] // Empty dependency array ensures this is only created once
  );
  
  /**
   * Auto-save the note when content changes
   */
  useEffect(() => {
    if (noteContent) {
      debouncedSave();
    }
    
    // Cleanup function to cancel debounced calls when component unmounts
    return () => {
      debouncedSave.cancel();
    };
  }, [noteContent, debouncedSave]);
  
  /**
   * Render appropriate save status badge based on current state
   */
  const renderSaveStatus = () => {
    if (isSaving) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 flex items-center">
          <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" /> 
          Saving...
        </Badge>
      );
    }
    
    if (saveError) {
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1.5" />
          Failed to save
        </Badge>
      );
    }
    
    if (lastSaved) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
          Last saved: {lastSaved.toLocaleTimeString()}
        </Badge>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <EnhancedTiptapEditor 
          initialContent={initialContent}
          onChange={handleContentChange}
          className="min-h-[400px]"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Auto-save notification with badge styling */}
        <div className="flex items-center">
          {renderSaveStatus()}
        </div>
        
        <Button 
          onClick={() => saveNote(false)}
          disabled={isSaving}
        >
          {isSaving ? "Updating..." : "Update Note"}
        </Button>
      </CardFooter>
    </Card>
  );
} 