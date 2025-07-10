import { UIMessage, ModelMessage, convertToModelMessages } from "ai";

/**
 * Message handler class for AI SDK 5 Beta
 * Handles conversion between UIMessage and ModelMessage types
 */
export class MessageHandler {
  /**
   * Convert UI messages to model messages for AI generation
   */
  convertToModelMessages(uiMessages: UIMessage[]): ModelMessage[] {
    return convertToModelMessages(uiMessages);
  }

  /**
   * Extract text content from message parts
   */
  extractTextFromMessage(message: UIMessage): string {
    if (!message.parts) return "";

    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => (part.type === "text" ? part.text : ""))
      .join(" ");
  }

  /**
   * Validate message format
   */
  validateMessage(message: UIMessage): boolean {
    return (
      typeof message.id === "string" &&
      typeof message.role === "string" &&
      Array.isArray(message.parts) &&
      message.parts.length > 0
    );
  }

  /**
   * Filter messages by role
   */
  filterMessagesByRole(messages: UIMessage[], role: string): UIMessage[] {
    return messages.filter((message) => message.role === role);
  }

  /**
   * Get conversation context from recent messages
   */
  getConversationContext(
    messages: UIMessage[],
    maxMessages: number = 10
  ): UIMessage[] {
    return messages.slice(-maxMessages);
  }

  /**
   * Calculate total tokens in messages (estimation)
   */
  estimateTokenCount(messages: UIMessage[]): number {
    const totalContent = messages
      .map((msg) => this.extractTextFromMessage(msg))
      .join(" ");

    // Rough estimation: ~4 characters per token
    return Math.ceil(totalContent.length / 4);
  }

  /**
   * Trim messages to fit within token limit
   * TODO: if this is necessary, then we should summarize the conversation instead
   */
  trimMessagesToTokenLimit(
    messages: UIMessage[],
    maxTokens: number = 3000
  ): UIMessage[] {
    const systemMessages = messages.filter((msg) => msg.role === "system");
    const conversationMessages = messages.filter(
      (msg) => msg.role !== "system"
    );

    let currentTokens = this.estimateTokenCount(systemMessages);
    const trimmedMessages: UIMessage[] = [...systemMessages];

    // Add conversation messages from most recent
    for (let i = conversationMessages.length - 1; i >= 0; i--) {
      const message = conversationMessages[i];
      const messageTokens = this.estimateTokenCount([message]);

      if (currentTokens + messageTokens <= maxTokens) {
        trimmedMessages.unshift(message);
        currentTokens += messageTokens;
      } else {
        break;
      }
    }

    // Sort by creation order (latest messages last)
    return trimmedMessages.reverse();
  }

  /**
   * Count messages by role
   */
  countMessagesByRole(messages: UIMessage[]): Record<string, number> {
    return messages.reduce((counts, message) => {
      counts[message.role] = (counts[message.role] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  /**
   * Get the last message from a conversation
   */
  getLastMessage(messages: UIMessage[]): UIMessage | null {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }

  /**
   * Check if a message contains specific content
   */
  messageContains(message: UIMessage, searchText: string): boolean {
    const text = this.extractTextFromMessage(message).toLowerCase();
    return text.includes(searchText.toLowerCase());
  }
}
