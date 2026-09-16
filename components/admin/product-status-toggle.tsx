"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { setProductActiveAction } from "@/app/admin/(dashboard)/products/actions";

export function ProductStatusToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  async function toggle() {
    setIsPending(true);
    await setProductActiveAction(id, !active);
    setIsPending(false);
    toast.success(active ? "Product unpublished" : "Product published");
    router.refresh();
  }

  return (
    <button onClick={toggle} disabled={isPending} className="disabled:opacity-50">
      <Badge variant={active ? "success" : "neutral"} dot>
        {active ? "Published" : "Draft"}
      </Badge>
    </button>
  );
}
