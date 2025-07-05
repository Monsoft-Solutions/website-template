"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { Tag } from "@/lib/types/blog/tag.type";

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  disabled?: boolean;
}

/**
 * Tag selector component for blog post form
 * Allows selecting from existing tags and creating new ones
 */
export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
  disabled = false,
}: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("");

  const handleTagSelect = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    if (tag && !selectedTags.find((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      // Create a temporary tag object
      const tempTag: Tag = {
        id: `temp-${Date.now()}`,
        name: newTagName.trim(),
        slug: newTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date(),
      };

      onTagsChange([...selectedTags, tempTag]);
      setNewTagName("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select onValueChange={handleTagSelect} disabled={disabled}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select existing tags" />
          </SelectTrigger>
          <SelectContent>
            {availableTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new tag"
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddNewTag}
          disabled={disabled || !newTagName.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Tags</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag.name}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tag.id)}
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
