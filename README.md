# keycloak-rest-api-frontend

This React application integrates with Keycloak for authentication, using JWT tokens for secure access to Spring Boot backend services through RESTful APIs. It ensures that only authenticated users can access protected resources, handling login, logout, and role-based access control to manage API requests and data responses.

## Features

- Built with JavaScript and React
- Integration with Keycloak for JWT authentication
- Secure communication with Spring Boot backend services

## Before running the app, ensure you have the following installed:

- Node.js
- npm
- Keycloak instance (you should have your own Keycloak server running)
- PostgreSQL or SQL database (configured for your backend)

## Update Navbar.js with your KeyCloak realm login and logout URL-s

```
login window.location.href // Replace with your realm login URL
logout window.location.href // Replace with your realm logout URL
```

## Update Keycloak.js with KeyCloak initialization configuration:

```
URL // Replace with your keycloak server endpoint
realm // Replace with your KeyCloak realm name
clientId // Replace with your KeyCloak client ID
```
