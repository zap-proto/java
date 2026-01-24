import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">ZAP Java</h1>
      <p className="text-lg text-fd-muted-foreground mb-8 max-w-xl">
        A pure Java implementation of ZAP, the insanely fast data
        interchange format and capability-based RPC system.
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary px-4 py-2 text-fd-primary-foreground font-medium hover:bg-fd-primary/90"
        >
          Get Started
        </Link>
        <Link
          href="https://github.com/zap-protocol/zap-java"
          className="rounded-lg border border-fd-border px-4 py-2 font-medium hover:bg-fd-accent"
        >
          GitHub
        </Link>
      </div>
    </main>
  );
}
