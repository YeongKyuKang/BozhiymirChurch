"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteContent } from "@/lib/content-manager"
import { Save, Download, Upload, RefreshCw } from "lucide-react"

export default function ContentManagerPage() {
  const [content, setContent] = useState(siteContent)
  const [activeTab, setActiveTab] = useState("hero")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving to database/file
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save to database here
    console.log("Saving content:", content)
    localStorage.setItem("siteContent", JSON.stringify(content))

    setIsSaving(false)
    alert("Content saved successfully!")
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "church-content.json"
    link.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedContent = JSON.parse(e.target?.result as string)
          setContent(importedContent)
          alert("Content imported successfully!")
        } catch (error) {
          alert("Error importing content. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const updateContent = (path: string[], value: string) => {
    setContent((prev) => {
      const newContent = { ...prev }
      let current: any = newContent

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }

      current[path[path.length - 1]] = value
      return newContent
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
            <p className="text-gray-600">Manage all website content from one place</p>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="ukrainian">Ukrainian</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="common">Common</TabsTrigger>
          </TabsList>
          {/* Hero Section Content */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Main Title</label>
                  <Input
                    value={content.hero.title}
                    onChange={(e) => updateContent(["hero", "title"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <Input
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent(["hero", "subtitle"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Times</label>
                  <Input
                    value={content.hero.serviceTimes}
                    onChange={(e) => updateContent(["hero", "serviceTimes"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (English)</label>
                  <Textarea
                    value={content.hero.description}
                    onChange={(e) => updateContent(["hero", "description"], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (Ukrainian)</label>
                  <Textarea
                    value={content.hero.descriptionUkrainian}
                    onChange={(e) => updateContent(["hero", "descriptionUkrainian"], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scripture</label>
                  <Textarea
                    value={content.hero.scripture}
                    onChange={(e) => updateContent(["hero", "scripture"], e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Beliefs Content */}
          <TabsContent value="beliefs">
            <Card>
              <CardHeader>
                <CardTitle>Beliefs Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Title</label>
                  <Input
                    value={content.beliefs.title}
                    onChange={(e) => updateContent(["beliefs", "title"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Page Subtitle</label>
                  <Textarea
                    value={content.beliefs.subtitle}
                    onChange={(e) => updateContent(["beliefs", "subtitle"], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Foundation Scripture Verse</label>
                  <Textarea
                    value={content.beliefs.foundationScripture.verse}
                    onChange={(e) => updateContent(["beliefs", "foundationScripture", "verse"], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scripture Reference</label>
                  <Input
                    value={content.beliefs.foundationScripture.reference}
                    onChange={(e) => updateContent(["beliefs", "foundationScripture", "reference"], e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Individual Beliefs</h3>
                  {content.beliefs.beliefsList.map((belief, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="Belief Title"
                          value={belief.title}
                          onChange={(e) => {
                            const newBeliefs = [...content.beliefs.beliefsList]
                            newBeliefs[index].title = e.target.value
                            setContent((prev) => ({
                              ...prev,
                              beliefs: {
                                ...prev.beliefs,
                                beliefsList: newBeliefs,
                              },
                            }))
                          }}
                        />
                        <Textarea
                          placeholder="Belief Description"
                          value={belief.description}
                          onChange={(e) => {
                            const newBeliefs = [...content.beliefs.beliefsList]
                            newBeliefs[index].description = e.target.value
                            setContent((prev) => ({
                              ...prev,
                              beliefs: {
                                ...prev.beliefs,
                                beliefsList: newBeliefs,
                              },
                            }))
                          }}
                          rows={3}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ukrainian Ministry Content */}
          <TabsContent value="ukrainian">
            <Card>
              <CardHeader>
                <CardTitle>Ukrainian Ministry Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Page Title</label>
                  <Input
                    value={content.ukrainianMinistry.title}
                    onChange={(e) => updateContent(["ukrainianMinistry", "title"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Page Subtitle</label>
                  <Textarea
                    value={content.ukrainianMinistry.subtitle}
                    onChange={(e) => updateContent(["ukrainianMinistry", "subtitle"], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Biblical Foundation Verse</label>
                  <Textarea
                    value={content.ukrainianMinistry.biblicalFoundation.verse}
                    onChange={(e) =>
                      updateContent(["ukrainianMinistry", "biblicalFoundation", "verse"], e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Impact Statistics</h3>
                  {content.ukrainianMinistry.impact.stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Number"
                        value={stat.number}
                        onChange={(e) => {
                          const newStats = [...content.ukrainianMinistry.impact.stats]
                          newStats[index].number = e.target.value
                          setContent((prev) => ({
                            ...prev,
                            ukrainianMinistry: {
                              ...prev.ukrainianMinistry,
                              impact: {
                                ...prev.ukrainianMinistry.impact,
                                stats: newStats,
                              },
                            },
                          }))
                        }}
                      />
                      <Input
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.ukrainianMinistry.impact.stats]
                          newStats[index].label = e.target.value
                          setContent((prev) => ({
                            ...prev,
                            ukrainianMinistry: {
                              ...prev.ukrainianMinistry,
                              impact: {
                                ...prev.ukrainianMinistry.impact,
                                stats: newStats,
                              },
                            },
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Content */}
          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Church Name</label>
                  <Input
                    value={content.footer.churchName}
                    onChange={(e) => updateContent(["footer", "churchName"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={content.footer.description}
                    onChange={(e) => updateContent(["footer", "description"], e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={content.footer.contact.phone}
                    onChange={(e) => updateContent(["footer", "contact", "phone"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={content.footer.contact.email}
                    onChange={(e) => updateContent(["footer", "contact", "email"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Street</label>
                  <Input
                    value={content.footer.contact.address.street}
                    onChange={(e) => updateContent(["footer", "contact", "address", "street"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address City</label>
                  <Input
                    value={content.footer.contact.address.city}
                    onChange={(e) => updateContent(["footer", "contact", "address", "city"], e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Elements */}
          <TabsContent value="common">
            <Card>
              <CardHeader>
                <CardTitle>Common Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Learn More Button</label>
                  <Input
                    value={content.common.buttons.learnMore}
                    onChange={(e) => updateContent(["common", "buttons", "learnMore"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Get Involved Button</label>
                  <Input
                    value={content.common.buttons.getInvolved}
                    onChange={(e) => updateContent(["common", "buttons", "getInvolved"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Us Button</label>
                  <Input
                    value={content.common.buttons.contactUs}
                    onChange={(e) => updateContent(["common", "buttons", "contactUs"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Join Us Button</label>
                  <Input
                    value={content.common.buttons.joinUs}
                    onChange={(e) => updateContent(["common", "buttons", "joinUs"], e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visit Us Button</label>
                  <Input
                    value={content.common.buttons.visitUs}
                    onChange={(e) => updateContent(["common", "buttons", "visitUs"], e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
