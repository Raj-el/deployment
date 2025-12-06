
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY not found in environment variables');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private model: any;
  private chatHistory: ChatMessage[] = [];

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async sendMessage(message: string, context?: string): Promise<string> {
    if (!this.model) {
      return "I'm currently unable to connect to the AI service. Please check your API configuration.";
    }

    try {
      // Add context if provided
      const contextualMessage = context 
        ? `Context: ${context}\n\nUser Question: ${message}`
        : message;

      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      const result = await this.model.generateContent(contextualMessage);
      const response = await result.response;
      const text = response.text();

      // Add assistant response to history
      this.chatHistory.push({
        role: 'assistant',
        content: text,
        timestamp: new Date()
      });

      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearHistory(): void {
    this.chatHistory = [];
  }
}

export const geminiService = new GeminiService();
