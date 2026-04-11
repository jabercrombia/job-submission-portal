"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, ArrowUpRight, Plus } from "lucide-react";
import Loader from "@/app/components/ux/Loader";

type Entry = {
  id: string;
  title: string;
  category?: string;
  expiration: string;
  created_at?: string;
  job_posting_key?: string;
};

export default function ListingsClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch('/api/job-entries?includeExpired=true');
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntry();
  }, []);

  const isExpired = (expiration: string) => new Date(expiration) < new Date();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
        <Link href="/dashboard/create-entry">
          <Button className="flex items-center gap-1.5 text-sm">
            <Plus className="w-4 h-4" /> New Posting
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader size={32} className="h-40" />
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No listings yet.</p>
          <p className="text-sm mt-1">Create your first job posting.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {entries.map((item, index) => {
            const expired = isExpired(item.expiration);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                  index !== 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    {item.category && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                    )}
                    {expired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {expired
                      ? `Expired ${new Date(item.expiration).toLocaleDateString()}`
                      : `Closes ${new Date(item.expiration).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Link href={`/job/${item.job_posting_key}`} target="_blank">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/edit-entry/${item.job_posting_key}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
