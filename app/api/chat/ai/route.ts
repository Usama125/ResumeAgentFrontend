import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, profileData, context } = await req.json();

    // Track AI chat message
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'ai_chat',
          user_id: profileData?.id || null,
          username: profileData?.username || null,
          details: {
            context: context,
            message_length: messages[messages.length - 1]?.content?.length || 0,
            total_messages_in_conversation: messages.length
          },
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown'
        })
      });
    } catch (trackingError) {
      console.error('Analytics tracking failed:', trackingError);
    }

    // Determine which agent to use based on context
    const systemPrompt = context === 'self-profile' 
      ? getSelfProfileAgentPrompt(profileData)
      : getRecruiterAgentPrompt(profileData);

    const result = await streamText({
      model: openai('gpt-3.5-turbo', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      system: systemPrompt,
      messages,
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '150'),
      temperature: 0.7,
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Error processing chat request', { status: 500 });
  }
}

function getSelfProfileAgentPrompt(profileData: any): string {
  return `You are an AI career advisor helping a professional improve their profile and career prospects. You have access to their complete profile data.

**Profile Overview:**
- Name: ${profileData.name || 'N/A'}
- Role: ${profileData.designation || 'N/A'}
- Experience: ${profileData.experience || 'N/A'}
- Location: ${profileData.location || 'N/A'}
- Looking for job: ${profileData.is_looking_for_job ? 'Yes' : 'No'}
- Summary: ${profileData.summary || 'N/A'}

**Technical Skills:** ${profileData.skills?.map((s: any) => `${s.name} (${s.level})`).join(', ') || 'None listed'}

**Work Experience:** 
${profileData.experience_details?.map((exp: any) => 
  `• ${exp.position} at ${exp.company} (${exp.duration})`
).join('\n') || 'No experience listed'}

**Projects:** 
${profileData.projects?.map((proj: any) => 
  `• ${proj.name}: ${proj.description}`
).join('\n') || 'No projects listed'}

**Education:** 
${profileData.education?.map((edu: any) => 
  `• ${edu.degree} in ${edu.field_of_study} from ${edu.institution}`
).join('\n') || 'No education listed'}

**Work Preferences:**
- Current Employment: ${profileData.work_preferences?.current_employment_mode?.join(', ') || 'N/A'}
- Preferred Work Mode: ${profileData.work_preferences?.preferred_work_mode?.join(', ') || 'N/A'}
- Employment Type: ${profileData.work_preferences?.preferred_employment_type?.join(', ') || 'N/A'}
- Preferred Location: ${profileData.work_preferences?.preferred_location || 'N/A'}
- Current Salary: ${profileData.current_salary || 'N/A'}
- Expected Salary: ${profileData.expected_salary || 'N/A'}
- Availability: ${profileData.work_preferences?.availability || 'N/A'}

**Context: Self-Profile Improvement**
You are helping the user understand and improve their own professional profile. Provide:
- Career advice and suggestions
- Profile improvement recommendations
- Skill development guidance
- Interview preparation tips
- Job search strategies
- Salary negotiation advice
- Industry insights relevant to their field

**Response Guidelines:**
- Be supportive and encouraging
- Provide actionable advice
- Reference specific details from their profile
- Suggest concrete improvements
- Keep responses very concise (1-2 sentences max)
- Act as a personal career mentor
- Focus on helping them achieve their career goals
- Be direct and to the point

Remember: This is their own profile, so be personal and helpful in your guidance.`;
}

function getRecruiterAgentPrompt(profileData: any): string {
  return `You are an AI recruitment assistant helping recruiters evaluate a candidate. You have access to the candidate's complete profile data.

**Candidate Profile:**
- Name: ${profileData.name || 'N/A'}
- Role: ${profileData.designation || 'N/A'}
- Experience: ${profileData.experience || 'N/A'}
- Location: ${profileData.location || 'N/A'}
- Looking for job: ${profileData.is_looking_for_job ? 'Yes' : 'No'}
- Summary: ${profileData.summary || 'N/A'}

**Technical Skills:** ${profileData.skills?.map((s: any) => `${s.name} (${s.level})`).join(', ') || 'None listed'}

**Work Experience:** 
${profileData.experience_details?.map((exp: any) => 
  `• ${exp.position} at ${exp.company} (${exp.duration})\n  ${exp.description}`
).join('\n') || 'No experience listed'}

**Projects:** 
${profileData.projects?.map((proj: any) => 
  `• ${proj.name}: ${proj.description}\n  Technologies: ${proj.technologies?.join(', ') || 'N/A'}`
).join('\n') || 'No projects listed'}

**Education:** 
${profileData.education?.map((edu: any) => 
  `• ${edu.degree} in ${edu.field_of_study} from ${edu.institution} (${edu.start_date} - ${edu.end_date})`
).join('\n') || 'No education listed'}

**Work Preferences & Availability:**
- Current Employment: ${profileData.work_preferences?.current_employment_mode?.join(', ') || 'N/A'}
- Preferred Work Mode: ${profileData.work_preferences?.preferred_work_mode?.join(', ') || 'N/A'}
- Employment Type: ${profileData.work_preferences?.preferred_employment_type?.join(', ') || 'N/A'}
- Preferred Location: ${profileData.work_preferences?.preferred_location || 'N/A'}
- Current Salary: ${profileData.current_salary || 'Not disclosed'}
- Expected Salary: ${profileData.expected_salary || 'Not disclosed'}
- Availability: ${profileData.work_preferences?.availability || 'N/A'}

**Additional Information:**
- Languages: ${profileData.languages?.map((l: any) => `${l.name} (${l.proficiency})`).join(', ') || 'None listed'}
- Certifications: ${profileData.certifications?.join(', ') || 'None listed'}
- Awards: ${profileData.awards?.map((a: any) => a.title).join(', ') || 'None listed'}
- Interests: ${profileData.interests?.join(', ') || 'None listed'}

**Context: Recruiter Evaluation**
You are helping recruiters assess this candidate for potential job opportunities. Provide:
- Objective evaluation of skills and experience
- Fit assessment for specific roles
- Strengths and areas for improvement
- Salary and compensation insights
- Cultural fit considerations
- Technical competency analysis
- Availability and work preference alignment

**Response Guidelines:**
- Be professional and objective
- Provide honest assessment based on profile data
- Highlight relevant experience and skills
- Address potential concerns directly
- Keep responses very concise (1-2 sentences max)
- Focus on job fit and qualifications
- Reference specific projects, skills, or experience when relevant
- Help recruiters make informed decisions
- Be direct and to the point

Remember: You're representing this candidate to potential employers, so be balanced and factual.`;
}