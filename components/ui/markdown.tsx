import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface MarkdownProps {
  /**
   * The markdown content to render
   */
  content: string;
  /**
   * Additional className to apply to the wrapper div
   */
  className?: string;
}

/**
 * Markdown component for rendering markdown content with syntax highlighting and styling
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Markdown content="# Hello, world!" />
 *
 * // With custom className
 * <Markdown
 *   content="## Custom styled markdown"
 *   className="bg-muted p-4 rounded-lg"
 * />
 * ```
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn("prose prose-gray dark:prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1 className="text-4xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-3xl font-bold mt-5 mb-3" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />
          ),
          h4: (props) => (
            <h4 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          p: (props) => <p className="my-4" {...props} />,
          a: (props) => (
            <a className="text-primary hover:underline" {...props} />
          ),
          ul: (props) => <ul className="list-disc pl-6 my-4" {...props} />,
          ol: (props) => <ol className="list-decimal pl-6 my-4" {...props} />,
          li: (props) => <li className="mb-1" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic my-6"
              {...props}
            />
          ),
          code: (props) => {
            return props.className?.includes("language-") ? (
              <code
                className={`block bg-muted p-4 rounded-md overflow-x-auto text-sm my-4 ${props.className}`}
                {...props}
              />
            ) : (
              <code
                className="bg-muted px-1 py-0.5 rounded text-sm"
                {...props}
              />
            );
          },
          img: (props) => (
            <img className="max-w-full h-auto rounded-md my-6" {...props} />
          ),
          table: (props) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-muted" {...props} />,
          tr: (props) => <tr className="border-b" {...props} />,
          th: (props) => <th className="p-2 text-left font-bold" {...props} />,
          td: (props) => (
            <td className="p-2 border-r last:border-r-0" {...props} />
          ),
          hr: (props) => (
            <hr className="my-8 border-t border-muted" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
