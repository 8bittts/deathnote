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
<p>If you're reading this, it means I'm no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p>
<p>First and foremost, thank you for being part of my life journey. Each of you has contributed to making my life meaningful and full of joy.</p>
<p>Please remember me not with sadness, but with the happy memories we've shared together. Celebrate the life we shared, the laughter we enjoyed, and the love that connected us.</p>
<p>Know that you made my life better simply by being in it. I am grateful for every moment we shared.</p>
<p>All my love,</p>
<p>[Your Name]</p>
<p>❤️</p>`,
    description: "A heartfelt goodbye message for loved ones"
  },
  {
    value: "medical-care",
    label: "Medical Care",
    content: `<h1>My Medical Care Instructions</h1>

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

<p>Created by: [Your Name]</p>`,
    description: "Instructions for your medical care and end-of-life preferences"
  },
  {
    value: "funeral-wishes",
    label: "Funeral Plans",
    content: `<h1>My Funeral and Memorial Wishes</h1>

<h3>General Preferences</h3>
<p>I would like my final arrangements to be [religious/secular/spiritual] in nature and to reflect my values of [personal values].</p>
<p>My preference is for [burial/cremation/green burial/donation to medical science].</p>

<h3>Service Details</h3>
<ul>
  <li><strong>Type of Service:</strong> [funeral/memorial/celebration of life/no service]</li>
  <li><strong>Location:</strong> [preferred venue]</li>
  <li><strong>Officiant:</strong> [name or type of officiant]</li>
  <li><strong>Music:</strong> [specific songs or types of music]</li>
  <li><strong>Readings/Poems:</strong> [specific texts you'd like included]</li>
  <li><strong>Flowers:</strong> [preferences about flowers or alternatives like donations]</li>
</ul>

<h3>Other Considerations</h3>
<ul>
  <li><strong>Attire:</strong> I would prefer attendees wear [formal black/colorful clothes/casual attire]</li>
  <li><strong>Memorial Donations:</strong> In lieu of flowers, I request donations to [charity/organization]</li>
  <li><strong>Reception:</strong> [wishes for any gathering after the service]</li>
</ul>

<p>Written by: [Your Name]</p>`,
    description: "Outline your funeral preferences and memorial arrangements"
  },
  {
    value: "digital-legacy",
    label: "Digital Legacy",
    content: `<h1>My Digital Accounts & Passwords</h1>
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

<p>Prepared by: [Your Name]</p>`,
    description: "Instructions for handling your digital accounts and passwords"
  },
  {
    value: "pet-care",
    label: "Pet Care",
    content: `<h1>Care Instructions for My Beloved Pets</h1>

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
<p><strong>Phone:</strong> [phone number]</p>
<p><strong>Medical history:</strong> Records located in [location/file]</p>

<h3>Future Care Arrangements</h3>
<p>I would like [designated person] to adopt and care for my pet(s). I have discussed this with them, and they have agreed to this responsibility.</p>
<p>If that arrangement isn't possible, please contact [alternative person/rescue organization] at [contact information].</p>

<p>Thank you for ensuring my beloved companions continue to receive the love and care they deserve.</p>`,
    description: "Instructions for the care of your pets"
  },
  {
    value: "financial-affairs",
    label: "Financial Affairs",
    content: `<h1>My Financial Information & Instructions</h1>

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

<p>Please ensure all final expenses are paid from my estate before distributing assets according to my will.</p>
<p>Prepared by: [Your Name]</p>`,
    description: "Overview of your financial accounts, investments, and insurance"
  },
  {
    value: "social-media",
    label: "Social Media",
    content: `<h1>My Social Media Accounts & Digital Presence</h1>
<p>Here are my instructions for handling my social media accounts and online presence after I'm gone:</p>

<h3>Major Social Media Accounts</h3>
<ul>
  <li><strong>Facebook:</strong> I would like my account to be [memorialized/deleted]. If memorialized, please post a final message announcing my passing. If deleted, please download any photos or posts that might be meaningful to family members first.</li>
  <li><strong>Instagram:</strong> Please [keep as a memorial/delete] my account. Important photos should be saved before deletion.</li>
  <li><strong>Twitter/X:</strong> Please delete this account after downloading any meaningful content.</li>
  <li><strong>LinkedIn:</strong> Please have someone post a final update about my passing and then close the account.</li>
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

<p>For accounts not listed here, please use your best judgment to either memorialize or delete them as appropriate, always prioritizing privacy and dignity.</p>
<p>Prepared by: [Your Name]</p>`,
    description: "Instructions for managing your social media and online presence"
  },
  {
    value: "personal-inventory",
    label: "Personal Belongings",
    content: `<h1>Instructions for My Personal Belongings</h1>
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
</ul>

<p>For items not specifically mentioned, please distribute them fairly among family members who would value them, with preference given to those who express a meaningful connection to particular items.</p>
<p>Prepared by: [Your Name]</p>`,
    description: "Instructions for handling your personal belongings and possessions"
  },
  {
    value: "legal-affairs",
    label: "Legal Affairs",
    content: `<h1>My Legal Affairs Overview</h1>

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

<p>Prepared by: [Your Name]</p>`,
    description: "Overview of your legal documents and estate planning"
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