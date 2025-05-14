/**
 * PromptInput - Component for AI-generated content through DeepSeek
 * 
 * This component allows users to enter a text prompt and receive AI-generated
 * content based on their query. It interfaces with the DeepSeek API endpoint
 * and handles the response and error cases.
 * 
 * @module components
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for the PromptInput component
 */
export interface PromptInputProps {
  /**
   * Callback function triggered when content is successfully generated
   * @param content The HTML content generated from the prompt
   */
  onGenerate: (content: string) => void;
}

/**
 * Input component for interacting with the DeepSeek AI service
 */
export function PromptInput({ onGenerate }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the submission of the prompt to the API
   * @param e The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      // Call the API endpoint that interfaces with DeepSeek
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      
      // Handle non-OK HTTP responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      // Parse the successful response
      const data = await response.json();
      
      // Update the editor with the generated content
      onGenerate(data.content);
      setPrompt("");
      
      // Provide feedback based on the response source
      if (data.source === 'fallback') {
        toast.warning("Using template content - DeepSeek API not available or failed", {
          description: "Set up your DeepSeek API key for real AI-generated content",
          duration: 5000,
        });
      } else {
        toast.success("Content generated successfully");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Enter a prompt and our AI will help you build your final note..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-[450px] md:w-[500px] lg:w-[550px]"
        disabled={isLoading}
        aria-label="AI prompt input"
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={!prompt.trim() || isLoading}
        aria-label="Generate content"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
} 