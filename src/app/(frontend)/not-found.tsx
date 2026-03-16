import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-8">
      <pre className="font-[family-name:var(--font-code)] text-[var(--color-primary)] text-xs sm:text-sm leading-tight select-none">
        {`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═████╗██║  ██║
  ███████║██║██╔██║███████║
  ╚════██║████╔╝██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝`}
      </pre>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-code)]">
          <span className="text-[var(--color-danger)]">ERROR:</span> страница не
          найдена
        </h1>
        <p className="text-[var(--color-text-muted)] font-[family-name:var(--font-code)] text-sm">
          $ cat requested_page.txt
          <br />
          <span className="text-[var(--color-danger)]">
            cat: No such file or directory
          </span>
        </p>
      </div>

      <div className="space-y-2 font-[family-name:var(--font-code)] text-sm">
        <p className="text-[var(--color-text-muted)]">Попробуй:</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ~/
          </Link>
          <Link
            href="/path"
            className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ~/path
          </Link>
          <Link
            href="/tools"
            className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ~/tools
          </Link>
          <Link
            href="/questions"
            className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ~/questions
          </Link>
          <Link
            href="/posts"
            className="px-3 py-1.5 border border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            ~/posts
          </Link>
        </div>
      </div>

      <form
        action="/search"
        method="GET"
        className="flex max-w-sm mx-auto gap-2"
      >
        <input
          type="text"
          name="q"
          placeholder="grep -r '...'"
          className="flex-1 px-3 py-2 text-sm font-[family-name:var(--font-code)] rounded border border-[var(--color-border)] bg-transparent text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold font-[family-name:var(--font-code)] bg-[var(--color-primary)] text-[var(--color-bg)] rounded hover:opacity-90 transition"
        >
          find
        </button>
      </form>
    </div>
  );
}
