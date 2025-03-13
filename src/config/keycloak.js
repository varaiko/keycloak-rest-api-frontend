import Keycloak from "keycloak-js";

export default new Keycloak({
    url: '<keycloak_url>',
    realm: '<keycloak_realm>',
    clientId: '<keycloak_client_id>',
});