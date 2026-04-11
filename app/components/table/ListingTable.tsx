import { Button } from "@/components/ui/button";
import Link from "next/link";
import { daysLeftToExpiration } from "@/lib/dateformat";
import { ArrowRight } from "lucide-react";

type JobEntry = {
  title: string;
  expiration: string;
  category: string;
  job_posting_key?: string;
};

type TableProps = {
  data: JobEntry[];
};

export default function Table({ data }: TableProps) {
  const groupedArr: { [key: string]: JobEntry[] } = {};

  data.forEach((elem) => {
    if (groupedArr[elem.category]) {
      groupedArr[elem.category].push(elem);
    } else {
      groupedArr[elem.category] = [elem];
    }
  });

  if (!data.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No jobs available right now.</p>
        <p className="text-sm mt-1">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-8">
      {Object.entries(groupedArr).map(([category, jobs]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {category}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{jobs.length} {jobs.length === 1 ? "role" : "roles"}</span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {jobs.map((entry, i) => (
              <div
                key={entry.job_posting_key || `${category}-${i}`}
                className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                  i !== 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {daysLeftToExpiration(entry.expiration)}
                  </p>
                </div>
                <Link href={`/job/${entry.job_posting_key || ""}`}>
                  <Button className="flex items-center gap-1.5 text-sm">
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
