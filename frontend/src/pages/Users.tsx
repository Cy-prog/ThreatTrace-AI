import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import { dashboardApi } from '../api/dashboard';
import { User } from '../types/auth';
import { Users as UsersIcon, Shield, CheckCircle } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await dashboardApi.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <PageContainer
      title="User & Access Administration"
      subtitle="Role-Based Access Control (RBAC) authorization matrix and verified analyst accounts."
    >
      {isLoading ? (
        <Loading label="Querying user database..." />
      ) : (
        <div className="overflow-x-auto border border-surface-border rounded-md bg-surface-card font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-100/70 text-[10px] uppercase text-slate-400">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Username / Identity</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Assigned Roles</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-100/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100">{u.fullName}</td>
                  <td className="py-3 px-4 text-cyan-400">{u.username}</td>
                  <td className="py-3 px-4 text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.roles.map((r) => (
                        <Badge key={r} variant="status" size="sm">
                          {r.replace('ROLE_', '')}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-emerald-400 inline-flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
};
