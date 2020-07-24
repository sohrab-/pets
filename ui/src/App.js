import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <form action="/pets" method="post">
        <input type="text" id="pet" name="pet" value="Cat" /> Or
        <input type="file" id="image" name="image" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
