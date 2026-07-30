export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/233244018530"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nana B on WhatsApp at 0244 018 530"
      className="fixed bottom-[84px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white transition hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-white md:bottom-6 md:right-6"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
        <path d="M19.11 17.47c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26s.98 2.63 1.11 2.81c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.55.57.65.21 1.24.18 1.71.11.52-.08 1.59-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z" />
        <path d="M16.03 3.2A12.72 12.72 0 0 0 5.09 22.4L3.2 28.8l6.56-1.82a12.79 12.79 0 1 0 6.27-23.78Zm0 23.27c-2.04 0-4.03-.55-5.77-1.59l-.41-.25-3.89 1.08 1.04-3.79-.27-.43a10.47 10.47 0 1 1 9.3 4.98Z" />
      </svg>
    </a>
  );
}
