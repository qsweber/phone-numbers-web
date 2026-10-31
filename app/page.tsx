"use client";

import { FormEvent, useState } from "react";
import { getMatch } from "../lib/api/client";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await getMatch(input);
      setResult(res.match);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Phone Numbers</h1>
      <p>
        Enter your phone number to get a memorable, alphanumeric representation
        of it.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          aria-label="Phone number"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" disabled={isLoading || input.trim() === ""}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {result !== null && <p data-testid="result">{result}</p>}
      {error !== null && (
        <p data-testid="error" className="error">
          {error}
        </p>
      )}
    </main>
  );
}
