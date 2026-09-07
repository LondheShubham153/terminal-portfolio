import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [projects, posts, messages, unreadMessages] = await Promise.all([
    db.project.count(),
    db.blogPost.count(),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "projects", value: projects },
    { label: "blog posts", value: posts },
    { label: "messages", value: messages },
    { label: "unread messages", value: unreadMessages },
  ];

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ admin status</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-term-border bg-term-bg-raised p-4">
            <p className="font-mono text-2xl text-term-fg">{stat.value}</p>
            <p className="font-mono text-xs text-term-fg-dim">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
