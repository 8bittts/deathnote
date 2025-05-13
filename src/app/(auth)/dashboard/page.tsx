"use client";

import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  DownloadIcon,
  Users,
  CreditCard,
  Activity,
  CheckCircle,
  Clock,
  BellRing,
  PlusCircle,
  X,
  Mail,
  RefreshCw,
  InfoIcon,
  UserCheck,
  Skull,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/overview";
import { RecentCheckins } from "@/components/recent-checkins";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeathNoteLogo from "@/components/icons/death-note-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/tiptap-editor";

// Contact interface
interface Contact {
  id: string;
  name: string;
  email: string;
  status: "Accepted" | "Pending";
}

// Interface to track user's premium features
interface PremiumFeatures {
  extendedExpiry: boolean;
  notifications: boolean;
  contacts: boolean;
}

// Interface for verification history record
interface VerificationRecord {
  id: string;
  date: string;
  device: string;
  location: string;
  status: "Success" | "Failed";
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Settings state
  const [userFullName, setUserFullName] = useState(`${firstName} ${lastName}`);
  const [userEmail, setUserEmail] = useState(email);
  const [userPhone, setUserPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [expiryDays, setExpiryDays] = useState("7");
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatures>({
    extendedExpiry: false,
    notifications: false,
    contacts: false
  });
  
  // Fetch premium features on load
  useEffect(() => {
    // In a real app, this would call your API to check user's subscription
    // For now, we'll simulate a check with user public metadata from Clerk
    if (user?.publicMetadata) {
      const metadata = user.publicMetadata;
      setPremiumFeatures({
        extendedExpiry: metadata.extendedExpiry === true,
        notifications: metadata.notifications === true,
        contacts: metadata.contacts === true
      });
    }
  }, [user]);
  
  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Accepted"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@example.com",
      status: "Pending"
    }
  ]);
  
  const [newContact, setNewContact] = useState({
    name: "",
    email: ""
  });

  // Editor state
  const [noteContent, setNoteContent] = useState('<h2>My Final Note</h2><p>Dear family and friends,</p><p>If you\'re reading this, it means I\'m no longer with you. I wanted to take this opportunity to share some final thoughts and wishes.</p><p>First and foremost, thank you for being part of my life journey. Each of you has contributed to making my life meaningful and full of joy.</p><p>Please remember me not with sadness, but with the happy memories we\'ve shared together.</p><p>With love and gratitude,</p><p>' + firstName + ' ' + lastName + '</p>');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // History state
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Fetch verification history
  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab === "history") {
        setIsLoadingHistory(true);
        try {
          // In a real app, this would call your API to fetch history
          // For now, we'll simulate a delay and return empty data to start with
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // This will be empty initially as we're not mocking data anymore
          setVerificationHistory([]);
        } catch (error) {
          console.error("Error fetching history:", error);
          toast.error("Failed to load verification history");
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };
    
    fetchHistory();
  }, [activeTab]);

  // Determine the active tab based on the current pathname or search params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (pathname.includes("/contacts")) {
      setActiveTab("contacts");
    } else if (pathname.includes("/editor")) {
      setActiveTab("editor");
    } else if (pathname.includes("/history")) {
      setActiveTab("history");
    } else if (pathname.includes("/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("overview");
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Instead of navigating to a different route, update the URL with the tab parameter
    if (value !== "overview") {
      // Add a small delay to give the UI time to update before changing the URL
      setTimeout(() => {
        router.push(`/dashboard?tab=${value}&source=tab`, { scroll: false });
      }, 100);
    } else {
      router.push("/dashboard", { scroll: false });
    }
  };
  
  // Contacts related functions
  const acceptedContacts = contacts.filter(contact => contact.status === "Accepted");
  const pendingContacts = contacts.filter(contact => contact.status === "Pending");

  const handleSendInvitation = () => {
    if (newContact.name && newContact.email) {
      const newId = (contacts.length + 1).toString();
      setContacts([
        ...contacts,
        {
          id: newId,
          name: newContact.name,
          email: newContact.email,
          status: "Pending"
        }
      ]);
      setNewContact({ name: "", email: "" });
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleResendInvitation = (id: string) => {
    // In a real app, this would send the invitation again
    console.log(`Resending invitation to contact with ID: ${id}`);
  };

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.firstName?.[0] || "U";

  // Update Clerk user profile
  const updateUserProfile = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Parse full name into first and last
      const nameParts = userFullName.trim().split(/\s+/);
      const newFirstName = nameParts[0] || "";
      const newLastName = nameParts.slice(1).join(" ") || "";
      
      // Update user's profile
      await user.update({
        firstName: newFirstName,
        lastName: newLastName,
      });
      
      // Update primary email if changed and not already verified
      if (userEmail !== email && userEmail) {
        const emailAddress = await user.createEmailAddress({ email: userEmail });
        if (emailAddress) {
          await emailAddress.prepareVerification({
            strategy: 'email_code',
          });
          
          toast.success("Verification email sent. Please check your inbox.");
        }
      }
      
      // Update phone if changed
      if (userPhone !== user.primaryPhoneNumber?.phoneNumber && userPhone) {
        const phoneNumber = await user.createPhoneNumber({ phoneNumber: userPhone });
        if (phoneNumber) {
          await phoneNumber.prepareVerification();
          toast.success("Verification SMS sent. Please check your phone.");
        }
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Save note content
  const saveNote = async (isDraft = false) => {
    try {
      setIsSavingNote(true);
      
      // In a real app, this would call your API to save the note
      // For now, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isDraft ? "Draft saved successfully" : "Note updated successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    } finally {
      setIsSavingNote(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      {/* Header with icon, title and subtitle */}
      <div className="flex flex-row items-center space-x-4 bg-muted/20 p-4 rounded-md">
        <div className="flex-shrink-0">
          <DeathNoteLogo size="md" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight">Death Note</h1>
          <p className="text-muted-foreground">
            Monitor and manage your final note to the world.
          </p>
              </div>
        <div className="ml-auto flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="h-10 border border-border px-2.5"
            onClick={() => {
              setActiveTab("settings");
              setTimeout(() => {
                router.push(`/dashboard?tab=settings&source=tab`, { scroll: false });
              }, 100);
            }}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-medium text-sm">{firstName} {lastName}</span>
              <Avatar className="h-7 w-7 rounded-md overflow-hidden p-0">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} className="object-cover" />
                <AvatarFallback className="rounded-md text-xs">{initials}</AvatarFallback>
              </Avatar>
            </div>
          </Button>
          <ThemeToggle />
              </div>
            </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="h-10 bg-muted/60 p-1 flex w-full rounded-md">
          <TabsTrigger 
            value="overview" 
            className="rounded-sm flex-1 px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="rounded-sm flex-1 px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="editor" 
            className="rounded-sm flex-1 px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            Editor
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-sm flex-1 px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            History
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-sm flex-1 px-3 py-1.5 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Note Recipients
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Until
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">May 21, 2025</div>
                <p className="text-xs text-muted-foreground">
                  15 days remaining
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Check-ins
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Active</div>
                <p className="text-xs text-muted-foreground">
                  Last verified Apr 27, 2025
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Your proof of life check-in history for the past 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
                <CardDescription>
                  Your most recent proof of life verifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCheckins />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Note</CardTitle>
                <CardDescription>
                  Edit your note or update your list of recipients.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button className="w-full" onClick={() => setActiveTab("editor")}>
                  Edit Note
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("contacts")}>
                  Manage Recipients
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Verify Your Status</CardTitle>
                <CardDescription>
                  Confirm your proof of life to keep your note secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <BellRing className="mr-2 h-4 w-4" />
                  Verify Now
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  By verifying, you confirm you are still alive and your note should remain private. 
                  Verification extends your status for 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Trusted Contacts</CardTitle>
                <CardDescription>
                  Manage the people who will receive your note if you stop checking in.
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-7">
                <div className="col-span-5">
                  <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="all">All ({contacts.length})</TabsTrigger>
                      <TabsTrigger value="accepted">Accepted ({acceptedContacts.length})</TabsTrigger>
                      <TabsTrigger value="pending">Pending ({pendingContacts.length})</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {contacts.map(contact => (
                        <Card key={contact.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{contact.name}</span>
                                  <Badge variant={contact.status === "Accepted" ? "default" : "outline"} className={contact.status === "Accepted" ? "bg-green-500 hover:bg-green-500" : "bg-yellow-500 hover:bg-yellow-500"}>
                                    {contact.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {contact.email}
              </div>
            </div>

                              <div className="flex gap-2">
                                {contact.status === "Pending" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleResendInvitation(contact.id)}
                                  >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Resend
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveContact(contact.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="accepted" className="space-y-4">
                      {acceptedContacts.length > 0 ? (
                        acceptedContacts.map(contact => (
                          <Card key={contact.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
              <div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{contact.name}</span>
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-500">Accepted</Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {contact.email}
                                  </div>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveContact(contact.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center text-muted-foreground">
                            No accepted contacts yet
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="pending" className="space-y-4">
                      {pendingContacts.length > 0 ? (
                        pendingContacts.map(contact => (
                          <Card key={contact.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
              <div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{contact.name}</span>
                                    <Badge variant="outline" className="bg-yellow-500 hover:bg-yellow-500">Pending</Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {contact.email}
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleResendInvitation(contact.id)}
                                  >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Resend
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveContact(contact.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center text-muted-foreground">
                            No pending invitations
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invite Contact</CardTitle>
                      <CardDescription>
                        Add someone to receive your note if needed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input 
                          id="fullName"
                          placeholder="Jane Doe"
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="emailAddress" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input 
                          id="emailAddress"
                          type="email"
                          placeholder="jane@example.com"
                          value={newContact.email}
                          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={handleSendInvitation}
                        disabled={!newContact.name || !newContact.email}
                      >
                        Send Invitation
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Contacts Status
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contacts.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {acceptedContacts.length} accepted, {pendingContacts.length} pending
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Note Editor</CardTitle>
              <CardDescription>Write your legacy note that will be sent to your contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <TiptapEditor 
                initialContent={noteContent}
                onChange={setNoteContent}
                className="min-h-[400px]"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => saveNote(true)}
                disabled={isSavingNote}
              >
                {isSavingNote ? "Saving..." : "Save Draft"}
              </Button>
              <Button 
                onClick={() => saveNote(false)}
                disabled={isSavingNote}
              >
                {isSavingNote ? "Updating..." : "Update Note"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>Track your past check-ins and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="h-60 flex items-center justify-center">
                  <div className="animate-pulse text-lg">Loading history...</div>
                </div>
              ) : verificationHistory.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Device</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {verificationHistory.map((record) => (
                        <tr key={record.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.device}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.location}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Badge variant={record.status === "Success" ? "default" : "destructive"}>
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-60 flex flex-col items-center justify-center border rounded-md p-6">
                  <p className="text-muted-foreground text-center mb-4">
                    No verification history yet. Your verification records will appear here once you verify your status.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab("overview");
                      router.push('/dashboard?tab=overview', { scroll: false });
                    }}
                  >
                    Go to Overview
                  </Button>
                </div>
              )}
            </CardContent>
            {verificationHistory.length > 0 && (
              <CardFooter>
                <Button variant="outline">Export History</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your preferences and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profile</h3>
                <Separator />
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input 
                      id="name" 
                      value={userFullName} 
                      onChange={(e) => setUserFullName(e.target.value)} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="email" 
                        type="email" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        className="flex-1" 
                      />
                      {user?.primaryEmailAddress?.verification?.status === "verified" && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={userPhone} 
                        onChange={(e) => setUserPhone(e.target.value)} 
                        className="flex-1" 
                        placeholder="+1 555 123 4567"
                      />
                      {user?.primaryPhoneNumber?.verification?.status === "verified" && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Verification Settings</h3>
                <Separator />
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="reminder" className="text-sm font-medium">
                      Expiry Days
                    </label>
                    <div className="col-span-3">
                      <select 
                        id="reminder" 
                        className="w-full p-2 border rounded-md"
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(e.target.value)}
                        disabled={!premiumFeatures.extendedExpiry}
                      >
                        <option value="7">7 days (Default)</option>
                        {premiumFeatures.extendedExpiry ? (
                          <>
                            <option value="14">14 days</option>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                          </>
                        ) : (
                          <option value="premium" disabled>
                            Upgrade for extended options
                          </option>
                        )}
                      </select>
                      {!premiumFeatures.extendedExpiry && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <InfoIcon className="inline-block h-3 w-3 mr-1" />
                          Upgrade to premium for extended verification periods.
                        </p>
                      )}
              </div>
            </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="notifications" className="text-sm font-medium">
                      Notifications
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Badge variant={premiumFeatures.notifications ? "default" : "outline"} className={premiumFeatures.notifications ? "bg-blue-500" : ""}>
                        {premiumFeatures.notifications ? "Enabled" : "Premium Feature"}
                      </Badge>
                    </div>
          </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="contacts" className="text-sm font-medium">
                      Unlimited Contacts
                    </label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Badge variant={premiumFeatures.contacts ? "default" : "outline"} className={premiumFeatures.contacts ? "bg-blue-500" : ""}>
                        {premiumFeatures.contacts ? "Enabled" : "Premium Feature"}
                      </Badge>
                      {!premiumFeatures.contacts && (
                        <span className="text-xs text-muted-foreground">
                          (2 contacts on free plan)
                        </span>
                      )}
                    </div>
                  </div>
            </div>
          </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <Separator />
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium">
                      Premium Features
                    </label>
                    <div className="col-span-3">
                      <Button variant="outline" onClick={() => window.open('/pricing', '_blank')}>
                        Upgrade Account
                      </Button>
                    </div>
            </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-sm font-medium">
                      Account
                    </label>
                    <div className="col-span-3">
                      {/* Sign Out button removed from here */}
          </div>
        </div>
      </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button 
                  onClick={updateUserProfile} 
                  disabled={isUpdating}
                  className="w-full md:w-auto"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-700" 
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 