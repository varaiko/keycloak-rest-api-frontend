import { createContext, useContext, useEffect, useState } from "react"
import { RenderRoutes } from "../components/RenderNavigation";
import keycloak from "../config/keycloak";
import AppNavbar from "../components/Navbar";

const userIntialState = {
  name: "",
  isAuthenticated: false
};
const AuthContext = createContext(userIntialState);
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {

  const [ user, setUser ] = useState(userIntialState)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    keycloak.init({
      onLoad: 'check-sso', // Supported values: 'check-sso' , 'login-required']
      checkLoginIframe: true,
      pkceMethod: 'S256'
    }).then((auth) => {
      if (!auth) {
        setUser({...user, isAuthenticated: false})
        setLoading(false)
      } else {
        setUser({name: keycloak.idTokenParsed.preferred_username, isAuthenticated: auth, idToken: keycloak.idToken, roles: keycloak.resourceAccess["alibou-rest-api"].roles, token: keycloak.token })
        setLoading(false);
      }
      },
      () => {
        setLoading(false);
      }
    ).catch((error) => {
        setError("Error occured during keycloak initialization")
        setLoading(false);
      });
    }, []);

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (error) {
    return (
      <div>{error}</div>
    )
  }

  return (
    <AuthContext.Provider value={{user}}>
      <AppNavbar />
      <RenderRoutes />
    </AuthContext.Provider> 
  )

}