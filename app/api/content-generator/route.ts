import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract data from the request body
    const { 
      jobDescription, 
      companyName, 
      positionTitle, 
      tone, 
      length, 
      additionalInstructions,
      profileData 
    } = body;

    // Get the user message from the request
    const userMessage = body.messages?.[body.messages.length - 1]?.content || 
                       `Generate a cover letter for the ${positionTitle} position at ${companyName}.`;

    // Generate the AI prompt based on user profile and job details
    const systemPrompt = getContentGenerationPrompt(
      profileData, 
      jobDescription, 
      companyName, 
      positionTitle, 
      tone, 
      length,
      additionalInstructions
    );

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      maxTokens: getMaxTokensForLength(length),
      temperature: getToneTemperature(tone),
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error('Content generation API error:', error);
    return new Response('Error generating content', { status: 500 });
  }
}

function getContentGenerationPrompt(
  profileData: any,
  jobDescription: string,
  companyName: string,
  positionTitle: string,
  tone: string = 'professional',
  length: string = 'brief',
  additionalInstructions?: string
): string {
  return `Create a compelling cover letter using the candidate's profile and job description.

CANDIDATE DATA:
${JSON.stringify(profileData, null, 2)}

JOB OPPORTUNITY:
Company: ${companyName}
Position: ${positionTitle}  
Job Description: ${jobDescription}

EXACT FORMAT TO FOLLOW:

SUBJECT: Application for ${positionTitle} Position at ${companyName}

Hi ${companyName} Team, 👋

[PARAGRAPH 1: Job Pain Point + Solution - 1-2 sentences max]
- Identify the specific challenge/need from the job description
- Position yourself as the solution
- Be direct and compelling

[CORE SKILLS SECTION: 3-4 bullet points with emojis]
⚡ [Most relevant skill with specific achievement/metric]
🚀 [Second most relevant skill with achievement]  
💡 [Third relevant skill with achievement]
🎯 [Fourth skill if needed]

[RELEVANT PROJECTS SECTION:]
Attaching Some Previous Projects:
✅ [project-domain1.com]
✅ [project-domain2.com] 
✅ [project-domain3.com]

[PARAGRAPH 2: About You - 1 sentence max]
Brief compelling statement about your background and fit.

Best regards,
[Candidate Name]

P.S. [Compelling hook related to the specific role/company]

${additionalInstructions ? `🚨 PRIORITY INSTRUCTIONS (MUST FOLLOW): ${additionalInstructions}

` : ''}CRITICAL RULES:
- Keep paragraphs SHORT (1-2 sentences max)
- Use relevant emojis for visual appeal
- Extract actual project URLs from candidate data if available
- Match skills to job requirements specifically
- Make it ${tone} tone with ${length} length (${length === 'brief' ? '150-200 words' : length === 'standard' ? '200-300 words' : '300-400 words'})
- Focus on value and results
- MUST COMPLETE the entire cover letter including P.S. statement
- DO NOT stop mid-sentence or mid-section

Generate the COMPLETE cover letter following this EXACT structure and PRIORITIZE the special instructions above. Ensure you include ALL sections from SUBJECT to P.S.`;
}


function getToneDescription(tone: string): string {
  switch (tone) {
    case 'professional': return 'formal, respectful, and business-appropriate';
    case 'enthusiastic': return 'energetic, passionate, and engaging while remaining professional';
    case 'conversational': return 'approachable, friendly, and personable while maintaining professionalism';
    default: return 'professional and appropriate';
  }
}

function getLengthDescription(length: string): string {
  switch (length) {
    case 'brief': return '150-200 words maximum, very concise and impactful';
    case 'standard': return '250-350 words, balanced and focused';
    case 'detailed': return '400-500 words maximum, comprehensive but not verbose';
    default: return '250-350 words, well-balanced';
  }
}

function getStructureRequirements(contentType: string): string {
  if (contentType === 'cover_letter') {
    return `
1. Professional header with contact information
2. Date and employer information
3. Professional salutation
4. Opening paragraph - position and interest
5. Body paragraphs - qualifications and fit
6. Closing paragraph - next steps and appreciation
7. Professional sign-off`;
  } else {
    return `
1. Professional greeting
2. Project understanding and approach
3. Relevant qualifications and experience
4. Value proposition and deliverables
5. Timeline and availability
6. Professional closing with next steps`;
  }
}

function getMaxTokensForLength(length: string): number {
  switch (length) {
    case 'brief': return 300;
    case 'standard': return 450;
    case 'detailed': return 600;
    default: return 350;
  }
}

function getToneTemperature(tone: string): number {
  switch (tone) {
    case 'professional': return 0.3;
    case 'enthusiastic': return 0.7;
    case 'conversational': return 0.6;
    default: return 0.5;
  }
}