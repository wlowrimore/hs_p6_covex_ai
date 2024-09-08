"use clien";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function useContextAuth() {
  const session = useSession();
  const upsertUser = useMutation(api.functions.upsertUser);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    if (session?.status === "authenticated" && session.data?.user) {
      upsertUser({
        name: session.data.user.name ?? "",
        email: session.data.user.email ?? "",
        image: session.data.user.image ?? undefined,
      }).then((id) => {
        if (typeof id === "string") {
          setUserId(id as Id<"users">);
        }
      });
    }
  }, [session, upsertUser]);

  return {
    isAuthenticated: session?.status === "authenticated",
    userId,
    user: session.data?.user,
  };
}
