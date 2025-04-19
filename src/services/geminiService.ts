
import { ImageMetadata } from '@/types/types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const storeApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export const analyzeImage = async (imageBase64: string, apiKey: string): Promise<ImageMetadata> => {
  const prompt = `
    Analyze this image in detail and provide the following information in a structured JSON format:
    
    1. medium: What type of image is this? (Photography, Painting, Digital Art, etc.)
    2. people: Information about people in the image
       - count: Number of people
       - ageEstimate: Estimated age range
       - gender: Gender(s) present
    3. actions: What actions are being performed? (list)
    4. clothes: What type of clothing is visible? (list)
    5. environment: Is it indoor, outdoor, city, nature, etc.?
    6. colors: Top 3 dominant colors (list)
    7. style: The style of the image (abstract, realistic, vintage, modern, etc.)
    8. mood: The overall mood of the image (happy, dramatic, nostalgic, etc.)
    9. scene: Short description of the scene (30-40 words maximum)
    
    Return ONLY the JSON without any additional text.
  `;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64.split(',')[1] // Remove the data:image/jpeg;base64, part
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          top_p: 1,
          top_k: 32,
          max_output_tokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    let parsedMetadata: ImageMetadata;
    
    try {
      // Sometimes the model returns markdown with ```json, so we need to clean it
      const jsonStr = textResponse.replace(/```json|```/g, '').trim();
      parsedMetadata = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', textResponse);
      throw new Error('Failed to parse API response.');
    }

    return parsedMetadata;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const generateImageBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
