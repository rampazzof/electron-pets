import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await window.ipcRender.invoke("DB:reservation:insert", {
        startDate: "2023-03-06",
        endDate: "2023-03-19",
        customerName: "federico",
        petName: "pippi",
      });
      const data = await window.ipcRender.invoke("DB:reservation:findAll");
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
