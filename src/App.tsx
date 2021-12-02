import { useEffect, useState } from "react";
import "./App.css";

function useStatus() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const evtSource = new EventSource("/status");
    evtSource.onopen = function (e) {
      setLoading(false);
      console.log("opened: ", e);
    };
    evtSource.onmessage = function (e) {
      setStatus(e.data);
    };
    evtSource.onerror = function (e) {
      setError("An error happened.");
      console.log("error: ", e);
    };
    return () => evtSource.close();
  });
  return {
    status,
    loading,
    error,
  };
}

function DataInjector() {
  const { status, loading, error } = useStatus();

  return (
    <div>
      {error.length > 0 ?? <p>{error}</p>}
      <App status={status} />
    </div>
  )
}

function App(props: { status: string }) {

  const [value, setValue] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: value }),
    });
    console.log("POST completed");
  };

  return (
    <div className="App font-extralight">
      <form action="/status" method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="status"
          name="status"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-2 border-black"
        />
        <button type="submit" className="p-2 border-1 border-black">submit</button>
      </form>
    </div>
  );
}

export default DataInjector;
