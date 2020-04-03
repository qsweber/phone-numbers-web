import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import fetch from "isomorphic-unfetch";

const mainStyle = {
  fontSize: "18px",
  fontFamily: "Work Sans",
  fontWeight: 400,
  lineHeight: "24px",
  maxWidth: "750px",
  width: "100%",
  margin: "0 auto",
  marginTop: "40px",
};

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  return (
    <div style={mainStyle}>
      <Head>
        <title>{"Phone Numbers"}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css?family=Work+Sans"
          rel="stylesheet"
        ></link>
      </Head>
      <h1>Phone Numbers</h1>
      <p>
        Enter your phone number to get a memorable, alphanumeric representation
        of it.
      </p>
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <input
        type="submit"
        value="Submit"
        onClick={async (event) => {
          setResult(await getResult(input));
          event.preventDefault();
        }}
      />
      <p>{result}</p>
    </div>
  );
};

const getResult = async (phoneNumber: string): Promise<string | undefined> => {
  const res = await fetch(
    `https://tmia51806i.execute-api.us-west-2.amazonaws.com/production/api/v0/match?value=${phoneNumber}`
  );
  const data = await res.json();

  return data.match;
};

export default Home;
