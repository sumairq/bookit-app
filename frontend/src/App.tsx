import { useEffect } from "react";
import { api } from "./api/axios";

function App() {
  useEffect(() => {
    api
      .get("/tours")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>Natours React Frontend</h1>;
}

export default App;
