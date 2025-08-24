import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { profileData } = await req.json();

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Create the AI prompt for resume data processing
    const systemPrompt = getResumeProcessingPrompt(profileData);

    const result = await streamText({
      model: openai('gpt-3.5-turbo', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'Please process my profile data and generate structured resume content according to the specified format and limits.'
        }
      ],
      maxTokens: 4000,
      temperature: 0.3,
    });

    // Collect the full response
    let fullResponse = '';
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    // Parse the JSON response
    try {
      const processedData = JSON.parse(fullResponse);
      return NextResponse.json(processedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to process resume data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Resume processor API error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume data' },
      { status: 500 }
    );
  }
}

function getResumeProcessingPrompt(profileData: any): string {
  return `You are an expert resume data processor. Your task is to analyze the user's profile data and generate structured, professional resume content with specific character limits and formatting requirements.

PROFILE DATA:
${JSON.stringify(profileData, null, 2)}

REQUIREMENTS:
1. Generate a JSON response with the following structure:
{
  "professional_summary": "string (max 200 characters)",
  "key_skills": [
    {
      "name": "string",
      "level": "Expert|Advanced|Intermediate|Beginner",
      "experience_years": "number"
    }
  ],
  "experience": [
    {
      "position": "string",
      "company": "string", 
      "duration": "string",
      "description": "string (max 100 characters)",
      "key_achievements": ["string (max 80 chars each)"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string (max 80 characters)",
      "technologies": ["string"],
      "url": "string (optional)"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "duration": "string",
      "description": "string (max 100 characters)"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "string"
    }
  ],
  "awards": [
    {
      "title": "string",
      "issuer": "string",
      "date": "string",
      "description": "string (max 100 characters)"
    }
  ]
}

RULES:
1. Professional Summary: Create a compelling 2-3 sentence summary highlighting key strengths and experience
2. Key Skills: Select top 8-12 most relevant skills, prioritize by level (Expert > Advanced > Intermediate > Beginner)
3. Experience: Include ALL professional experiences from the profile data
4. Projects: Include 8 most impressive projects with clear technology stacks
5. Education: Include all education entries but keep descriptions concise
6. Languages: Include all languages with proficiency levels
7. Awards: Include ALL awards from the profile data - DO NOT FILTER AWARDS
8. All descriptions must be within character limits. Experience and project descriptions must be exactly 2 lines maximum (around 80-100 characters). Do not exceed this limit.
9. Maintain professional tone and focus on achievements
10. If data is missing for any section, omit that section from the response

RESPONSE FORMAT:
Return ONLY valid JSON without any additional text or formatting.`;
}
