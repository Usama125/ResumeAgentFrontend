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

    // Get the full URL for the resume template page
    const host = request.headers.get('host') || 'localhost:3001'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`
    const resumeUrl = `${baseUrl}/resume-template/${username}`

    console.log('🎯 Generating Professional Resume PDF for:', resumeUrl)

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
            '--disable-extensions',
          ],
        })

    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2, // Higher resolution for better quality
    })

    // Set background color to white
    await page.evaluateOnNewDocument(() => {
      document.documentElement.style.background = 'white';
      document.body.style.background = 'white';
    })

    // Navigate to the resume template page
    await page.goto(resumeUrl, {
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

    // Additional wait for any dynamic content and AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))

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

    // Generate PDF with optimized settings for resume
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
      preferCSSPageSize: false,
      width: '210mm',
      height: '297mm',
    })

    await browser.close()

    console.log('✅ Professional Resume PDF generated successfully')

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${username}-professional-resume.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('❌ Error generating Professional Resume PDF:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Professional Resume PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Professional Resume PDF Generator API' },
    { status: 200 }
  )
}
