/**
 * @file app/constants/prompts.ts
 * @description Mock data and AI orchestration logic for the ApexResume Neural Engine.
 */

/**
 * MOCK DATA: Seed resumes for testing the UI and Dashboard.
 * These simulate a user's upload history before the backend is fully integrated.
 * Used for verifying visual state transitions (e.g., success vs. warning themes).
 */
export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png", // Visual preview of the first page
        resumePath: "/resumes/resume-1.pdf", // Stored location in Puter FS
        feedback: {
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    // ... items 2-6 follow a similar structure with varied scores for UI testing
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55, // Low score used to test "warning" or "improvement" UI states
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    // (Remaining items truncated for brevity, but same logic applies)
];

/**
 * AI RESPONSE SCHEMA: Injected into the prompt to enforce structured output.
 * This TypeScript interface serves as a 'Ground Truth' for the AI model,
 * ensuring the returned JSON can be parsed consistently.
 */
export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; // Final aggregated score (0-100)
      ATS: {
        score: number; // Evaluation of machine-readability and keyword density
        tips: {
          type: "good" | "improve";
          tip: string; // 3-4 actionable items
        }[];
      };
      toneAndStyle: {
        score: number; // Evaluation of professionalism and brand voice
        tips: {
          type: "good" | "improve";
          tip: string; // Brief headline for the tip
          explanation: string; // Detailed reasoning and context
        }[];
      };
      content: {
        score: number; // Accuracy, impact, and quantitative achievements
        tips: {
          type: "good" | "improve";
          tip: string;
          explanation: string;
        }[];
      };
      structure: {
        score: number; // Layout, white space, and logical flow
        tips: {
          type: "good" | "improve";
          tip: string;
          explanation: string;
        }[];
      };
      skills: {
        score: number; // Relevance of skills to the target job title
        tips: {
          type: "good" | "improve";
          tip: string;
          explanation: string;
        }[];
      };
    }`;

/**
 * PROMPT FACTORY: Generates the system instructions for the Puter AI.
 * Employs 'Role Prompting' and 'Output Constraint Enforcement' for high-fidelity JSON.
 * * @param jobTitle - The role the user is targeting.
 * @param jobDescription - Detailed requirements to match against.
 */
export const prepareInstructions = ({ jobTitle, jobDescription }: { jobTitle: string; jobDescription: string; }) =>
    `You are a ruthless Executive Recruiter and elite ATS Auditor. 
      
      MISSION:
      Conduct a high-stakes, hyper-critical audit of this resume. Your goal is to find every single weakness, inconsistency, and fluff-filled sentence. Do not be "nice." Do not give the benefit of the doubt. If the resume does not perfectly align with the target, punish the score heavily.
      
      CONTEXT:
      - Target Role: ${jobTitle}
      - Target Requirements: ${jobDescription || "Top-tier Industry Excellence"}

      CRITICAL RULES:
      1. CRITICAL ELIMINATION: Be brutally honest. If a section is mediocre, give it a failing score. A "passable" resume should only get a 50. High scores (90+) are reserved for world-class perfection.
      2. PUNISH VAGUENESS: If the user uses "buzzwords" without quantitative data (numbers/metrics), penalize the Content and ATS scores immediately.
      3. EXACT OUTPUT: Provide exactly 3-4 harsh, actionable tips per category.
      4. ZERO CHATTER: Return ONLY a valid JSON object. No backticks, no intro, no "good luck."

      SCHEMA:
      ${AIResponseFormat}`;