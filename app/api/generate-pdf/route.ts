import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }



    // Get the full URL for the print-optimized page
    // Try to detect the correct port from the request headers
    const host = request.headers.get('host') || 'localhost:3001'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`
    const printUrl = `${baseUrl}/print-profile/${username}`

    console.log('🎯 Generating PDF for:', printUrl)

    // Configure browser for production vs development
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Launch Puppeteer with appropriate configuration
    const browser = isProduction
      ? await puppeteerCore.launch({
          args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })
      : await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--allow-running-insecure-content',
            '--disable-web-security',
            '--disable-extensions',
          ],
        })

    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1,
    })

    // Set background color to white
    await page.evaluateOnNewDocument(() => {
      document.documentElement.style.background = 'white';
      document.body.style.background = 'white';
    })

    // Navigate to the print-optimized page
    await page.goto(printUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait for images to load, including S3 images
    try {
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  const timeoutId = setTimeout(() => resolve(null), 5000) // 5 second timeout per image
                  img.addEventListener('load', () => {
                    clearTimeout(timeoutId)
                    resolve(null)
                  })
                  img.addEventListener('error', () => {
                    clearTimeout(timeoutId)
                    console.warn('Image failed to load:', img.src)
                    resolve(null)
                  })
                })
            )
        )
      })
    } catch (imageError) {
      console.warn('Error waiting for images:', imageError)
    }

    // Wait for fonts to load and content to settle
    await page.evaluate(() => {
      return document.fonts.ready.catch(() => {
        // Font loading failed, continue anyway
        return Promise.resolve()
      })
    })

    // Additional wait for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Ensure white background before PDF generation
    await page.evaluate(() => {
      document.documentElement.style.background = 'white';
      document.body.style.background = 'white';
      document.body.style.minHeight = 'auto';
      // Remove any potential black backgrounds
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.backgroundColor === 'rgb(0, 0, 0)' || computed.backgroundColor === 'black') {
          (el as HTMLElement).style.backgroundColor = 'white';
        }
      });
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm',
      },
      preferCSSPageSize: false,
      width: '210mm',
      height: '297mm',
    })

    await browser.close()

    console.log('✅ PDF generated successfully')

    // Track profile PDF download for analytics
    try {
      // Get user data to extract user ID
      let userId = null;
      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/username/${username}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.id;
        }
      } catch (error) {
        console.log('Could not fetch user ID for analytics:', error);
      }
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'pdf_download',
          user_id: userId,  // Attribute to profile owner
          username: username,
          details: { 
            file_type: 'profile',
            downloaded_user_id: userId,
            downloaded_username: username
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        })
      });
    } catch (trackingError) {
      console.error('Analytics tracking failed:', trackingError);
      // Don't fail the PDF generation if tracking fails
    }

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${username}-profile.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('❌ Error generating PDF:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST request.' },
    { status: 405 }
  )
}