"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";

export function RecentCheckins() {
  const checkins = [
    {
      date: "2025-04-27",
      time: "09:15 AM",
      device: "iPhone",
      location: "Home",
    },
    {
      date: "2025-04-17",
      time: "02:30 PM",
      device: "MacBook",
      location: "Office",
    },
    {
      date: "2025-04-07",
      time: "07:45 PM",
      device: "iPhone",
      location: "Home",
    },
    {
      date: "2025-03-28",
      time: "11:20 AM",
      device: "iPad",
      location: "Cafe",
    },
    {
      date: "2025-03-18",
      time: "05:10 PM",
      device: "MacBook",
      location: "Office",
    },
  ];

  return (
    <div className="space-y-8">
      {checkins.map((checkin, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Verified on {checkin.date}
            </p>
            <p className="text-sm text-muted-foreground">
              {checkin.time} • {checkin.device} • {checkin.location}
            </p>
          </div>
          <div className="ml-auto font-medium">Success</div>
        </div>
      ))}
    </div>
  );
} 