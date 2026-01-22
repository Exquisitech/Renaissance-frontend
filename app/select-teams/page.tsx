import { TeamSelector } from "@/components/team-selector";

export default function SelectTeamsPage() {
    return (
        <div className="min-h-screen bg-[#020817] text-white p-8 md:p-16 lg:p-24">
            <div className="max-w-6xl mx-auto h-full">
                <TeamSelector />
            </div>
        </div>
    );
}
