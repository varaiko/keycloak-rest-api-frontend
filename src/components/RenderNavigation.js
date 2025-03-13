import { Route, Routes } from "react-router-dom";
import { AuthData } from "../auth/AuthWrapper";
import { nav } from "./navigation";


export const RenderRoutes = () => {

     const { user } = AuthData();

     if (user === undefined) {
          return;
     }

     return (
          <Routes>
               { nav.map((r, i) => {
                    if (r.isPrivate && user.isAuthenticated) {
                         return <Route key={i} path={r.path} element={r.element}/>
                    } else if (!r.isPrivate) {
                         return <Route key={i} path={r.path} element={r.element}/>
                    } else return false;
               })}
          </Routes>
     )
}