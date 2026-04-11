'use client';

import { useEffect, useState } from 'react';
import {formatUTCToMMDDYYYY} from '../../../lib/dateformat';
import { useParams } from 'next/navigation';
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import NewUser from "../../components/NewUser";
import Link from "next/link";
import "../../../styles/components/form.scss";
import "../../../styles/components/jd.scss";

export default function Home() {
  const params = useParams<{ slug: string }>();

  const [entries, setEntries] = useState<{
    id: string;
    title: string;
    description: string;
    expiration: string;
    created_at?: string;
    category?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/job-entry?key=${params.slug}`);
        const data = await res.json();

        const now = new Date();
        const expiration = new Date(data.expiration);

        if (expiration > now) {
          setEntries(data);
        } else {
          setEntries(null);
        }
      } catch (err) {
        console.error('Failed to fetch entry', err);
        setEntries(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params.slug]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      {entries ? (
        <div className="mb-4 p-4 rounded">
          <div className='flex justify-between items-center mb-2'>
            <div>
              <h2 className="text-xl font-bold">{entries.title}</h2>
            </div>
            <div>
              <Link href="#apply"><Button>Apply</Button></Link>
            </div>
          </div>
          <Markdown>{entries.description.replace(/\\n/g, '\n')}</Markdown>
          <p className="text-sm text-gray-500 pt-4">Posting will be closed on {formatUTCToMMDDYYYY(entries.expiration)}</p>
          <hr className='mt-3'/>
          <section id="apply" className='right'>Apply Now</section>
          <NewUser jobTitle={entries.title} jobDescription={entries.description} jobCategory={entries.category ?? 'no category'} />
        </div>
      ) : (
        <div className="text-center text-2xl text-red-500 py-10">This job posting has expired.</div>
      )}
    </div>
  );
}
