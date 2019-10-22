import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const { count, increment, decrement } = useCounter();

  useEffect(() => {
    increment();
    return () => {
      decrement();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ようこそ!!!</h1>
        <p>
          現在
          <span className="App-emphasis">{count}人</span>
          のユーザーがこのページを閲覧しています
        </p>
      </header>
    </div>
  );
}

export default App;

const useCounter = () => {
  const [{ count }, setState] = useState({
    count: 0
  });

  const increment = () =>
    setState({
      count: count + 1
    });

  const decrement = () =>
    setState({
      count: count - 1
    });

  return { count, increment, decrement };
};
