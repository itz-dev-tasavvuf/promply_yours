import { AiModel, Project, Recommendation, ProofreadingResult, ExtractionResult, PredefinedModelType, ExtractedField, ResumeOptimizationResult } from '../types'; 
import { INSPIRED_PROJECTS_DATA, BEST_AI_MODELS_DATA, USER_INTERESTS_SERVICES } from '../constants';

// Check if we have a valid API key
const API_KEY = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const isApiKeyValid = Boolean(API_KEY && API_KEY.trim() !== '' && API_KEY !== 'your_gemini_api_key_here');

// Initialize Gemini AI Client only if API key is valid
let ai: any = null;
let GoogleGenAI: any = null;

if (isApiKeyValid) {
  try {
    // Dynamic import to avoid errors when @google/genai is not available
    import('@google/genai').then(({ GoogleGenAI: GenAI }) => {
      GoogleGenAI = GenAI;
      ai = new GenAI(API_KEY);
      console.log("Gemini AI initialized successfully.");
    }).catch((error) => {
      console.warn("Could not load @google/genai package:", error);
      console.warn("Gemini features will use mock data.");
    });
  } catch (error) {
    console.warn("Error initializing Gemini AI:", error);
    console.warn("Gemini features will use mock data.");
  }
} else {
  console.info("Gemini API Key not provided. Using mock data for AI features.");
  console.info("To enable real AI features, set GEMINI_API_KEY in your .env file.");
}

const TEXT_MODEL = 'gemini-1.5-flash';
const VISION_MODEL = 'gemini-1.5-flash';

// Simulate API latency for mock responses
const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// Mock data generators
const generateMockContentPlan = (topic: string) => [
  { title: 'Introduction', description: `Write an engaging introduction about ${topic} that hooks the reader and outlines what they'll learn.` },
  { title: 'Main Benefits', description: `Detail the key advantages and benefits of ${topic} with specific examples.` },
  { title: 'Implementation Guide', description: `Provide practical steps or methods for implementing or using ${topic}.` },
  { title: 'Conclusion', description: `Summarize the key points and provide a compelling call to action about ${topic}.` }
];

const generateMockText = (prompt: string) => {
  const topics = prompt.toLowerCase();
  if (topics.includes('introduction')) {
    return `This is a comprehensive introduction to the topic you've requested. The subject matter is both fascinating and practical, offering numerous benefits to those who understand and apply its principles.\n\nIn this section, we'll explore the foundational concepts that make this topic so valuable and relevant in today's world.`;
  } else if (topics.includes('benefit') || topics.includes('advantage')) {
    return `The primary benefits of this approach are numerous and well-documented. First, it provides immediate practical value that can be applied in real-world scenarios. Second, it offers long-term strategic advantages that compound over time.\n\nAdditionally, this method has been proven to increase efficiency while reducing complexity, making it an ideal solution for both beginners and experts.`;
  } else if (topics.includes('conclusion')) {
    return `In conclusion, the evidence clearly demonstrates the value and effectiveness of this approach. By implementing these strategies, you can expect to see significant improvements in your results.\n\nWe encourage you to take action on these insights and begin applying them in your own context. The potential for positive impact is substantial when these principles are properly executed.`;
  }
  return `This is a detailed response generated for your request about "${prompt.substring(0, 50)}...". The content is structured to provide valuable insights and practical information that addresses your specific needs.\n\nKey points include comprehensive analysis, actionable recommendations, and evidence-based conclusions that you can confidently apply.`;
};

export const getAiRecommendations = async (userInterests: string[], userId?: string): Promise<Recommendation[]> => {
  console.log(`Fetching AI recommendations for interests: ${userInterests.join(', ')}. UserID: ${userId || 'N/A'}`);
  const filteredServices = USER_INTERESTS_SERVICES.filter(s => userInterests.some(interest => s.category.includes(interest)));
  return simulateDelay(filteredServices.length > 0 ? filteredServices.slice(0,3) : USER_INTERESTS_SERVICES.slice(0,3), 300);
};

export const getInspiredProjects = async (userId?: string): Promise<Project[]> => {
  console.log(`Fetching inspired projects. UserID: ${userId || 'N/A'}`);
  return simulateDelay(INSPIRED_PROJECTS_DATA, 600);
};

export const getBestAiModels = async (userId?: string): Promise<AiModel[]> => {
  console.log(`Fetching best AI models. UserID: ${userId || 'N/A'}`);
  return simulateDelay(BEST_AI_MODELS_DATA, 400);
};

export const generateStructuredContentPlan = async (userPrompt: string): Promise<{title: string, description: string}[]> => {
  if (!isApiKeyValid || !ai) {
    console.info("Using mock content plan generation.");
    return simulateDelay(generateMockContentPlan(userPrompt), 1000);
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
    const model = ai.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedPlan = JSON.parse(text);
    if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
      return parsedPlan;
    } else {
      throw new Error("Invalid plan structure");
    }
  } catch (error) {
    console.error("Error generating content plan with Gemini:", error);
    console.info("Falling back to mock content plan.");
    return generateMockContentPlan(userPrompt);
  }
};

export const generateTextWithGemini = async (prompt: string, userId?: string): Promise<string> => {
  console.log(`Generating text for prompt: "${prompt.substring(0,50)}...". UserID: ${userId || 'N/A'}`);
  
  if (!isApiKeyValid || !ai) {
    console.info("Using mock text generation.");
    return simulateDelay(generateMockText(prompt), 800);
  }

  try {
    const model = ai.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    console.info("Falling back to mock text generation.");
    return generateMockText(prompt);
  }
};

export const proofreadTextWithGemini = async (text: string): Promise<ProofreadingResult> => {
  if (!isApiKeyValid || !ai) {
    console.info("Using mock proofreading.");
    const mockCorrectedText = text.replace(/teh/g, 'the').replace(/wierd/g, 'weird').replace(/seperate/g, 'separate');
    const changes = [];
    if (text.includes('teh')) changes.push({ original: "teh", corrected: "the", type: "Spelling" as const, explanation: "Common typographical error." });
    if (text.includes('wierd')) changes.push({ original: "wierd", corrected: "weird", type: "Spelling" as const, explanation: "Correct spelling follows 'i before e' rule." });
    if (text.includes('seperate')) changes.push({ original: "seperate", corrected: "separate", type: "Spelling" as const, explanation: "Remember: there's 'a rat' in separate." });
    
    return simulateDelay({
      summary: changes.length > 0 ? `Corrected ${changes.length} spelling error${changes.length > 1 ? 's' : ''}.` : "No errors found.",
      suggestions: changes,
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
    const model = ai.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up the response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedResult = JSON.parse(responseText) as ProofreadingResult;
    return parsedResult;
  } catch (error) {
    console.error("Error proofreading text with Gemini:", error);
    console.info("Falling back to mock proofreading.");
    // Fallback to mock implementation
    return proofreadTextWithGemini(text);
  }
};

export const extractDataFromDocument = async (file: File, modelType: PredefinedModelType): Promise<ExtractionResult> => {
  if (!isApiKeyValid || !ai) {
    console.info("Using mock data extraction.");
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
    };
    return simulateDelay({ fields: mockData[modelType] }, 2000);
  }

  // If we have a valid API key, attempt real extraction
  try {
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

    const imagePart = await fileToGenerativePart(file);
    
    const fieldsToExtract = {
      invoice: `Vendor Name, Invoice Number, Invoice Date (in YYYY-MM-DD format), Due Date (in YYYY-MM-DD format), Total Amount (as a number), and a list of line items with description, quantity, and unit price.`,
      receipt: `Merchant Name, Merchant Address, Transaction Date (in YYYY-MM-DD format), Transaction Time, Total Amount (as a number), and Tax Amount (as a number).`
    };

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

    const model = ai.getGenerativeModel({ model: VISION_MODEL });
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up the response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedResult = JSON.parse(responseText) as { fields: Omit<ExtractedField, 'originalValue'>[] };
    
    if (parsedResult && Array.isArray(parsedResult.fields)) {
      const finalResult: ExtractionResult = {
        fields: parsedResult.fields.map(f => ({ ...f, originalValue: f.value }))
      };
      return finalResult;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error extracting data with Gemini:", error);
    console.info("Falling back to mock data extraction.");
    // Fallback to mock implementation
    return extractDataFromDocument(file, modelType);
  }
};

export const optimizeResumeAndGenerateCoverLetter = async (
    resumeText: string,
    jobDescription: string
): Promise<ResumeOptimizationResult> => {
  if (!isApiKeyValid || !ai) {
    console.info("Using mock resume optimization.");
    return simulateDelay({
      optimizedResume: `# Optimized Resume\n\n## Professional Summary\nDynamic professional with extensive experience aligned with the target role. Proven track record of delivering results and driving innovation.\n\n## Core Competencies\n- Strategic planning and execution\n- Team leadership and development\n- Process optimization\n- Data-driven decision making\n\n## Professional Experience\n\n### Senior Professional (2020-Present)\n**Company Name**\n- Led cross-functional teams to achieve strategic objectives\n- Implemented process improvements resulting in 25% efficiency gains\n- Managed budgets exceeding $1M with consistent cost savings\n\n### Professional (2018-2020)\n**Previous Company**\n- Developed and executed strategic initiatives\n- Collaborated with stakeholders to drive project success\n- Maintained high performance standards\n\n## Education\n**Degree** - University Name\n\n## Additional Skills\n- Industry-specific software proficiency\n- Advanced analytical capabilities\n- Strong communication and presentation skills`,
      
      coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position at your organization. After reviewing the job description, I am confident that my background and experience make me an ideal candidate for this role.\n\nMy professional experience has equipped me with the exact skills you are seeking. I have demonstrated success in areas directly relevant to your requirements and am excited about the opportunity to bring this expertise to your team.\n\nKey highlights of my qualifications include:\n- Proven track record in relevant industry experience\n- Strong leadership and collaboration abilities\n- Results-driven approach with measurable achievements\n- Alignment with your company's values and mission\n\nI am particularly drawn to this opportunity because it aligns perfectly with my career goals and allows me to contribute to meaningful work. I would welcome the chance to discuss how my experience and enthusiasm can benefit your organization.\n\nThank you for your consideration. I look forward to hearing from you.\n\nSincerely,\n[Your Name]`,
      
      suggestions: [
        { area: "Skills", suggestion: "Added industry-relevant keywords from the job description to improve ATS compatibility." },
        { area: "Experience", suggestion: "Quantified achievements with specific metrics to demonstrate impact." },
        { area: "Formatting", suggestion: "Optimized structure for both human readability and ATS parsing." },
        { area: "Keywords", suggestion: "Incorporated key terms from the job posting throughout the resume." }
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
    const model = ai.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up the response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedResult = JSON.parse(responseText) as ResumeOptimizationResult;
    return parsedResult;
  } catch (error) {
    console.error("Error optimizing resume with Gemini:", error);
    console.info("Falling back to mock resume optimization.");
    // Fallback to mock implementation
    return optimizeResumeAndGenerateCoverLetter(resumeText, jobDescription);
  }
};

export const generateLogoPromptForGemini = async (appName: string, tagline: string): Promise<string> => {
  if (!isApiKeyValid || !ai) {
    console.info("Using mock logo prompt generation.");
    return simulateDelay(`A minimalist, modern logo for "${appName}" featuring clean geometric shapes and vibrant colors that convey innovation and reliability.`, 1000);
  }

  const prompt = `You are a creative branding expert. A user is creating a web-app with the name "${appName}" and the tagline "${tagline}".
    Your task is to generate a short, creative, and descriptive prompt for an AI image generator (like Imagen or DALL-E) to create a logo.
    The prompt should describe a visual concept for the logo. Focus on concepts, styles, and elements. Do not ask the user questions.
    
    Example output for appName="Aura" and tagline="Find your calm": "A serene, abstract logo of a gentle wave and a sun combined, in a minimalist, single-line art style, with pastel colors."

    Provide only the prompt text itself, without any extra explanation or formatting.`;

  try {
    const model = ai.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating logo prompt with Gemini:", error);
    return `A creative, modern logo for "${appName}" that captures the essence of "${tagline}" with clean, professional design elements.`;
  }
};