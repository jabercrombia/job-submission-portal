"use client";

import { useEffect, useState } from "react";
import ListingTable from "@/app/components/table/ListingTable";
import Loader from "./components/ux/Loader";
import Search from "./components/form/Search";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const [entries, setEntries] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      expiration: string;
      created_at?: string;
      job_posting_key?: string;
    }>
  >([]);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch("/api/job-entries");
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching job entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, []);

  const filteredEntries =
    searchQuery.trim() === ""
      ? entries
      : entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="container mx-auto px-4">
      {/* Hero */}
      <div className="text-center py-12 md:py-16">
        <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold mb-3">
          Now hiring
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Browse open positions and apply directly — no account required.
        </p>
      </div>

      {isLoading ? (
        <Loader size={32} className="h-40" />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Search onSearchChange={setSearchQuery} />
          </div>
          <ListingTable data={filteredEntries} />
        </div>
      )}
    </div>
  );
}
