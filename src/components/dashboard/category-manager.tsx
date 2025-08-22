"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleDocsService, type Category, type Tag } from "@/lib/google-docs"
import { Plus, Settings, TagIcon } from "lucide-react"
import { useState, useEffect } from "react"

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const googleDocsService = GoogleDocsService.getInstance()

  useEffect(() => {
    setCategories(googleDocsService.getCategories())
    setTags(googleDocsService.getTags())
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Categories & Tags
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Categories & Tags</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Categories Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge className={category.color}>{category.name}</Badge>
                          <span className="text-sm text-muted-foreground">({category.count})</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <Badge variant="outline" className={tag.color}>
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Category */}
                <div className="space-y-3">
                  <h4 className="font-medium">Add New Category</h4>
                  <div className="flex gap-2">
                    <Input placeholder="Category name" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Add</Button>
                  </div>
                </div>

                {/* Add New Tag */}
                <div className="space-y-3">
                  <h4 className="font-medium">Add New Tag</h4>
                  <div className="flex gap-2">
                    <Input placeholder="Tag name" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <Badge key={category.id} variant="secondary" className={category.color}>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Popular Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <Badge key={tag.id} variant="outline" className={tag.color}>
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
