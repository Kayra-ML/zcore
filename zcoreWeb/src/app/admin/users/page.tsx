"use client";

import { useEffect, useState } from "react";

type Plan = "FREE" | "STARTER" | "PRO";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  plan: Plan;
  createdAt: string;
  subscription: { status: string; startedAt: string; expiresAt: string | null } | null;
}

const PLAN_COLORS: Record<Plan, string> = {
  FREE: "text-zinc-400 bg-zinc-800",
  STARTER: "text-blue-400 bg-blue-400/10",
  PRO: "text-emerald-400 bg-emerald-400/10",
};

const PLAN_NAMES: Record<Plan, string> = {
  FREE: "Demo",
  STARTER: "Başlangıç",
  PRO: "Profesyonel",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  const changePlan = async (userId: string, plan: Plan) => {
    setUpdating(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan }),
    });
    await fetchUsers();
    setUpdating(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Toplam {users.length} kullanıcı · Plan değişikliklerini buradan yapabilirsiniz
          </p>
        </div>

        {/* Tablo */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#111111] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs text-zinc-500 font-medium px-6 py-4">Kullanıcı</th>
                <th className="text-left text-xs text-zinc-500 font-medium px-6 py-4">Mevcut Plan</th>
                <th className="text-left text-xs text-zinc-500 font-medium px-6 py-4">Kayıt Tarihi</th>
                <th className="text-left text-xs text-zinc-500 font-medium px-6 py-4">Plan Değiştir</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white text-sm font-medium">{user.name || "—"}</p>
                      <p className="text-zinc-500 text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PLAN_COLORS[user.plan]}`}>
                      {PLAN_NAMES[user.plan]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.plan}
                      disabled={updating === user.id}
                      onChange={(e) => changePlan(user.id, e.target.value as Plan)}
                      className="bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-white/20 transition-colors disabled:opacity-50"
                    >
                      <option value="FREE">Demo (Ücretsiz)</option>
                      <option value="STARTER">Başlangıç (₺299/ay)</option>
                      <option value="PRO">Profesyonel (₺549/ay)</option>
                    </select>
                    {updating === user.id && (
                      <span className="ml-2 text-xs text-emerald-400">Güncelleniyor...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
