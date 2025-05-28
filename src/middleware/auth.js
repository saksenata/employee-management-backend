const DUMMY_AUTH_HEADER = 'X-Dummy-Auth';
const DUMMY_AUTH_VALUE = 'allowed';

const dummyAuthMiddleware = (req, res, next) => {
  const authHeaderValue = req.header(DUMMY_AUTH_HEADER);

  if (authHeaderValue && authHeaderValue === DUMMY_AUTH_VALUE) {
    console.log('Dummy authentication successful.');
    next();
  } else {
    console.log(`Dummy authentication failed. Header '${DUMMY_AUTH_HEADER}' was '${authHeaderValue}'. Expected '${DUMMY_AUTH_VALUE}'.`);
    res.status(401).json({ message: 'Unauthorized: Dummy authentication failed.' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  const userRole = req.header('X-Dummy-Role');
  if (userRole && roles.includes(userRole)) {
    console.log(`Dummy role check successful for role: ${userRole}`);
    next();
  } else {
    console.log(`Dummy role check failed. Role '${userRole}' not in allowed roles: ${roles.join(', ')}`);
    res.status(403).json({ message: 'Forbidden: Insufficient dummy role.' });
  }
};

module.exports = {
  dummyAuthMiddleware,
  checkRole,
};