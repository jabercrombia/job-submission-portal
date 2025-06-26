
'use client';

type SearchProps = {
  onSearchChange: (value: string) => void;
};

export default function Search({ onSearchChange }: SearchProps) {
  return (
    <input
      type="text"
      placeholder="Search jobs..."
      onChange={(e) => onSearchChange(e.target.value)}
      className="border px-3 py-2 w-full rounded-md"
    />
  );
}
