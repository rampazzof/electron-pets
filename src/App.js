import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await window.ipcRender.invoke("DB:getAll");
      setData(data);
    };
    getData();
  }, []);

  return (
    <>
      <h1>PROVA</h1>
      <span>{JSON.stringify(data)}</span>
    </>
  );
};

export default App;
