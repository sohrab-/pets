import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Results from "./Results";
import About from "./About";
import "./App.css";

const App = () => (
  <Router>
    <Switch>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/results">
        <Results />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
