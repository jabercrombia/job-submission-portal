import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supbase-admin'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const website = formData.get('website') as string
    const linkedIn = formData.get('linkedIn') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const jobDescription = formData.get('jobDescription') as string
    const pdfFile = formData.get('pdf') as File

    if (!firstName || !lastName || !pdfFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upload PDF to Supabase Storage
    const arrayBuffer = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = `resumes/${Date.now()}_${pdfFile.name}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('resume-uploads')
      .upload(filePath, buffer, {
        contentType: pdfFile.type,
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Try to get match score from Python service (optional)
    let match_score = 0
    const pdfScanUrl = process.env.NEXT_PUBLIC_PDF_SCAN_URL

    if (pdfScanUrl && jobDescription) {
      try {
        const scanPayload = new FormData()
        const blob = new Blob([buffer], { type: pdfFile.type })
        scanPayload.append('pdf', blob, pdfFile.name)
        scanPayload.append('firstName', firstName)
        scanPayload.append('lastName', lastName)
        scanPayload.append('email', email || '')
        scanPayload.append('phone', phone || '')
        scanPayload.append('linkedIn', linkedIn || '')
        scanPayload.append('website', website || '')
        scanPayload.append('title', title || '')
        scanPayload.append('category', category || '')
        scanPayload.append('jobDescription', jobDescription)

        const scanRes = await fetch(`${pdfScanUrl}/score`, {
          method: 'POST',
          body: scanPayload,
          signal: AbortSignal.timeout(10000),
        })

        if (scanRes.ok) {
          const scanData = await scanRes.json()
          match_score = scanData.match_score ?? 0
        }
      } catch {
        // Python service unavailable — continue without score
      }
    }

    // Save application to database
    const { error: dbError } = await supabaseAdmin
      .from('resume_users')
      .insert([{
        firstName,
        lastName,
        email,
        phone,
        website,
        linkedIn,
        pdf_path: filePath,
        match_score,
        title,
        category,
      }])

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, match_score })
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err }, { status: 500 })
  }
}
