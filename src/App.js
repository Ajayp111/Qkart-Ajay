import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Thanks from "./components/Thanks"
import Checkout from "./components/Checkout"
// import theme from "theme.js"
// import { ThemeProvider } from "@mui/material";
import React from "react"

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
  // endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path= '/login'>
         <Login />
        </Route>
        <Route path= '/register'>
         <Register />
        </Route>
        <Route exact path= '/'>
         <Products />
        </Route>

        <Route path= '/checkout'>
         <Checkout />
        </Route>
        <Route path= '/thanks'>
         <Thanks />
        </Route>

      </Switch>
         
    </div>
  );
}

export default App;
// import Register from "./components/Register";
// import ipConfig from "./ipConfig.json";
// import { Route, Switch } from "react-router-dom";
// import Login from "./components/Login";
// import Checkout from "./components/Checkout"
// import Thanks from "./components/Thanks"
// import Products from "./components/Products";
// import theme from "./theme.js"
// import { ThemeProvider } from "@mui/material";
// import React from "react"
// // import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

// export const config = {
//   endpoint:` http://${ipConfig.workspaceIp}:8082/api/v1`,
// };

// function App() {
//   return (
//     <div className="App">
//       {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
//           {/* <Register /> */}
//           <ThemeProvider theme={theme}>
//         <React.StrictMode>
//          <Switch>
              
//               <Route exact path="/">
//                 <Products />
//               </Route>

//               <Route exact path="/register">
//               <Register />
//               </Route>

//             <Route exact path="/login">
//             <Login />
//             </Route>
          
//             <Route path="/checkout">
//             <Checkout />
//           </Route>
//            <Route path="/thanks">
//               <Thanks/>
//            </Route>
//           </Switch>
//           </React.StrictMode>
//           </ThemeProvider>
//     </div>
//   );
// }

// export default App;
