import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
  content: ReactNode;
  count?: number;
}

interface SectionTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
  showCounts?: boolean;
  tabsListClassName?: string;
  cardHeader?: ReactNode;
}

export function SectionTabs({
  tabs,
  defaultValue,
  className = "space-y-4",
  showCounts = false,
  tabsListClassName,
  cardHeader,
}: SectionTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.value || "";

  return (
    <Card>
      {cardHeader && (
        <CardHeader className="px-4 py-3 border-b">
          {cardHeader}
        </CardHeader>
      )}
      <CardContent className={cardHeader ? "p-0" : "pt-6 px-4"}>
        <Tabs defaultValue={defaultTab} className={className}>
          <TabsList className={tabsListClassName}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {showCounts && tab.count !== undefined && (
                  <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4 pt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 