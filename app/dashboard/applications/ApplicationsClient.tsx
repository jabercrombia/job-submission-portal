"use client";

import { useEffect, useState } from "react";
import { formatUTCToMMDDYY } from "@/lib/dateformat";
import Link from "next/link";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import UserModal from "@/app/components/ux/UserModal";
import { Eye } from "lucide-react";

import "../../../styles/components/table.scss";

import Loader from "@/app/components/ux/Loader";

const categories = [
  "view",
  "first name",
  "last name",
  "email",
  "phone",
  "linkedIn",
  "title",
  "category",
  "website",
  "resume",
  "match score",
  "submitted at",
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      linkedIn: string;
      website: string;
      pdf_path: string;
      match_score: number;
      created_at: string;
      category: string;
      title: string;
    }>
  >([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "created_at",
    direction: "desc",
  });

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedIn?: string;
    website?: string;
    pdf_path?: string;
    match_score: number;
    created_at: string;
    category: string;
    title: string;
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const { key, direction } = sortConfig;
    const aVal = a[key as keyof typeof a] ?? "";
    const bVal = b[key as keyof typeof b] ?? "";

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching applications entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, []);

  return (
    <div className="container mx-auto">
      <h1>Applications</h1>
      {isLoading ? (
        <Loader size={32} className="h-40" />
      ) : (
        <TableContainer className="border-solid border-1 border-gray-300">
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead className="uppercase">
              <TableRow>
                {categories.map((category) => (
                  <TableCell
                    key={category}
                    sortDirection={
                      sortConfig.key === category ? sortConfig.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sortConfig.key === category}
                      direction={
                        sortConfig.key === category
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSort(category)}
                    >
                      {category}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map(
                (user: {
                  id: string;
                  firstName: string;
                  lastName: string;
                  email: string;
                  phone: string;
                  linkedIn: string;
                  website: string;
                  pdf_path: string;
                  match_score: number;
                  created_at: string;
                  category: string;
                  title: string;
                }) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Eye
                        className="cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
                        onClick={() => openModal(user)}
                      />
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>
                      <Link href={`mailto:${user.email}`}>{user.email}</Link>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.linkedIn && (
                        <Link href={user.linkedIn}>LinkedIn</Link>
                      )}
                    </TableCell>
                    <TableCell>{user.category}</TableCell>
                    <TableCell>{user.title}</TableCell>
                    <TableCell>
                      {user.website && (
                        <Link href={user.website} target="_blank">
                          Website
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.pdf_path && (
                        <Link
                          href={`/api/download-resume?path=${user.pdf_path}`}
                        >
                          View
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{user.match_score}</TableCell>
                    <TableCell>{formatUTCToMMDDYY(user.created_at)}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
        {showModal && selectedUser && (
            <UserModal user={selectedUser} onClose={closeModal} />
        )}
    </div>
  );
}
