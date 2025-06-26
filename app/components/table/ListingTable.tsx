import { Button } from "@/components/ui/button";
import Link from "next/link";
import { daysLeftToExpiration } from "@/lib/dateformat";

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

  return (
    <div className="mb-10">
      {groupedArr && Object.keys(groupedArr).length > 0 ? (
        Object.entries(groupedArr).map(([category, jobs]) => (
          <div key={category}>
            <h3 className="text-lg font-bold capitalize pt-4" id={category}>
              {category}
            </h3>
            {jobs.map((entry, i) => (
              <div
                key={entry.job_posting_key || `${category}-${i}`}
                className="flex justify-between py-4 border-b border-gray-400"
              >
                <div>
                  <h4 className="font-medium">{entry.title}</h4>
                  {entry.category && (
                    <p className="text-sm capitalize text-gray-600">
                      {entry.category}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <Link href={`/job/${entry.job_posting_key || ""}`}>
                    <Button>Apply</Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {daysLeftToExpiration(entry.expiration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <h3 className="text-center text-gray-500 pt-10">No jobs available</h3>
      )}
    </div>
  );
}
