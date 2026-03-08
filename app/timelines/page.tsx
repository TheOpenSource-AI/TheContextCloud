import { EmptyState } from "@/components/index";

export default function TimelinesPage() {
    return (
        <div className="h-full flex items-center justify-center p-8">
            <EmptyState
                title="Timelines Module Active"
                description="Event chronologies are embedded natively within the Entity Drawer in the Context Explorer."
                icon="folder"
            />
        </div>
    );
}
