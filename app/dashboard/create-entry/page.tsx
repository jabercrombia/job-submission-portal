'use client';

import { useState, useTransition, useEffect } from 'react';
import { createJob } from '@/app/actions/createJob';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/styles/components/form.scss";

export default function FormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiration, setExpiration] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [category,setCategory] = useState('');

  type Category = {
    category_name: string;
  };
  const [jobCategory,setJobCategory] = useState<Category[]>([]);

    useEffect(() => {
      const fetchEntry = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setJobCategory(Array.isArray(data) ? data : []);
      }

      fetchEntry();
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await createJob({ title, description, expiration, category });
        setMessage('Entry created successfully!');
        setTitle('');
        setDescription('');
        setExpiration('');
        setCategory('');
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage('An unknown error occurred.');
        }
      }
    });
  };

  console.log(category)
  return (
    <div className="container mx-auto p-6">
      <h1>Create Job Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <Input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="w-full border rounded p-2"
          >
            {jobCategory.map((elem, index) => (
              <option key={index}>{elem.category_name}</option>
            ))}
            </select>
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Expiration</label>
          <Input
            type="date"
            value={expiration}
            onChange={e => setExpiration(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
