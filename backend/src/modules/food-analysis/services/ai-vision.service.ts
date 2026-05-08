import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

export interface DetectedFood {
  name: string;
  quantity: string;
  servingSize: number;
  servingUnit: string;
  confidence: number;
}

const FOOD_PROMPT = `Analyze this food image. Identify ALL food items visible. For each food item, provide:
1. Name of the food
2. Estimated quantity (e.g., "1 piece", "1 cup", "200g")
3. Estimated serving size in grams (numeric)
4. Serving unit (e.g., "g", "oz", "ml")

Respond ONLY with valid JSON in this exact format, no other text:
[
  {
    "name": "Food Name",
    "quantity": "1 piece",
    "servingSize": 150,
    "servingUnit": "g",
    "confidence": 0.95
  }
]

If no food is detected, return an empty array: []`;

@Injectable()
export class AiVisionService {
  private readonly logger = new Logger(AiVisionService.name);
  private readonly apiKey: string;
  private readonly provider: string;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('AI_API_KEY', '');
    this.provider = this.config.get('AI_PROVIDER', 'gemini').toLowerCase();
    this.model = this.config.get('AI_MODEL', 'nvidia/nemotron-nano-12b-v2-vl:free');
  }

  async detectFoods(imgPath: string): Promise<DetectedFood[]> {
    const imageBuffer = fs.readFileSync(imgPath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = this.getMimeType(imgPath);

    try {
      let foods: DetectedFood[];

      switch (this.provider) {
        case 'openrouter':
          foods = await this.callOpenRouter(base64Image, mimeType);
          break;
        case 'gemini':
        default:
          foods = await this.callGemini(base64Image, mimeType);
          break;
      }

      return foods;
    } catch (error) {
      this.logger.error(`Food detection failed: ${error.message}`);
      throw error;
    }
  }

  private async callGemini(base64Image: string, mimeType: string): Promise<DetectedFood[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType, data: base64Image } },
              { text: FOOD_PROMPT },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Gemini API error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return this.parseFoods(text);
  }

  private async callOpenRouter(base64Image: string, mimeType: string): Promise<DetectedFood[]> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
              { type: 'text', text: FOOD_PROMPT },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`OpenRouter API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenRouter API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return this.parseFoods(text);
  }

  private parseFoods(text: string): DetectedFood[] {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      this.logger.warn(`No JSON array found in AI response: ${text.substring(0, 200)}`);
      return [];
    }

    const foods: DetectedFood[] = JSON.parse(jsonMatch[0]);
    return foods.map((food) => ({
      name: food.name,
      quantity: food.quantity || '1 serving',
      servingSize: food.servingSize || 100,
      servingUnit: food.servingUnit || 'g',
      confidence: food.confidence || 0.8,
    }));
  }

  private getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (!ext) return 'image/jpeg';
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return mimeMap[ext] || 'image/jpeg';
  }
}
