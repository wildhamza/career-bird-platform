"use client";

import React, { Suspense } from "react";
import GrantFeed from "@/components/landing/GrantFeed";

function GrantsContent() {
  return <GrantFeed limit={undefined} isDashboardContext={true} />;
}

export default function GrantsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading grants...</div>}>
        <GrantsContent />
      </Suspense>
    </div>
  );
}
