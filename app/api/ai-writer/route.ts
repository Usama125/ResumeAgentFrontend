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

    // Track AI content generation request
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'ai_content_generation',
          user_id: profileData?.id || null,
          username: profileData?.username || null,
          details: {
            type: 'cover_letter',
            company: companyName,
            position: positionTitle,
            tone: tone,
            length: length,
            has_job_description: !!jobDescription,
            has_additional_instructions: !!additionalInstructions
          },
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        })
      });
    } catch (trackingError) {
      console.error('Analytics tracking failed:', trackingError);
    }

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
  return `Create a compelling, ready-to-use cover letter using the candidate's profile and job description.

CANDIDATE DATA:
${JSON.stringify(profileData, null, 2)}

JOB OPPORTUNITY:
Company: ${companyName}
Position: ${positionTitle}  
Job Description: ${jobDescription}

${additionalInstructions ? `🚨 PRIORITY INSTRUCTIONS (MUST FOLLOW): ${additionalInstructions}

` : ''}Generate a complete cover letter with this structure:

1. SUBJECT LINE: Application for ${positionTitle} Position at ${companyName}

2. OPENING: Start with "Hi ${companyName} Team, 👋"

3. PAIN POINT PARAGRAPH: 1-2 sentences identifying a specific challenge from the job description and positioning yourself as the solution.

4. CORE SKILLS: 3-4 bullet points with emojis showing your most relevant skills with specific achievements/metrics that match the job requirements.

5. PROJECTS SECTION: Include "Attaching Some Previous Projects:" followed by 2-3 actual project URLs from the candidate data with checkmarks.

6. CLOSING PARAGRAPH: 1 sentence about your background and fit for the role.

7. SIGNATURE: "Best regards, [Candidate Name]"

8. P.S.: Add a compelling hook related to the specific role/company.

CRITICAL REQUIREMENTS:
- DO NOT include any bracketed instructions, headings, or template notes in the output
- Generate clean, ready-to-copy content that can be used immediately
- Keep paragraphs SHORT (1-2 sentences max)
- Use relevant emojis for visual appeal
- Extract actual project URLs from candidate data if available
- Make it ${tone} tone with ${length} length (${length === 'brief' ? '200-250 words' : length === 'standard' ? '300-350 words' : '400-450 words'})
- Focus on value and results
- MUST COMPLETE the entire cover letter including P.S. statement
- DO NOT stop mid-sentence or mid-section

Generate the COMPLETE cover letter now:`;
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
    case 'brief': return 400;
    case 'standard': return 550;
    case 'detailed': return 700;
    default: return 450;
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