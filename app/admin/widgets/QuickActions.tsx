import { ActionButton, AdminCard } from "../adminUI";

export default function QuickActions() {
  return (
    <AdminCard>
      <h2 className="text-2xl font-black">
        Quick Actions
      </h2>

      <div className="mt-6 flex flex-wrap gap-3">

        <ActionButton variant="gold">
          Review Applications
        </ActionButton>

        <ActionButton>
          Search Users
        </ActionButton>

        <ActionButton>
          Moderate Reports
        </ActionButton>

        <ActionButton>
          Publish Announcement
        </ActionButton>

        <ActionButton>
          Add Creator Hub Resource
        </ActionButton>

        <ActionButton>
          Start Competition
        </ActionButton>

      </div>
    </AdminCard>
  );
}