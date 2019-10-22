import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "./firebase";
import moment from "moment";

function App() {
  const LIFE_EXPECTANCY_SEC = 10;
  const count = useSimultaneousConnectionCounter(LIFE_EXPECTANCY_SEC);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ようこそ!!!</h1>
        <p>
          <span className="App-emphasis">{count}人</span>
          が現在このページにアクセスしています
        </p>
        <p></p>
      </header>
    </div>
  );
}

export default App;

const useSimultaneousConnectionCounter = (lifeExpectancySec: number) => {
  const [state, setState] = useState({
    count: 0
  });

  // アクセスログのコレクション
  const collection = firebase
    .firestore()
    .collection("pages")
    .doc("top")
    .collection("accesses");

  // アクセスログにアクセス履歴を追加する
  const access = async (at: Date) => {
    await collection.add({ at });
  };

  // 指定した秒数のスパンでアクセスし続ける
  useEffect(() => {
    // 最初のアクセス
    access(new Date());

    // 最初のアクセス以降は指定した秒数でアクセスし続ける
    const interval = setInterval(() => {
      access(new Date());
    }, 1000 * lifeExpectancySec);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // 現在時刻から指定した秒数以内にアクセスしたユーザーを取得する
  useEffect(() => {
    const unsubscribe = collection.onSnapshot(async snapshot => {
      const currentDate = moment(new Date());
      const someSecondsBeforeCurrentDate = currentDate
        .subtract("seconds", lifeExpectancySec)
        .toDate();

      const doc = await snapshot.query
        .where("at", ">", someSecondsBeforeCurrentDate)
        .get();
      setState({ ...state, count: doc.size });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state.count;
};
