import { CONTACT } from "@/data/site";

export function WhatsAppButton() {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--color-brand-whatsapp)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d="M19.11 17.27c-.27-.13-1.59-.78-1.83-.87-.25-.09-.43-.13-.61.13-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.13-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.4-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.94 2.96 4.7 4.04.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.06-.11-.25-.18-.52-.31zM12.04 2C6.51 2 2 6.5 2 12.02c0 1.91.5 3.7 1.38 5.25L2 22l4.86-1.27a9.97 9.97 0 0 0 5.18 1.43h.01c5.52 0 10.03-4.49 10.03-10.02 0-2.68-1.05-5.2-2.95-7.1A10.04 10.04 0 0 0 12.04 2z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
