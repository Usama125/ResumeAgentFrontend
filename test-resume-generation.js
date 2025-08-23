// Test script for the new Professional Resume generation feature
const testResumeGeneration = async () => {
  try {
    console.log('🧪 Testing Professional Resume generation...')
    
    // Test the resume processor API
    console.log('📝 Testing Resume Data Processor...')
    const processResponse = await fetch('http://localhost:3001/api/resume-processor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        profileData: {
          name: "John Doe",
          designation: "Senior Software Engineer",
          summary: "Experienced software engineer with 5+ years in full-stack development",
          skills: [
            { name: "JavaScript", level: "Expert", experience_years: 5 },
            { name: "React", level: "Advanced", experience_years: 4 },
            { name: "Node.js", level: "Advanced", experience_years: 4 }
          ],
          experience_details: [
            {
              position: "Senior Software Engineer",
              company: "Tech Corp",
              duration: "2020 - Present",
              description: "Led development of multiple web applications"
            }
          ],
          projects: [
            {
              name: "E-commerce Platform",
              description: "Built a full-stack e-commerce solution",
              technologies: ["React", "Node.js", "MongoDB"]
            }
          ]
        }
      }),
    })

    if (processResponse.ok) {
      const processedData = await processResponse.json()
      console.log('✅ Resume data processing successful!')
      console.log('📊 Processed data structure:', Object.keys(processedData))
    } else {
      console.error('❌ Resume data processing failed:', await processResponse.text())
      return
    }

    // Test the resume PDF generation API
    console.log('📄 Testing Resume PDF Generation...')
    const pdfResponse = await fetch('http://localhost:3001/api/generate-resume-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'usama123' // Replace with your actual username
      }),
    })

    if (pdfResponse.ok) {
      console.log('✅ Resume PDF generation successful!')
      console.log('📄 Content-Type:', pdfResponse.headers.get('content-type'))
      console.log('📏 Content-Length:', pdfResponse.headers.get('content-length'))
      
      // You can save the PDF if needed
      // const buffer = await pdfResponse.arrayBuffer()
      // require('fs').writeFileSync('test-professional-resume.pdf', Buffer.from(buffer))
      
    } else {
      const errorData = await pdfResponse.json().catch(() => ({}))
      console.error('❌ Resume PDF generation failed:', errorData)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testResumeGeneration()
}

module.exports = { testResumeGeneration }
