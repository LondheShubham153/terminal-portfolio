import { db } from "@/lib/db";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { markMessageRead, deleteMessage } from "./actions";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <p className="font-mono text-term-green mb-6">$ ls ./messages</p>
      <ErrorBanner show={error === "1"} />
      <div className="grid gap-3">
        {messages.length === 0 && (
          <p className="font-mono text-sm text-term-fg-dim">{"// no messages yet"}</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className="rounded-md border border-term-border bg-term-bg-raised p-4">
            <div className="flex items-center justify-between font-mono text-xs text-term-fg-dim mb-2">
              <span>
                {message.name} &lt;{message.email}&gt;
                {!message.read && <span className="ml-2 text-term-amber">unread</span>}
              </span>
              <span>{message.createdAt.toLocaleString()}</span>
            </div>
            <p className="font-serif text-sm text-term-fg whitespace-pre-wrap">{message.message}</p>
            <div className="flex gap-3 font-mono text-xs mt-3">
              {!message.read && (
                <form action={markMessageRead.bind(null, message.id)}>
                  <button type="submit" className="text-term-green hover:underline">mark read</button>
                </form>
              )}
              <form action={deleteMessage.bind(null, message.id)}>
                <ConfirmSubmitButton confirmMessage={`Delete message from "${message.name}"?`} className="text-[#e8534d] hover:underline">
                  delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
