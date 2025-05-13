"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="md:w-[200px] lg:w-[300px]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
} 