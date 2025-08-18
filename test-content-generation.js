#!/usr/bin/env node
/**
 * Test script for Next.js content generation API with streaming
 * Tests the AI agent endpoint directly
 */

// Mock user profile data for testing
const mockProfileData = {
  full_name: "John Doe",
  designation: "Senior Software Engineer",
  experience: "5+ years",
  location: "San Francisco, CA",
  summary: "Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
  skills: [
    { name: "React", level: "Expert" },
    { name: "Node.js", level: "Advanced" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Python", level: "Intermediate" },
    { name: "AWS", level: "Intermediate" }
  ],
  experience_details: [
    {
      position: "Senior Software Engineer",
      company: "TechCorp Inc",
      duration: "2021 - Present",
      description: "Led a team of 4 developers in building a microservices-based e-commerce platform. Improved system performance by 40% and reduced deployment time by 60%."
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      duration: "2019 - 2021",
      description: "Developed and maintained multiple web applications using React and Node.js. Implemented CI/CD pipelines and improved code quality standards."
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce platform handling 10k+ concurrent users with React frontend and Node.js backend",
      technologies: ["React", "Node.js", "MongoDB", "Redis", "AWS"]
    },
    {
      name: "Data Analytics Dashboard",
      description: "Created a real-time analytics dashboard for business intelligence with interactive charts and reports",
      technologies: ["React", "D3.js", "Python", "PostgreSQL"]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field_of_study: "Computer Science",
      institution: "Stanford University",
      start_date: "2015",
      end_date: "2019"
    }
  ],
  certifications: ["AWS Certified Developer", "React Professional Certification"],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Conversational" }
  ],
  work_preferences: {
    preferred_work_mode: ["Remote", "Hybrid"],
    preferred_employment_type: ["Full-time"],
    availability: "2 weeks notice"
  }
};

// Test different scenarios
const testScenarios = [
  {
    name: "Generic Cover Letter - Professional",
    payload: {
      contentType: "cover_letter",
      purpose: "generic",
      tone: "professional",
      length: "standard",
      profileData: mockProfileData
    }
  },
  {
    name: "Specific Job Cover Letter - Enthusiastic",
    payload: {
      contentType: "cover_letter",
      purpose: "specific_job",
      jobDescription: "We are seeking a Senior Full Stack Engineer to join our growing team. The ideal candidate will have 5+ years of experience with React, Node.js, and cloud technologies. You will lead technical initiatives, mentor junior developers, and architect scalable solutions. Remote work available.",
      companyName: "InnovateTech Solutions",
      positionTitle: "Senior Full Stack Engineer",
      tone: "enthusiastic",
      length: "standard",
      profileData: mockProfileData
    }
  },
  {
    name: "Freelance Proposal - Conversational",
    payload: {
      contentType: "proposal",
      purpose: "specific_job",
      jobDescription: "Need an experienced developer to build a modern e-commerce website with React frontend and Node.js backend. Must include payment integration, inventory management, and admin dashboard. Timeline: 8-10 weeks.",
      companyName: "Small Business Co",
      positionTitle: "E-commerce Website Developer",
      tone: "conversational",
      length: "detailed",
      profileData: mockProfileData
    }
  }
];

async function testContentGeneration() {
  console.log("🧪 Testing Next.js Content Generation API with Streaming\n");
  
  const baseUrl = "http://localhost:3000/api/content-generator";
  
  for (const scenario of testScenarios) {
    console.log(`📝 Testing: ${scenario.name}`);
    console.log("="=repeat(50));
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenario.payload)
      });
      
      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status} - ${response.statusText}`);
        continue;
      }
      
      if (!response.body) {
        console.log("❌ No response body");
        continue;
      }
      
      console.log("✅ Streaming response received. Content:");
      console.log("-".repeat(40));
      
      // Read the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          content += chunk;
          process.stdout.write(chunk); // Print chunks as they arrive
        }
      } finally {
        reader.releaseLock();
      }
      
      console.log("\n" + "-".repeat(40));
      console.log(`📊 Generated ${content.split(' ').length} words`);
      console.log(`✅ ${scenario.name} completed successfully\n`);
      
    } catch (error) {
      console.log(`❌ Error testing ${scenario.name}:`, error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function checkPrerequisites() {
  console.log("🔍 Checking prerequisites...");
  
  try {
    // Check if Next.js dev server is running
    const response = await fetch("http://localhost:3000/api/content-generator", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    console.log("✅ Next.js server is running");
    return true;
  } catch (error) {
    console.log("❌ Next.js server not running. Please start with: npm run dev");
    console.log("❌ Or the content-generator API route is not accessible");
    return false;
  }
}

async function main() {
  console.log("🚀 Content Generation API Test Suite");
  console.log("====================================\n");
  
  const ready = await checkPrerequisites();
  if (!ready) {
    process.exit(1);
  }
  
  await testContentGeneration();
  
  console.log("🎉 All tests completed!");
  console.log("\nNext steps:");
  console.log("- Verify streaming works correctly");
  console.log("- Check generated content quality");
  console.log("- Test with different profile data");
  console.log("- Integration with frontend UI");
}

// Helper function for string repeat (Node.js compatibility)
String.prototype.repeat = String.prototype.repeat || function(count) {
  return new Array(count + 1).join(this);
};

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testContentGeneration, mockProfileData };