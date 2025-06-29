

import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AiModel, Project, Recommendation, GeminiMessage, ProofreadingResult, ExtractionResult, PredefinedModelType, ExtractedField, ResumeOptimizationResult } from '../types'; 
import { INSPIRED_PROJECTS_DATA, BEST_AI_MODELS_DATA, USER_INTERESTS_SERVICES } from '../constants';

// Initialize Gemini AI Client
let ai: GoogleGenAI;
let isApiKeyValid = false;

if (process.env.API_KEY && process.env.API_KEY.trim() !== "") {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    isApiKeyValid = true;
    console.log("Gemini API initialized successfully with API_KEY from environment variable.");
  } catch (error) {
    // @ts-ignore
    ai = null;
    isApiKeyValid = false;
    console.error("Error initializing GoogleGenAI with API_KEY:", error);
    console.warn("Gemini API Key (process.env.API_KEY) might be invalid. Gemini features will be impaired or use mocks.");
  }
} else {
  // @ts-ignore
  ai = null; 
  isApiKeyValid = false;
  console.warn("Gemini API Key (process.env.API_KEY) not found or is empty. Gemini features will be impaired or use mocks. Ensure the API_KEY environment variable is set.");
}


const TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
const VISION_MODEL = 'gemini-2.5-flash-preview-04-17'; // Flash supports vision


// Simulate API latency
const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getAiRecommendations = async (userInterests: string[], userId?: string): Promise<Recommendation[]> => {
  console.log(`Simulating Gemini: Fetching AI recommendations for interests: ${userInterests.join(', ')}. UserID: ${userId || 'N/A'}`);
  // This is mock data logic, actual Gemini call would be different
  const filteredServices = USER_INTERESTS_SERVICES.filter(s => userInterests.some(interest => s.category.includes(interest)));
  return simulateDelay(filteredServices.length > 0 ? filteredServices.slice(0,3) : USER_INTERESTS_SERVICES.slice(0,3), 300);
};

export const getInspiredProjects = async (userId?: string): Promise<Project[]> => {
  console.log(`Simulating Gemini: Fetching inspired projects. UserID: ${userId || 'N/A'}`);
  return simulateDelay(INSPIRED_PROJECTS_DATA, 600); // Mock data
};

export const getBestAiModels = async (userId?: string): Promise<AiModel[]> => {
  console.log(`Simulating Gemini: Fetching best AI models. UserID: ${userId || 'N/A'}`);
  return simulateDelay(BEST_AI_MODELS_DATA, 400); // Mock data
};

export const generateStructuredContentPlan = async (userPrompt: string): Promise<{title: string, description: string}[]> => {
    if (!isApiKeyValid) {
        console.warn("Gemini API Key not valid. Plan generation is mocked.");
        return simulateDelay([
            { title: 'Mock Introduction', description: `This is a mock introduction for the topic: ${userPrompt}.` },
            { title: 'Mock Main Point 1', description: 'This is the first key point. In a real response, this would be a detailed instruction for the AI writer.' },
            { title: 'Mock Main Point 2', description: 'This is the second key point, demonstrating the structure of the content plan.' },
            { title: 'Mock Conclusion', description: 'This is a mock conclusion, summarizing the points and providing a call to action.' }
        ], 1000);
    }

    const prompt = `You are a content strategist. A user wants to write about: "${userPrompt}".
    Your task is to create a structured content plan or outline.
    The output MUST be a valid JSON array of objects. Each object in the array represents a section of the content and must have two properties:
    1. "title": A concise heading for the section (e.g., "The Rise of Remote Work").
    2. "description": A detailed instruction for the AI writer on what to cover in this section.

    Example response for a prompt "benefits of meditation":
    [
        {"title": "Introduction to Meditation", "description": "Start with a hook to grab the reader's attention. Briefly explain what meditation is and what the article will cover."},
        {"title": "Stress Reduction", "description": "Detail how meditation helps in reducing stress. Mention scientific evidence or studies if possible, explaining the effect on cortisol levels."},
        {"title": "Improved Focus and Concentration", "description": "Explain the link between regular meditation practice and enhanced cognitive functions like focus and attention span."},
        {"title": "Conclusion and Call to Action", "description": "Summarize the key benefits discussed. End with an encouraging note and a simple call to action, like suggesting a 5-minute daily practice."}
    ]

    Now, generate the plan for the user's topic. Do not wrap the JSON in markdown fences.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        let jsonStr = response.text.trim();
        // Although we ask not to, model might still wrap in ```json ... ```
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedPlan = JSON.parse(jsonStr);

        if (Array.isArray(parsedPlan) && parsedPlan.length > 0 && parsedPlan.every(item => typeof item.title === 'string' && typeof item.description === 'string')) {
            return parsedPlan;
        } else {
            console.error("Invalid plan structure received from AI:", parsedPlan);
            throw new Error("The AI returned a plan in an unexpected format.");
        }
    } catch (error) {
        console.error("Error generating content plan with Gemini:", error);
        throw new Error("Failed to generate a content plan from the AI. Please try a different topic or try again later.");
    }
};


export const generateTextWithGemini = async (prompt: string, userId?: string): Promise<string> => {
  console.log(`Simulating Gemini: Generating text for prompt: "${prompt.substring(0,50)}...". UserID: ${userId || 'N/A'}`);
  let generatedText = `This is a simulated AI-generated text based on your prompt: "${prompt.substring(0, 50)}...". In a real application, this would be dynamic content from Gemini.`;
  
  if (!isApiKeyValid) {
     console.warn("Gemini API Key not valid. Text generation calls are mocked.");
  } else {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: TEXT_MODEL,
          contents: prompt,
        });
        generatedText = response.text; 
    } catch (error) {
        console.error("Error generating text with Gemini:", error);
        generatedText = `Error generating text. Simulated fallback response for prompt: "${prompt.substring(0,50)}..."`;
    }
  }
  // Simulate delay for mocked response, real API calls have their own latency
  return isApiKeyValid ? generatedText : simulateDelay(generatedText, 800);
};

export const proofreadTextWithGemini = async (text: string): Promise<ProofreadingResult> => {
    if (!isApiKeyValid) {
        console.warn("Gemini API Key not valid. Proofreading is mocked.");
        const mockCorrectedText = text.replace(/teh/g, 'the').replace(/wierd/g, 'weird');
        return simulateDelay({
            summary: "Mocked: Corrected 2 errors (1 spelling, 1 grammar).",
            suggestions: [
                { original: "teh", corrected: "the", type: "Spelling", explanation: "A common typographical error." },
                { original: "wierd", corrected: "weird", type: "Spelling", explanation: "'i' before 'e' except after 'c' rule applies." },
            ],
            correctedText: mockCorrectedText,
        }, 1500);
    }

    const prompt = `You are an expert proofreader and editor. Analyze the following text for any errors in spelling, grammar, punctuation, and style.
    Your output MUST be a single, valid JSON object with the following structure:
    {
      "summary": "A brief, one-sentence summary of the changes made (e.g., 'Corrected 5 errors: 2 spelling, 3 grammar').",
      "suggestions": [
        {
          "original": "The original text snippet with the error.",
          "corrected": "The corrected version of the snippet.",
          "type": "Spelling" | "Grammar" | "Punctuation" | "Style" | "Clarity" | "Other",
          "explanation": "A concise explanation of why the change was made."
        }
      ],
      "correctedText": "The full, final text with all corrections applied."
    }

    Only identify significant errors. Do not make minor stylistic changes unless they greatly improve clarity.
    If there are no errors, return the JSON with an empty "suggestions" array and the original text in "correctedText".

    Here is the text to analyze:
    ---
    ${text}
    ---

    Do not wrap the JSON in markdown fences.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedResult = JSON.parse(jsonStr) as ProofreadingResult;

        if (parsedResult && typeof parsedResult.summary === 'string' && Array.isArray(parsedResult.suggestions) && typeof parsedResult.correctedText === 'string') {
            return parsedResult;
        } else {
            console.error("Invalid proofreading result structure received from AI:", parsedResult);
            throw new Error("The AI returned data in an unexpected format.");
        }
    } catch (error) {
        console.error("Error proofreading text with Gemini:", error);
        throw new Error("Failed to get proofreading suggestions from the AI. Please try again later.");
    }
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const extractDataFromDocument = async (file: File, modelType: PredefinedModelType): Promise<ExtractionResult> => {
    if (!isApiKeyValid) {
        console.warn("Gemini API Key not valid. Data extraction is mocked.");
        const mockData: Record<PredefinedModelType, ExtractedField[]> = {
            invoice: [
                { key: "Vendor Name", value: "Mock Supplies Inc.", confidence: 0.98, originalValue: "Mock Supplies Inc." },
                { key: "Invoice Number", value: "INV-2024-001", confidence: 0.99, originalValue: "INV-2024-001" },
                { key: "Invoice Date", value: "2024-07-30", confidence: 0.95, originalValue: "2024-07-30" },
                { key: "Total Amount", value: "150.00", confidence: 0.97, originalValue: "150.00" },
            ],
            receipt: [
                { key: "Merchant Name", value: "Mock Coffee Shop", confidence: 0.99, originalValue: "Mock Coffee Shop" },
                { key: "Transaction Date", value: "2024-07-30", confidence: 0.96, originalValue: "2024-07-30" },
                { key: "Transaction Time", value: "08:32 AM", confidence: 0.92, originalValue: "08:32 AM" },
                { key: "Total Amount", value: "5.75", confidence: 0.98, originalValue: "5.75" },
            ],
        }
        return simulateDelay({ fields: mockData[modelType] }, 2000);
    }

    const imagePart = await fileToGenerativePart(file);
    
    const fieldsToExtract = {
        invoice: `Vendor Name, Invoice Number, Invoice Date (in YYYY-MM-DD format), Due Date (in YYYY-MM-DD format), Total Amount (as a number), and a list of line items with description, quantity, and unit price.`,
        receipt: `Merchant Name, Merchant Address, Transaction Date (in YYYY-MM-DD format), Transaction Time, Total Amount (as a number), and Tax Amount (as a number).`
    }

    const prompt = `You are an expert Intelligent Document Processing (IDP) engine. Analyze the provided image of a ${modelType}.
    Extract the following fields: ${fieldsToExtract[modelType]}
    
    Your output MUST be a single, valid JSON object with a single key "fields".
    The value of "fields" should be an array of objects, where each object represents an extracted field and has three properties:
    1. "key": The name of the field (e.g., "Vendor Name").
    2. "value": The extracted value from the document as a string. If a field is not found, use an empty string "".
    3. "confidence": A number between 0.0 and 1.0 indicating your confidence in the accuracy of the extraction for this field.

    Example response for an invoice:
    {
      "fields": [
        { "key": "Vendor Name", "value": "Global Tech Inc.", "confidence": 0.98 },
        { "key": "Invoice Number", "value": "GTI-5582", "confidence": 0.99 },
        { "key": "Invoice Date", "value": "2023-10-26", "confidence": 0.95 },
        { "key": "Total Amount", "value": "4500.00", "confidence": 0.97 }
      ]
    }
    
    Now, analyze the provided document and generate the JSON. Do not wrap the JSON in markdown fences.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: VISION_MODEL,
            contents: { parts: [ {text: prompt}, imagePart ] },
            config: {
                responseMimeType: 'application/json',
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedResult = JSON.parse(jsonStr) as { fields: Omit<ExtractedField, 'originalValue'>[] };

        if (parsedResult && Array.isArray(parsedResult.fields)) {
            const finalResult: ExtractionResult = {
                fields: parsedResult.fields.map(f => ({ ...f, originalValue: f.value }))
            };
            return finalResult;
        } else {
            console.error("Invalid data extraction structure received from AI:", parsedResult);
            throw new Error("The AI returned data in an unexpected format.");
        }

    } catch (error) {
        console.error("Error extracting data with Gemini:", error);
        throw new Error("Failed to extract data from the document. Please try a different file or try again later.");
    }
};

export const optimizeResumeAndGenerateCoverLetter = async (
    resumeText: string,
    jobDescription: string
): Promise<ResumeOptimizationResult> => { 
    if (!isApiKeyValid) {
        console.warn("Gemini API Key not valid. Resume optimization is mocked.");
        return simulateDelay({
            optimizedResume: `## Mock Optimized Resume for Job\n\n**Summary**\n- Based on your resume and the job description, this is a mock optimized summary. It highlights keywords like "synergy" and "proactive".\n\n**Experience**\n- **Lead Synergizer**, Mock Corp (2020-Present)\n  - Quantified achievements based on job description keywords.\n  - Enhanced bullet points for maximum impact.`,
            coverLetter: `Dear Hiring Manager,\n\nThis is a mock cover letter generated based on the resume and job description provided. It expresses strong interest in the role and highlights how the candidate's skills align with the company's needs.\n\nIt mentions specific keywords from the job description to show attentiveness.\n\nSincerely,\n[Your Name]`,
            suggestions: [
                { area: "Skills", suggestion: "Added 'Agile Methodologies' to match a key requirement in the job description." },
                { area: "Experience", suggestion: "Rephrased a bullet point to use the action verb 'Orchestrated' which was found in the job description." },
                { area: "Formatting", suggestion: "Ensured resume format is clean and easily parseable by Applicant Tracking Systems (ATS)." }
            ]
        }, 2500);
    }

    const prompt = `You are an expert career coach and professional resume writer.
    Your task is to analyze the provided resume and job description.
    You must optimize the resume to be a perfect fit for the job, making it ATS-friendly.
    You must also write a compelling and professional cover letter based on both documents.
    Finally, provide a list of suggestions explaining the key changes you made.

    The output MUST be a single, valid JSON object with the following structure:
    {
      "optimizedResume": "The full text of the rewritten and optimized resume. Use markdown for formatting.",
      "coverLetter": "The full text of the generated cover letter.",
      "suggestions": [
        {
          "area": "e.g., Skills, Experience, Formatting",
          "suggestion": "A concise explanation of a specific change made and why."
        }
      ]
    }

    Here is the user's current resume:
    --- RESUME START ---
    ${resumeText}
    --- RESUME END ---

    Here is the target job description:
    --- JOB DESCRIPTION START ---
    ${jobDescription}
    --- JOB DESCRIPTION END ---

    Now, generate the JSON object. Do not wrap it in markdown fences.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedResult = JSON.parse(jsonStr) as ResumeOptimizationResult;

        if (parsedResult && parsedResult.optimizedResume && parsedResult.coverLetter && Array.isArray(parsedResult.suggestions)) {
            return parsedResult;
        } else {
            console.error("Invalid resume optimization result structure received from AI:", parsedResult);
            throw new Error("The AI returned data in an unexpected format.");
        }
    } catch (error) {
        console.error("Error optimizing resume with Gemini:", error);
        throw new Error("Failed to generate resume and cover letter from the AI. Please try again later.");
    }
};

// --- AI Web-App Builder Service Functions ---

export const generateLogoPromptForGemini = async (appName: string, tagline: string): Promise<string> => {
    if (!isApiKeyValid) {
        console.warn("Gemini API Key not valid. Logo prompt generation is mocked.");
        return simulateDelay(`A minimalist, abstract icon representing '${appName}', using clean lines and a modern feel.`, 1000);
    }

    const prompt = `You are a creative branding expert. A user is creating a web-app with the name "${appName}" and the tagline "${tagline}".
    Your task is to generate a short, creative, and descriptive prompt for an AI image generator (like Imagen or DALL-E) to create a logo.
    The prompt should describe a visual concept for the logo. Focus on concepts, styles, and elements. Do not ask the user questions.
    
    Example output for appName="Aura" and tagline="Find your calm": "A serene, abstract logo of a gentle wave and a sun combined, in a minimalist, single-line art style, with pastel colors."

    Provide only the prompt text itself, without any extra explanation or formatting.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating logo prompt with Gemini:", error);
        throw new Error("Failed to generate a logo prompt from the AI.");
    }
};