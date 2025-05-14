/**
 * DeepSeek API Integration for Death Note
 * 
 * This file contains the API route for generating content using the DeepSeek AI service.
 * It handles the following:
 * - Processing user prompts and detecting template requests
 * - Calling the DeepSeek API with enhanced prompts
 * - Formatting responses for consistent styling
 * - Providing fallback templates when the API is unavailable
 * - Replacing placeholders with user information
 * 
 * @module api/generate
 */

import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

/**
 * Interface for the incoming request to the DeepSeek API
 */
interface DeepseekRequest {
  prompt: string;
}

/**
 * Interface for error responses
 */
interface ErrorResponse {
  error: string;
}

/**
 * Interface for successful responses
 */
interface SuccessResponse {
  content: string;
  source: 'openai-sdk' | 'fallback';
  error?: string;
}

/**
 * Create the OpenAI client configured for DeepSeek
 */
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-12345', // Use environment variable or fallback
  baseURL: 'https://api.deepseek.com', // DeepSeek's base URL
});

/**
 * API route handler for POST requests
 * 
 * @param request The incoming request object
 * @returns A NextResponse with the generated content or error message
 */
export async function POST(request: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { prompt } = await request.json() as DeepseekRequest;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get user name from header if available (added by middleware)
    const userName = request.headers.get('x-user-name') || '';
    
    // Determine if the user is explicitly asking for a template
    const isTemplateRequest = detectTemplateRequest(prompt);

    // Create an enhanced prompt for the AI
    const enrichedPrompt = createEnrichedPrompt(prompt, isTemplateRequest);

    try {
      // Call the DeepSeek API and return the response
      return await callDeepSeekAPI(enrichedPrompt, prompt, isTemplateRequest, userName);
    } catch (apiError) {
      console.error("DeepSeek API error:", apiError);
      
      // Fallback to template generation if API fails
      const fallbackContent = generateFallbackContent(prompt, isTemplateRequest, userName);
      return NextResponse.json({ 
        content: fallbackContent, 
        source: 'fallback',
        error: 'DeepSeek API call failed. Using fallback content.'
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    // If an error occurs, use our fallback content generation
    try {
      const { prompt } = await request.json() as DeepseekRequest;
      const userName = request.headers.get('x-user-name') || '';
      const isTemplateRequest = detectTemplateRequest(prompt);
      const fallbackContent = generateFallbackContent(prompt, isTemplateRequest, userName);
      
      return NextResponse.json({ 
        content: fallbackContent,
        source: 'fallback',
        error: 'Request processing failed. Using fallback content.'
      });
    } catch (innerError) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }
  }
}

/**
 * Detects if the prompt is requesting a template
 * 
 * @param prompt The user's prompt text
 * @returns True if the prompt appears to be requesting a template
 */
function detectTemplateRequest(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  return lowercasePrompt.includes('template') || 
         lowercasePrompt.includes('example') ||
         lowercasePrompt.includes('format');
}

/**
 * Creates an enhanced prompt for the AI based on the user's request
 * 
 * @param prompt The user's original prompt
 * @param isTemplateRequest Whether this is a template request
 * @returns An enhanced prompt with specific instructions for the AI
 */
function createEnrichedPrompt(prompt: string, isTemplateRequest: boolean): string {
  if (isTemplateRequest) {
    return `Write a detailed death note or final instructions letter based on this topic: "${prompt}"

The letter should be in valid HTML format with proper tags.
Use <h1> for main headings/titles, <h3> for subheadings, <p> for paragraphs, <ul> and <li> for lists.
Use <strong> for emphasis where appropriate.

Include placeholders where the person would need to fill in personal information.
Make the content specific to the topic requested and structured as a template that can be filled in.

The response should ONLY contain the HTML content, nothing else.`;
  } else {
    return `Based on this request: "${prompt}"

Provide a detailed, accurate, and thoughtful response in the context of a final instructions document or letter.
Use professional language, be precise, and respond directly to the specific query.
Use your deep knowledge to provide high-quality information, practical advice, and clear instructions.
Avoid template-like placeholders unless specifically requested.

Format the response in valid HTML:
- Use <h1> for main headings/titles
- Use <h3> for subheadings
- Use <p> for paragraphs
- Use <ul> and <li> for lists
- Use <strong> for emphasis

Focus on providing accurate, specific content that directly addresses the query.
The response should ONLY contain the HTML content, nothing else.`;
  }
}

/**
 * Calls the DeepSeek API and processes the response
 * 
 * @param enrichedPrompt The enhanced prompt to send to the API
 * @param originalPrompt The user's original prompt
 * @param isTemplateRequest Whether this is a template request
 * @param userName The user's name from authentication
 * @returns A NextResponse with the processed content
 */
async function callDeepSeekAPI(
  enrichedPrompt: string, 
  originalPrompt: string, 
  isTemplateRequest: boolean,
  userName: string
): Promise<NextResponse<SuccessResponse>> {
  // Make a call to the DeepSeek API using the OpenAI SDK
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat', // Use DeepSeek's model
    messages: [{ role: 'user', content: enrichedPrompt }],
    max_tokens: 2000, // Increased for more comprehensive responses
    temperature: isTemplateRequest ? 0.7 : 0.5, // Lower temperature for more precise responses
  });
  
  // Extract the generated content
  const generatedContent = response.choices[0].message.content || '';
  
  // Clean up the response - remove markdown code blocks and format correctly
  const cleanedContent = cleanResponse(generatedContent);
  
  // Replace [Your Name] placeholders with the user's name if available
  const contentWithUserName = userName 
    ? cleanedContent.replace(/\[Your Name\]/gi, userName) 
    : cleanedContent;
  
  // Ensure the content is clean HTML
  if (!contentWithUserName.trim().startsWith('<')) {
    // If not HTML, wrap in proper HTML format
    return NextResponse.json({ 
      content: `<h1>${isTemplateRequest ? originalPrompt : "Response"}</h1><p>${contentWithUserName}</p>`,
      source: 'openai-sdk'
    });
  }
  
  return NextResponse.json({ 
    content: contentWithUserName,
    source: 'openai-sdk'
  });
}

/**
 * Generates fallback content when the API is unavailable
 * 
 * @param prompt The user's prompt
 * @param isTemplateRequest Whether this is a template request
 * @param userName The user's name from authentication
 * @returns HTML content from the appropriate template
 */
function generateFallbackContent(prompt: string, isTemplateRequest: boolean, userName: string = ''): string {
  // If not explicitly requesting a template, provide a more direct response
  if (!isTemplateRequest) {
    return generateDirectResponse(prompt);
  }
  
  const lowercasePrompt = prompt.toLowerCase();
  
  // Map keywords to template generator functions
  const templateMap = [
    { 
      keywords: ['goodbye', 'farewell'], 
      generator: generateGoodbyeNote 
    },
    { 
      keywords: ['password', 'account', 'digital'], 
      generator: generatePasswordsNote 
    },
    { 
      keywords: ['pet', 'animal', 'dog', 'cat'], 
      generator: generatePetInstructions 
    },
    { 
      keywords: ['financial', 'money', 'bank', 'asset'], 
      generator: generateFinancialNote 
    },
    { 
      keywords: ['social media', 'facebook', 'twitter', 'instagram'], 
      generator: generateSocialMediaNote 
    },
    { 
      keywords: ['belongings', 'possessions', 'stuff', 'property'], 
      generator: generateBelongingsNote 
    },
    { 
      keywords: ['medical', 'health', 'care', 'treatment'], 
      generator: generateMedicalNote 
    },
    { 
      keywords: ['funeral', 'memorial', 'burial', 'ceremony'], 
      generator: generateFuneralInstructions 
    },
    { 
      keywords: ['legal', 'will', 'testament', 'executor'], 
      generator: generateLegalNote 
    }
  ];
  
  // Find the first matching template
  for (const template of templateMap) {
    if (template.keywords.some(keyword => lowercasePrompt.includes(keyword))) {
      return template.generator(prompt, userName);
    }
  }
  
  // Generic response for other prompts
  const nameToUse = userName || '[Your Name]';
  return `<h1>Final Instructions: ${prompt}</h1>
<p>Here are my thoughts and instructions regarding ${prompt}:</p>
<p>I want to ensure that my wishes are clear and that this information helps guide those handling my affairs when I'm no longer able to do so.</p>
<p>Please consider these instructions carefully and consult with appropriate professionals if needed.</p>
<p>If you have any questions about these instructions, please contact [trusted person/executor] for clarification.</p>
<p>Sincerely,<br>${nameToUse}</p>`;
}

/**
 * Generates a direct response for non-template queries
 * 
 * @param prompt The user's prompt
 * @returns HTML content with relevant information
 */
function generateDirectResponse(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('distribut') || lowercasePrompt.includes('belongings') || lowercasePrompt.includes('possessions')) {
    return `<h1>Distribution of Personal Belongings</h1>
<p>It's advisable to be specific about how you want your personal belongings distributed. Consider creating an inventory of valuable or sentimental items and clearly stating who should receive each item.</p>
<p>For items not specifically mentioned, you can designate a trusted person to make decisions about distribution, or you can specify that remaining items should be sold, with proceeds distributed according to your will.</p>
<p>Remember that verbal promises are not legally binding. Important bequests should be documented in your will or as an addendum to your will, depending on your jurisdiction's laws.</p>
<h3>Legal Considerations</h3>
<p>In most jurisdictions, personal property memoranda or letters of instruction can be referenced in your will but may not be legally binding on their own. Consult with an estate attorney about the proper way to document your wishes for personal belongings in your location.</p>`;
  }
  
  if (lowercasePrompt.includes('goodbye') || lowercasePrompt.includes('farewell') || lowercasePrompt.includes('letter')) {
    return `<h1>Writing a Meaningful Goodbye Letter</h1>
<p>A final letter to loved ones can provide comfort and closure. Consider including these elements:</p>
<ul>
  <li><strong>Personal reflections</strong> on what your relationships have meant to you</li>
  <li><strong>Life lessons or wisdom</strong> you want to share</li>
  <li><strong>Hopes</strong> for their future</li>
  <li><strong>Requests or wishes</strong> that are important to you</li>
  <li><strong>Expressions of love</strong> and what you want them to remember</li>
</ul>
<p>Write in your authentic voice and don't feel pressured to resolve every issue or say everything perfectly. Focus on the messages that will provide the most meaning and comfort to your recipients.</p>
<p>Consider writing individual letters to different people, as this allows for more personal and specific messages tailored to each relationship.</p>`;
  }
  
  if (lowercasePrompt.includes('digital') || lowercasePrompt.includes('password') || lowercasePrompt.includes('account')) {
    return `<h1>Managing Digital Assets and Passwords</h1>
<p>Digital assets and accounts require special planning, as executors may face legal and technical barriers to access. Consider these approaches:</p>
<ul>
  <li><strong>Create a secure inventory</strong> of all digital accounts, assets, and passwords</li>
  <li><strong>Use a password manager</strong> and share master access information with a trusted person</li>
  <li><strong>Explore built-in legacy tools</strong> like Google's Inactive Account Manager or Facebook's Legacy Contact</li>
  <li><strong>Include digital assets in your will</strong> but keep passwords in a separate, secure document</li>
  <li><strong>Specify your wishes</strong> for each account (preserve, memorialize, or delete)</li>
</ul>
<p>Be aware that terms of service for many online platforms prohibit account transfer, so your executor may need to work with each company individually using your death certificate.</p>
<p>Consider consulting with an attorney who specializes in digital assets to ensure your plan complies with relevant laws like the Revised Uniform Fiduciary Access to Digital Assets Act (if applicable in your jurisdiction).</p>`;
  }
  
  // Default response for other topics
  return `<h1>Response to: ${prompt}</h1>
<p>When preparing end-of-life documents and instructions, it's important to be clear, specific, and comprehensive. Consider consulting with qualified professionals such as estate attorneys, financial advisors, or grief counselors depending on the specific aspects of your planning.</p>
<p>Documents should be stored securely but accessibly by your executor or trusted individuals. Many people keep copies with their attorney, in a fireproof safe, and with a trusted family member.</p>
<p>Regularly review and update your instructions as your circumstances, relationships, and wishes change over time.</p>`;
}

/**
 * Cleans up the API response to ensure proper formatting
 * 
 * @param content The raw content from the API
 * @returns Cleaned and formatted HTML content
 */
function cleanResponse(content: string): string {
  // Remove markdown code fences and syntax highlighting indicators
  let cleaned = content.replace(/```(?:html|markdown|md|)|\`\`\`/g, '');
  
  // Remove any complete HTML document structure
  cleaned = cleaned.replace(/<\/?html>|<\/?head>|<\/?body>|<!DOCTYPE.*?>/gi, '');
  
  // Remove any text like "Response:" or "Here's the content:" or "Request Summary:" that might precede the actual content
  cleaned = cleaned.replace(/^(?:Response|Content|Here(?:'s| is)(?: the)?(?: response| content)?|Request Summary):?\s*/i, '');
  
  // Convert headings to ensure proper Title Text formatting
  // First convert all H2 headings to H1 for Title Text formatting
  cleaned = cleaned.replace(/<h2>(.*?)<\/h2>/gi, '<h1>$1</h1>');
  
  // If the content has subheadings but no main heading, promote the first subheading to H1
  if (!cleaned.includes('<h1>') && cleaned.includes('<h3>')) {
    const match = cleaned.match(/<h3>(.*?)<\/h3>/);
    if (match && match[1]) {
      const mainTitle = match[1].includes(':') ? match[1].split(':')[0] : match[1];
      // Add a main title at the beginning and remove the original H3
      cleaned = `<h1>${mainTitle}</h1>\n` + cleaned.replace(/<h3>(.*?)<\/h3>/, '<h3>$1</h3>');
    }
  }
  
  // If still no H1 exists but there's clearly a title line at the beginning, convert it to H1
  if (!cleaned.includes('<h1>')) {
    // Look for what appears to be a title on the first line
    cleaned = cleaned.replace(/^(<p>)?(\w[^<>\n\r]{5,60})(<\/p>)?(\r?\n)?/i, '<h1>$2</h1>\n');
  }
  
  // Check for sections that should be Title Text but aren't marked as H1
  // Look for bold text at the beginning of paragraphs that look like section titles
  cleaned = cleaned.replace(/<p><strong>([^<:]{10,50}(?:Instructions|Overview|Guide|Information|Wishes|Note|Affairs|Plan|Arrangements))<\/strong><\/p>/gi, '<h1>$1</h1>');
  
  // Remove any excessive blank lines
  cleaned = cleaned.replace(/(\r?\n){3,}/g, '\n\n');
  
  // Remove any script or style tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove any HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  
  // Trim any extra whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
} 

// Template generator functions
// These are kept as separate functions to maintain organization and readability

function generateGoodbyeNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Farewell Note</h1>
<p>Dear loved ones,</p>
<p>If you're reading this, I've moved on from this world. Please know that I lived a life filled with joy, purpose, and love—largely because of the wonderful people like you who were part of my journey.</p>
<p>I have no regrets and hope you'll celebrate the good times we shared rather than mourn my passing. Remember me through the stories we created together, the lessons we learned, and the laughter we shared.</p>
<p>To my family: Your love has been my greatest treasure. Continue to support each other and find happiness in the small moments.</p>
<p>To my friends: Thank you for the adventures, the deep conversations, and for accepting me exactly as I am.</p>
<p>Remember that death is just another part of life's journey. I'm at peace, and I hope you will find peace too.</p>
<p>With all my love and gratitude,</p>
<p>${nameToUse}</p>`;
}

function generatePasswordsNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Digital Accounts & Passwords</h1>
<p>This document contains sensitive information about my digital accounts. Please protect this information and only share it with those who need it to properly manage my affairs.</p>

<h3>Email Accounts</h3>
<ul>
  <li><strong>Personal Email:</strong> [email@example.com] - Password: [password] - This is my primary email account for personal correspondence.</li>
  <li><strong>Work Email:</strong> [work@example.com] - Password: [password] - Please notify my employer of my passing.</li>
</ul>

<h3>Financial Accounts</h3>
<ul>
  <li><strong>Online Banking:</strong> [bank name] - Username: [username] - Password: [password] - You'll need my phone for 2FA.</li>
  <li><strong>Investment Account:</strong> [institution] - Access details in my secure password manager.</li>
  <li><strong>Password Manager:</strong> [LastPass/1Password/etc.] - Master password: [master password] - This contains passwords to most of my other accounts.</li>
</ul>

<h3>Social Media & Other Accounts</h3>
<ul>
  <li><strong>Facebook:</strong> Username: [username] - Password: [password] - Please post a final message and either memorialize or delete the account.</li>
  <li><strong>Google/YouTube:</strong> Email: [email] - Password: [password] - Contains my photos, documents, and videos.</li>
  <li><strong>Subscription Services:</strong> See my password manager for Netflix, Spotify, etc. Please cancel these services.</li>
</ul>

<p>The executor of my estate should consult with my attorney before accessing financial accounts. For additional assistance with digital accounts, contact [trusted tech-savvy person] at [phone/email].</p>
<p>Prepared by: ${nameToUse}</p>`;
}

function generatePetInstructions(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>Care Instructions for My Beloved Pets</h1>

<h3>About [Pet Name] (Dog/Cat/Type of Pet)</h3>
<p><strong>Age:</strong> [age] years old</p>
<p><strong>Breed/Description:</strong> [description]</p>
<p><strong>Temperament:</strong> [friendly/shy/energetic/etc.]</p>

<h3>Daily Care</h3>
<ul>
  <li><strong>Food:</strong> [Brand name] [amount] [frequency]. Stored in [location]. [Special instructions, allergies, etc.]</li>
  <li><strong>Medication:</strong> [medication name] [dosage] [frequency] for [condition]. Stored in [location].</li>
  <li><strong>Exercise:</strong> [walks/playtime/requirements]</li>
  <li><strong>Behavior notes:</strong> [likes/dislikes/quirks/training commands]</li>
</ul>

<h3>Veterinary Care</h3>
<p><strong>Veterinarian:</strong> Dr. [Name] at [Clinic Name]</p>
<p><strong>Address:</strong> [address]</p>
<p><strong>Phone:</strong> [phone number]</p>
<p><strong>Medical history:</strong> Records located in [location/file]</p>

<h3>Future Care Arrangements</h3>
<p>I would like [designated person] to adopt and care for my pet(s). I have discussed this with them, and they have agreed to this responsibility.</p>
<p>If that arrangement isn't possible, please contact [alternative person/rescue organization] at [contact information].</p>
<p>I have set aside [amount] in my will/trust for the ongoing care of my pet(s). Contact [attorney/executor] regarding these funds.</p>

<p>Thank you for ensuring my beloved companions continue to receive the love and care they deserve.</p>
<p>Prepared by: ${nameToUse}</p>`;
}

function generateFinancialNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Financial Information & Instructions</h1>

<h3>Banking Accounts</h3>
<ul>
  <li><strong>Primary Checking:</strong> [Bank Name], Account #[XXXX] - For daily expenses and bill payments</li>
  <li><strong>Savings Account:</strong> [Bank Name], Account #[XXXX] - Emergency fund and short-term savings</li>
  <li><strong>Additional Account:</strong> [Bank Name], Account #[XXXX] - [Purpose of account]</li>
</ul>

<h3>Credit Cards & Debts</h3>
<ul>
  <li><strong>[Card Provider]:</strong> Account #[XXXX] - Automatic payments set up from checking account</li>
  <li><strong>[Card Provider]:</strong> Account #[XXXX] - Please pay off and close this account</li>
  <li><strong>Mortgage:</strong> [Lender], Account #[XXXX] - Monthly payment: $[Amount] - [Details about the property]</li>
  <li><strong>Auto Loan:</strong> [Lender], Account #[XXXX] - For [vehicle description]</li>
</ul>

<h3>Investments & Retirement</h3>
<ul>
  <li><strong>Brokerage Account:</strong> [Firm], Account #[XXXX] - Contact my financial advisor: [Name] at [contact info]</li>
  <li><strong>401(k):</strong> [Provider], Account #[XXXX] - Beneficiary designation on file</li>
  <li><strong>IRA:</strong> [Provider], Account #[XXXX] - [Traditional/Roth] - Beneficiary designation on file</li>
</ul>

<h3>Insurance Policies</h3>
<ul>
  <li><strong>Life Insurance:</strong> [Company], Policy #[XXXX] - Death benefit: $[Amount] - Beneficiary: [Name(s)]</li>
  <li><strong>Health Insurance:</strong> [Provider], Policy #[XXXX] - Cancel after my passing</li>
  <li><strong>Home/Auto Insurance:</strong> [Provider], Policy #[XXXX] - Contact agent: [Name] at [contact info]</li>
</ul>

<h3>Important Contacts</h3>
<ul>
  <li><strong>Financial Advisor:</strong> [Name], [Company], [Phone], [Email]</li>
  <li><strong>Accountant:</strong> [Name], [Company], [Phone], [Email]</li>
  <li><strong>Attorney:</strong> [Name], [Firm], [Phone], [Email]</li>
</ul>

<p>My will, trust documents, property deeds, and other important papers can be found [location]. The executor of my estate is [Name], who can be reached at [contact information].</p>

<p>Please ensure all final expenses are paid from my estate before distributing assets according to my will.</p>
<p>Prepared by: ${nameToUse}</p>`;
}

function generateSocialMediaNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Social Media Accounts & Digital Presence</h1>
<p>Here are my instructions for handling my social media accounts and online presence after I'm gone:</p>

<h3>Major Social Media Accounts</h3>
<ul>
  <li><strong>Facebook:</strong> I would like my account to be [memorialized/deleted]. If memorialized, please post a final message announcing my passing. If deleted, please download any photos or posts that might be meaningful to family members first.</li>
  <li><strong>Instagram:</strong> Please [keep as a memorial/delete] my account. Important photos should be saved before deletion.</li>
  <li><strong>Twitter/X:</strong> Please delete this account after downloading any meaningful content.</li>
  <li><strong>LinkedIn:</strong> Please have someone post a final update about my passing and then close the account.</li>
  <li><strong>YouTube:</strong> [Keep videos public/Set videos to private/Delete channel]. My content there is [personal/professional/creative].</li>
</ul>

<h3>Other Digital Accounts</h3>
<ul>
  <li><strong>Google/Gmail:</strong> Use Google's Inactive Account Manager or contact support with my death certificate to access important emails and documents.</li>
  <li><strong>Apple/iCloud:</strong> Contact Apple Support with my death certificate to access photos and other important data.</li>
  <li><strong>Dropbox/Cloud Storage:</strong> Contains important documents at [folder path]. Please download before closing.</li>
</ul>

<h3>Digital Subscriptions</h3>
<ul>
  <li><strong>Streaming Services:</strong> (Netflix, Spotify, etc.) Please cancel all subscriptions.</li>
  <li><strong>Recurring Memberships:</strong> Cancel any memberships or subscriptions to avoid ongoing charges.</li>
</ul>

<h3>Personal Website/Blog</h3>
<p>My website [URL] is hosted with [hosting provider]. I would like it to [remain online as a memorial/be archived and then shut down/be deleted]. The renewal fees are paid until [date].</p>

<h3>Digital Legacy Contact</h3>
<p>I've designated [Name] as my digital executor. They have [some/all] of my passwords and understand my wishes for my digital presence.</p>

<p>For accounts not listed here, please use your best judgment to either memorialize or delete them as appropriate, always prioritizing privacy and dignity.</p>
<p>Prepared by: ${nameToUse}</p>`;
}

function generateBelongingsNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>Instructions for My Personal Belongings</h1>
<p>This document provides guidance on how I'd like my personal belongings handled after I'm gone. While my will covers legal aspects of asset distribution, these notes offer more specific instructions and context.</p>

<h3>Sentimental Items</h3>
<ul>
  <li><strong>Family Heirlooms:</strong> The antique [item] that belonged to my [relative] should go to [person], as they will appreciate its history and significance.</li>
  <li><strong>Jewelry:</strong> My [specific pieces] should go to [specific people]. The remainder can be divided among family members or sold as needed.</li>
  <li><strong>Photographs:</strong> Digital photos are backed up to [cloud service]. Physical photo albums should be shared among family members, with [person] coordinating the division.</li>
</ul>

<h3>Household Items</h3>
<ul>
  <li><strong>Furniture:</strong> Family members should take pieces they want for their homes. Remaining items can be donated to [preferred charity/organization].</li>
  <li><strong>Kitchen Items:</strong> [Person] has expressed interest in my [specific cookware/dishes]. Other items can be donated or distributed as needed.</li>
  <li><strong>Appliances:</strong> These can be sold or given to those who need them.</li>
</ul>

<h3>Collections & Valuables</h3>
<ul>
  <li><strong>Book Collection:</strong> [Person] should have first choice of books. Consider donating remaining books to [local library/school/organization].</li>
  <li><strong>Art Collection:</strong> The pieces by [artist] should go to [person]. Other pieces can be distributed among those who appreciate them or sold.</li>
  <li><strong>Collectibles:</strong> My collection of [items] should be [kept together/divided/sold by someone knowledgeable about their value].</li>
</ul>

<h3>Electronics & Digital Assets</h3>
<ul>
  <li><strong>Computer/Phone:</strong> Please ensure these are securely wiped of personal data after transferring important files to [person/storage location].</li>
  <li><strong>Digital Media:</strong> My purchased music, movies, and books may not be transferable due to licensing. Check account terms for each service.</li>
</ul>

<h3>Vehicles</h3>
<ul>
  <li><strong>Car/Motorcycle:</strong> My [vehicle] should go to [person] or be sold, with proceeds added to my estate.</li>
</ul>

<h3>Items for Donation</h3>
<p>I would like my [clothing/specific items] to be donated to [specific organization] that supports [cause I care about].</p>

<h3>Disposal Requests</h3>
<p>Please discreetly dispose of [any items in specific location] without examining them.</p>

<p>For items not specifically mentioned, please distribute them fairly among family members who would value them, with preference given to those who express a meaningful connection to particular items.</p>
<p>Prepared by: ${nameToUse}</p>`;
}

function generateMedicalNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Medical Care Instructions</h1>

<h3>Medical Information</h3>
<p><strong>Primary Physician:</strong> Dr. [Name] at [Practice/Hospital]</p>
<p><strong>Contact:</strong> [Phone Number] / [Email]</p>
<p><strong>Medical Conditions:</strong> [List your ongoing medical conditions]</p>
<p><strong>Allergies:</strong> [List medications, foods, or substances you're allergic to]</p>
<p><strong>Blood Type:</strong> [Your blood type]</p>
<p><strong>Medications:</strong> [Current medications, dosages, and schedules]</p>

<h3>Advance Care Directives</h3>
<p>My advance directive documents are located [where documents are stored]. The person I've designated to make decisions on my behalf is:</p>
<p><strong>Healthcare Proxy:</strong> [Name], [Relationship]</p>
<p><strong>Contact:</strong> [Phone Number] / [Email]</p>

<h3>End-of-Life Care Preferences</h3>
<ul>
  <li><strong>Life Support:</strong> I [do/do not] wish to receive life-sustaining treatment if I have a terminal condition or am in a persistent vegetative state.</li>
  <li><strong>Resuscitation:</strong> I [do/do not] wish to be resuscitated if my heart stops.</li>
  <li><strong>Artificial Nutrition/Hydration:</strong> I [do/do not] want feeding tubes or IV hydration if I cannot eat or drink on my own.</li>
  <li><strong>Pain Management:</strong> I wish to receive adequate pain management, even if it may hasten my death.</li>
</ul>

<h3>Organ and Tissue Donation</h3>
<p>I [am/am not] registered as an organ donor. My wishes regarding organ and tissue donation are: [specific wishes]</p>

<h3>Important Medical Records</h3>
<p>My complete medical records can be accessed through [portal/healthcare system] or by contacting my primary physician.</p>
<p>Access information: [username/account number] - My executor has access to the password.</p>

<p>This document should be shared with my healthcare proxy, family members, and medical providers. Please respect my wishes as outlined here and in my formal advance directive documents.</p>

<p>Created by: ${nameToUse}</p>`;
}

function generateFuneralInstructions(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Funeral and Memorial Wishes</h1>

<h3>General Preferences</h3>
<p>I would like my final arrangements to be [religious/secular/spiritual] in nature and to reflect my values of [personal values].</p>
<p>My preference is for [burial/cremation/green burial/donation to medical science].</p>

<h3>Service Details</h3>
<ul>
  <li><strong>Type of Service:</strong> [funeral/memorial/celebration of life/no service]</li>
  <li><strong>Location:</strong> [preferred venue]</li>
  <li><strong>Officiant:</strong> [name or type of officiant]</li>
  <li><strong>Speakers:</strong> I would like [names] to speak if they are willing</li>
  <li><strong>Music:</strong> [specific songs or types of music]</li>
  <li><strong>Readings/Poems:</strong> [specific texts you'd like included]</li>
  <li><strong>Flowers:</strong> [preferences about flowers or alternatives like donations]</li>
</ul>

<h3>Burial/Cremation Instructions</h3>
<p><strong>If Burial:</strong> I would like to be buried at [cemetery/location] in [type of casket]. I [do/do not] want a viewing or open casket.</p>
<p><strong>If Cremation:</strong> I would like my ashes to be [scattered at/kept in/divided among] [location/container/people].</p>

<h3>Other Considerations</h3>
<ul>
  <li><strong>Attire:</strong> I would prefer attendees wear [formal black/colorful clothes/casual attire]</li>
  <li><strong>Memorial Donations:</strong> In lieu of flowers, I request donations to [charity/organization]</li>
  <li><strong>Reception:</strong> [wishes for any gathering after the service]</li>
  <li><strong>Obituary:</strong> [preferences for what should be included or excluded]</li>
</ul>

<p>Written by: ${nameToUse}</p>`;
}

function generateLegalNote(prompt: string, userName: string = ''): string {
  const nameToUse = userName || '[Your Name]';
  return `<h1>My Legal Affairs Overview</h1>

<h3>Last Will and Testament</h3>
<p>My most recent will is dated [date] and is located [physical location and/or digital location].</p>
<p><strong>Executor:</strong> [Name], [Relationship]</p>
<p><strong>Contact:</strong> [Phone Number] / [Email]</p>
<p><strong>Alternate Executor:</strong> [Name], [Relationship]</p>
<p>My will outlines the distribution of my assets, guardianship for minor children, and other final wishes.</p>

<h3>Trust Information</h3>
<p>I [have/have not] established trusts as part of my estate plan.</p>
<ul>
  <li><strong>[Trust Name]:</strong> Established on [date] for the benefit of [beneficiaries]</li>
  <li><strong>Trustee:</strong> [Name], [Contact Information]</li>
  <li><strong>Purpose:</strong> [Brief description of trust purpose]</li>
</ul>

<h3>Power of Attorney Documents</h3>
<p><strong>Financial Power of Attorney:</strong> [Name], [Contact Information]</p>
<p><strong>Healthcare Power of Attorney:</strong> [Name], [Contact Information]</p>
<p>These documents are stored [location of documents] and have been provided to the named individuals.</p>

<h3>Important Legal Documents</h3>
<ul>
  <li><strong>Birth Certificate:</strong> Located [where stored]</li>
  <li><strong>Marriage Certificate:</strong> Located [where stored]</li>
  <li><strong>Deeds & Property Titles:</strong> Located [where stored]</li>
  <li><strong>Vehicle Titles:</strong> Located [where stored]</li>
</ul>

<p>Prepared by: ${nameToUse}</p>`;
} 