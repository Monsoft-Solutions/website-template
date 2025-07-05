"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import {
  Eye,
  Edit3,
  Type,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Markdown editor component with live preview
 * Provides editing and preview modes with common markdown shortcuts
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in markdown...",
  className,
  error,
  disabled = false,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Insert markdown at cursor position
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(
      "markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    { icon: Type, label: "Heading", action: () => insertMarkdown("## ") },
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: List, label: "Bullet List", action: () => insertMarkdown("- ") },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. "),
    },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("> ") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    {
      icon: Image,
      label: "Image",
      action: () => insertMarkdown("![alt text](", ")"),
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "edit" | "preview")
        }
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div className="flex items-center gap-1">
              {toolbarButtons.map((button) => (
                <Button
                  key={button.label}
                  variant="outline"
                  size="sm"
                  onClick={button.action}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                  title={button.label}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Textarea
                id="markdown-editor"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onChange(e.target.value)
                }
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "min-h-[400px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none font-mono text-sm",
                  error && "border-destructive"
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {value.trim() ? (
                <Markdown content={value} />
              ) : (
                <p className="text-muted-foreground italic">
                  Nothing to preview. Write some content in the editor.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
