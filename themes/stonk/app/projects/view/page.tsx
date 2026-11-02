"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

// One static page for every project: /projects/view/?id=<id>.
function ProjectView() {
    const id = useSearchParams().get("id");
    return <ProjectDetailClient id={id} />;
}

export default function ProjectViewPage() {
    return (
        <Suspense fallback={null}>
            <ProjectView />
        </Suspense>
    );
}
