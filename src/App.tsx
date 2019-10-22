import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "./firebase";

function App() {
  const count = useCountIncrementer();

  return (
    <div className="App">
      <header className="App-header">
        <h1>ようこそ!!!</h1>
        <p>
          <span className="App-emphasis">{count}人</span>
          がここに来ました。
        </p>
        <p></p>
      </header>
    </div>
  );
}

export default App;

const useCountIncrementer = () => {
  const [state, setState] = useState({
    count: 0
  });

  const document = firebase
    .firestore()
    .collection("pages")
    .doc("top");

  const increment = async () => {
    const snapshot = await document.get();
    const data = snapshot.data();
    if (data) {
      await document.set({
        count: data.count + 1
      });
    }
  };

  useEffect(() => {
    increment();

    const unsubscribe = document.onSnapshot(doc => {
      if (doc.exists) {
        const count: number = doc.get("count");
        setState({ count });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state.count;
};
