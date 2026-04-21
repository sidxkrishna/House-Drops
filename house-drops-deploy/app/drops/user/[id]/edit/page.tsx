"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function EditDropPage() {
  const { id } = useParams<{ id: string }>();
  redirect(`/drops/user/${id}`);
}
