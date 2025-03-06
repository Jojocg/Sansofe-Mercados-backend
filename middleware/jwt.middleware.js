const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

const isAdmin = (req, res, next) => {
  // Este middleware debe usarse después del middleware isAuthenticated
  // que añade req.payload con la información del usuario
  
  if (req.payload && req.payload.role === 'admin') {
      next(); // El usuario es admin, permitir acceso
  } else {
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  isAdmin
};
