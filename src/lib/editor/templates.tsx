/**
 * Editor Templates
 * 
 * This file contains the predefined templates for the Death Note editor.
 * Centralizing templates allows for consistent use across components.
 * 
 * @module lib/editor
 */

/**
 * Template interface defines the structure for editor templates
 */
export interface EditorTemplate {
  /**
   * Unique identifier for the template
   */
  value: string;
  
  /**
   * Display name for the template
   */
  label: string;
  
  /**
   * HTML content of the template
   */
  content: string;
  
  /**
   * Optional description of when to use this template
   */
  description?: string;
}

/**
 * The collection of available editor templates
 */
export const EDITOR_TEMPLATES: EditorTemplate[] = [
  {
    value: "goodbye-note",
    label: "Goodbye Note",
    content: `<h1>Goodbye Note</h1>
<p>Dear family and friends,</p>
<p>&nbsp;</p>
<p>If you're reading this, it means I'm no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p>
<p>First and foremost, thank you for being part of my life journey. Each of you has contributed to making my life meaningful and full of joy.</p>
<p>Please remember me not with sadness, but with the happy memories we've shared together. Celebrate the life we shared, the laughter we enjoyed, and the love that connected us.</p>
<p>Know that you made my life better simply by being in it. I am grateful for every moment we shared.</p>
<p>&nbsp;</p>
<p>All my love,</p>
<p>[Your Name]</p>
<p>❤️</p>`,
    description: "A heartfelt goodbye message for loved ones"
  },
  {
    value: "final-wishes",
    label: "Final Wishes",
    content: `<h1>My Final Wishes</h1>
<p>Dear family,</p>
<p>&nbsp;</p>
<p>I've created this document to outline my final wishes and arrangements. I hope this guidance provides clarity and reduces any burden during a difficult time.</p>
<h2>Funeral & Memorial Preferences</h2>
<ul>
  <li>I would like a [simple ceremony/celebration of life/private family gathering]</li>
  <li>Please play the following music: [music selections]</li>
  <li>I would prefer [burial/cremation/donation to science]</li>
</ul>
<h2>Important Messages</h2>
<p>To my family: Thank you for your unconditional love and support throughout my life.</p>
<p>To my friends: The memories we created together have been the greatest gift.</p>
<p>&nbsp;</p>
<p>With love and gratitude,</p>
<p>[Your Name]</p>`,
    description: "Outline your funeral preferences and final messages"
  },
  {
    value: "digital-legacy",
    label: "Digital Legacy",
    content: `<h1>My Digital Legacy</h1>
<p>Dear trusted contact,</p>
<p>&nbsp;</p>
<p>This document contains information about my digital accounts and assets. Please use it to manage my online presence after I'm gone.</p>
<h2>Important Accounts</h2>
<ul>
  <li><strong>Email:</strong> Access information stored in my password manager</li>
  <li><strong>Social Media:</strong> Please [delete/memorialize] my accounts</li>
  <li><strong>Photo Storage:</strong> Please save and share with family</li>
</ul>
<h2>Digital Assets</h2>
<ul>
  <li><strong>Cryptocurrency:</strong> Recovery phrases stored in [location]</li>
  <li><strong>Digital Purchases:</strong> Some digital content may be transferable</li>
</ul>
<p>&nbsp;</p>
<p>Thank you for handling this important responsibility.</p>
<p>[Your Name]</p>`,
    description: "Instructions for handling your digital accounts and assets"
  },
  {
    value: "personal-inventory",
    label: "Personal Inventory",
    content: `<h1>Personal Inventory & Wishes</h1>
<p>This document outlines my personal belongings and how I'd like them distributed.</p>
<p>&nbsp;</p>
<h2>Special Items</h2>
<ul>
  <li><strong>[Item]:</strong> I'd like this to go to [person]</li>
  <li><strong>[Collection]:</strong> Please give to [person] who will appreciate it</li>
  <li><strong>[Heirloom]:</strong> This should stay in the family with [person]</li>
</ul>
<h2>General Belongings</h2>
<p>For items not specifically mentioned, please [distribute among family/donate to charity/sell].</p>
<h2>Important Documents</h2>
<p>Legal documents, deeds, and certificates are located [location].</p>
<p>&nbsp;</p>
<p>Thank you for respecting my wishes.</p>
<p>[Your Name]</p>`,
    description: "Catalog of personal belongings and distribution wishes"
  },
  {
    value: "legacy-letter",
    label: "Legacy Letter",
    content: `<h1>My Legacy Letter</h1>
<p>Dear loved ones,</p>
<p>&nbsp;</p>
<p>As I reflect on my life, I want to share some thoughts on what has mattered most to me and the values I hope to pass on.</p>
<h2>Life Lessons I've Learned</h2>
<ul>
  <li>Cherish your relationships—they are life's greatest treasure</li>
  <li>Be kind, even when it's difficult</li>
  <li>Find joy in small moments</li>
</ul>
<h2>My Hopes for You</h2>
<p>I hope you'll live fully, love deeply, and find purpose in whatever path you choose. Remember that you carry my love with you always.</p>
<p>&nbsp;</p>
<p>With eternal love,</p>
<p>[Your Name]</p>`,
    description: "Share your values, wisdom, and hopes for future generations"
  }
];

/**
 * Get the default editor template content
 * @returns HTML content string for the default template
 */
export function getDefaultTemplate(): string {
  return EDITOR_TEMPLATES[0].content;
}

/**
 * Find a template by its value
 * @param value The template value/ID to look for
 * @returns The template object or undefined if not found
 */
export function findTemplateByValue(value: string): EditorTemplate | undefined {
  return EDITOR_TEMPLATES.find(template => template.value === value);
}

/**
 * Process template content by replacing placeholder variables
 * @param content The template HTML content
 * @param replacements Object containing key-value pairs to replace (e.g., {userName: "John Smith"})
 * @returns Processed HTML content with replacements applied
 */
export function processTemplateContent(content: string, replacements: Record<string, string> = {}): string {
  let processedContent = content;
  
  // Replace [Your Name] with user's name if provided
  if (replacements.userName) {
    processedContent = processedContent.replace(/\[Your Name\]/g, replacements.userName);
  }
  
  // Add more replacements as needed
  
  return processedContent;
} 