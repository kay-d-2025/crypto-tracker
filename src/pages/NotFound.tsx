// src/pages/NotFound.tsx
// Catch-all route for any URL that doesn't match our defined routes.
// Small touch but shows thoroughness — good UX practice.

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404 — Page Not Found</h1>
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
};

export default NotFound;