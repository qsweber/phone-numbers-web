import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <p>Nothing to see here!</p>
      <p>
        <Link href="/">Go to the home page</Link>
      </p>
    </main>
  );
}
