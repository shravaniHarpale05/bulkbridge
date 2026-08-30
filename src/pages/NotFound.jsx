import React from "react";import{Link}from"react-router-dom";import"../styles/NotFound.css";
export default function NotFound(){return <div className="not-found"><div>404</div><h1>Page not found</h1><p>The page you are looking for doesn't exist or has moved.</p><Link to="/">Back to BulkBridge</Link></div>}
