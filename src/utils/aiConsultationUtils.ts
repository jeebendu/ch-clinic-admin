import { getEnvVariable } from "./envUtils";

export type ConsultationAIPrompt = {
  symptoms: string[];
  patientInfo?: {
    age?: number;
    gender?: string;
    medicalHistory?: string;
    allergies?: string[];
  };
  chiefComplaint?: string;
};

/**
 * Generates consultation recommendations using Mistral 7B Instruct model
 * @param prompt Object containing symptoms and patient context
 * @returns AI-generated recommendations including diagnosis possibilities and treatment plan
 */
export const generateConsultationRecommendations = async (prompt: ConsultationAIPrompt) => {
  try {
    console.log("Generating consultation recommendations...");
    console.log("Prompt received:", prompt);

    // Format symptoms as a comma-separated list
    const symptomsList = prompt.symptoms.join(", ");
    console.log("Formatted symptoms list:", symptomsList);

    // Build the patient context string
    let patientContext = "";
    if (prompt.patientInfo) {
      const { age, gender, medicalHistory, allergies } = prompt.patientInfo;
      patientContext = `\nPatient Information:${age ? ` ${age} years old` : ""}${gender ? ` ${gender}` : ""}`;
      if (medicalHistory) patientContext += `\nMedical History: ${medicalHistory}`;
      if (allergies && allergies.length > 0) patientContext += `\nAllergies: ${allergies.join(", ")}`;
    }
    console.log("Patient context:", patientContext);

    const chiefComplaintText = prompt.chiefComplaint
      ? `\nChief Complaint: ${prompt.chiefComplaint}`
      : "";

    // Construct the prompt for the AI model
    const userPrompt = `Generate a structured medical consultation note for a patient with the following symptoms: ${symptomsList}.${chiefComplaintText}${patientContext}
    
    Please provide:
    1. Potential differential diagnoses (list top 3 possibilities with brief explanations)
    2. Recommended lab tests and their rationale
    3. Suggested medications with dosing
    4. Follow-up recommendations
    
    Format the response in a clear, professional structure suitable for a medical consultation note.`;

    console.log("Constructed user prompt:", userPrompt);

    const apiKey = getEnvVariable("TOGETHER_API_KEY");
    if (!apiKey) {
      console.error("TOGETHER_API_KEY environment variable is not set");
      throw new Error("TOGETHER_API_KEY environment variable is not set");
    }

    console.log("Sending request to AI API...");
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content:
              "You are a medical consultation assistant providing evidence-based recommendations to healthcare professionals. Only provide factual medical information.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      console.error("API response error:", response.status, response.statusText);
      const errorData = await response.json();
      console.error("Error details from API:", errorData);
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("API response received:", data);

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating consultation recommendations:", error);
    throw error;
  }
};

/**
 * Parses the AI-generated recommendations into structured sections
 * @param aiResponse Raw text response from the AI model
 * @returns Object with parsed sections
 */
export const parseAIRecommendations = (aiResponse: string) => {
  console.log("Parsing AI recommendations...");
  console.log("Raw AI response:", aiResponse);

  const sections = {
    differentialDiagnosis: "",
    recommendedTests: "",
    suggestedMedications: "",
    followUp: "",
    fullText: aiResponse,
  };

  const lines = aiResponse.split("\n");
  let currentSection = "";

  lines.forEach((line) => {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("diagnos")) {
      currentSection = "differentialDiagnosis";
      sections.differentialDiagnosis += line + "\n";
    } else if (lowerLine.includes("lab test") || lowerLine.includes("investigation")) {
      currentSection = "recommendedTests";
      sections.recommendedTests += line + "\n";
    } else if (lowerLine.includes("medic") || lowerLine.includes("treatment") || lowerLine.includes("prescription")) {
      currentSection = "suggestedMedications";
      sections.suggestedMedications += line + "\n";
    } else if (lowerLine.includes("follow") || lowerLine.includes("next visit")) {
      currentSection = "followUp";
      sections.followUp += line + "\n";
    } else if (currentSection) {
      sections[currentSection] += line + "\n";
    }
  });

  console.log("Parsed sections:", sections);
  return sections;
};