import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { removeAgentAction } from "@/lib/actions/agents";
import { requireRole } from "@/lib/auth";
import { displayName, formatDate } from "@/lib/format";
import type { Profile } from "@/types";

export default async function AgentsPage() {
  const { supabase } = await requireRole(["admin"]);
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false });
  const agents = (data || []) as Profile[];

  return (
    <>
      <PageHeader title="Agents" subtitle="Manage support staff in this tenant." />
      {agents.length === 0 ? (
        <EmptyState title="No agents yet" message="Invite one to get started." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td className="px-4 py-4 font-medium text-zinc-950">{displayName(agent)}</td>
                  <td className="px-4 py-4 text-zinc-600">{agent.email || "Unknown"}</td>
                  <td className="px-4 py-4 text-zinc-600">{formatDate(agent.created_at)}</td>
                  <td className="px-4 py-4">
                    <form action={removeAgentAction}>
                      <input type="hidden" name="agentId" value={agent.id} />
                      <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
                        Remove Agent
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
