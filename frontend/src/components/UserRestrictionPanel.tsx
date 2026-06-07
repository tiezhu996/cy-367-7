import type { User } from "../types";

interface UserRestrictionPanelProps {
  users: User[];
  maxNoShow: number;
}

export function UserRestrictionPanel({
  users,
  maxNoShow,
}: UserRestrictionPanelProps) {
  return (
    <div className="work-panel">
      <h2 className="mb-5 text-2xl font-black">用户爽约管理</h2>
      <div className="mb-4 rounded-lg bg-ink/5 p-4 text-sm text-ink/70">
        <strong className="text-ink">规则：</strong> 爽约累计超过 {maxNoShow} 次将被限制预约权限
      </div>
      <div className="overflow-hidden rounded-lg border border-ink/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-ink/5">
            <tr>
              <th className="p-3">用户</th>
              <th className="p-3">手机号</th>
              <th className="p-3">爽约次数</th>
              <th className="p-3">状态</th>
              <th className="p-3">距离限制</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const remaining = Math.max(0, maxNoShow - user.noShowCount);
              const progress = Math.min(100, (user.noShowCount / maxNoShow) * 100);

              return (
                <tr className="border-t border-ink/10" key={user.id}>
                  <td className="p-3 font-medium">{user.username}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${
                        user.noShowCount >= maxNoShow
                          ? "text-red-600"
                          : user.noShowCount >= maxNoShow - 1
                            ? "text-orange-600"
                            : "text-ink"
                      }`}
                    >
                      {user.noShowCount} 次
                    </span>
                  </td>
                  <td className="p-3">
                    {user.isRestricted ? (
                      <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        已限制
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        正常
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                        <div
                          className={`h-full rounded-full ${
                            progress >= 100
                              ? "bg-red-500"
                              : progress >= 66
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-20 text-xs text-ink/60">
                        {user.isRestricted ? "已限制" : `还可爽约 ${remaining} 次`}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
