import { EmptyState } from "@/components/index";

export default function RelationshipsPage() {
    return (
        <div className="h-full flex items-center justify-center p-8">
            <EmptyState
                title="Relational Index"
                description="Please utilize the graphical Context Explorer to view multi-hop relationships and dependency paths."
                icon="search"
            />
        </div>
    );
}
