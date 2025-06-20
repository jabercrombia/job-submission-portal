import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supbase-admin';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeExpired = url.searchParams.get('includeExpired') === 'true';
  const category = url.searchParams.get('category');

  const now = new Date().toISOString();

  let query = supabaseAdmin
    .from('job_entries')
    .select('id, title, description, expiration, category, created_at, job_posting_key');

  if (!includeExpired) {
    query = query.or(`expiration.gt.${now},expiration.is.null`);
  }

  if(category){
    query = query.eq('category', category);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
