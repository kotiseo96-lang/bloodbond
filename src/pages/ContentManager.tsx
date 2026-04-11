"use client"

import type React from "react"
import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import { CONTENT_SECTIONS } from "@/types/database"
import ContentEditor from "@/components/admin/ContentEditor"

const ContentManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"home" | "hospitals" | "blood_banks">("home")

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Content Manager</h1>
          <p className="text-muted-foreground mt-1">Manage website content with TipTap editor</p>
        </div>

        <Card className="p-6">
          <Tabs value={activeSection} onValueChange={(val: any) => setActiveSection(val)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="home">
                <FileText className="h-4 w-4 mr-2" />
                Home
              </TabsTrigger>
              <TabsTrigger value="hospitals">
                <FileText className="h-4 w-4 mr-2" />
                Hospitals
              </TabsTrigger>
              <TabsTrigger value="blood_banks">
                <FileText className="h-4 w-4 mr-2" />
                Blood Banks
              </TabsTrigger>
            </TabsList>

            {CONTENT_SECTIONS.map((section) => (
              <TabsContent key={section} value={section} className="mt-6">
                <ContentEditor section={section as any} />
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default ContentManager
