
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase();

  const res = await fetch(`${process.env.SITE_URL||'http://localhost:3000'}/api/job-entries`);
  const jobs = await res.json();

  if (!query) return NextResponse.json(jobs);

  const filtered = jobs.filter((job: {title: string, description: string, category: string}) =>
    job.title.toLowerCase().includes(query) ||
    job.description.toLowerCase().includes(query) ||
    job.category.toLowerCase().includes(query)
  );

  return NextResponse.json(filtered);
}
