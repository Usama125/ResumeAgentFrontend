// Simple test script to verify PDF generation
const testPDFGeneration = async () => {
  try {
    console.log('🧪 Testing PDF generation...')
    
    const response = await fetch('http://localhost:3001/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'usama123' // Replace with your actual username
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ PDF generation failed:', errorData)
      return
    }

    console.log('✅ PDF generation successful!')
    console.log('📄 Content-Type:', response.headers.get('content-type'))
    console.log('📏 Content-Length:', response.headers.get('content-length'))
    
    // You can save the PDF if needed
    // const buffer = await response.arrayBuffer()
    // require('fs').writeFileSync('test-profile.pdf', Buffer.from(buffer))
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testPDFGeneration()
}

module.exports = testPDFGeneration