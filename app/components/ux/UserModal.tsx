"use client";
import React from "react";
import { formatUTCToMMDDYY } from "@/lib/dateformat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Phone, Link2, Globe, FileText, Calendar } from "lucide-react";

type User = {
  category: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  linkedIn?: string;
  website?: string;
  match_score: number;
  pdf_path?: string;
  created_at: string;
};

export default function UserModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  if (!user) return null;

  const scoreColor =
    user.match_score >= 75
      ? "bg-green-100 text-green-700"
      : user.match_score >= 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Applicant</p>
            <h2 className="text-white text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              {user.category && (
                <Badge variant="secondary" className="text-xs capitalize text-white">
                  {user.category}
                </Badge>
              )}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor}`}>
                {user.match_score}% match
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors mt-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          <Row icon={<Mail className="w-4 h-4" />} label="Email">
            <a href={`mailto:${user.email}`} className="text-indigo-600 hover:underline">
              {user.email}
            </a>
          </Row>

          <Row icon={<Phone className="w-4 h-4" />} label="Phone">
            <span className="text-gray-700">{user.phone || "—"}</span>
          </Row>

          {user.linkedIn && (
            <Row icon={<Link2 className="w-4 h-4" />} label="LinkedIn">
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline truncate"
              >
                {user.linkedIn}
              </a>
            </Row>
          )}

          {user.website && (
            <Row icon={<Globe className="w-4 h-4" />} label="Website">
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline truncate"
              >
                {user.website}
              </a>
            </Row>
          )}

          <Row icon={<Calendar className="w-4 h-4" />} label="Submitted">
            <span className="text-gray-700">{formatUTCToMMDDYY(user.created_at)}</span>
          </Row>

          {user.pdf_path && (
            <Row icon={<FileText className="w-4 h-4" />} label="Resume">
              <Link
                href={`/api/download-resume?path=${user.pdf_path}`}
                target="_blank"
                className="text-indigo-600 hover:underline"
              >
                View PDF
              </Link>
            </Row>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <div className="text-sm truncate">{children}</div>
      </div>
    </div>
  );
}
