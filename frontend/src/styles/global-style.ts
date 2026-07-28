"use client";

import { createGlobalStyle } from "styled-components";

// Base reset + document styling (replaces globals.css).
export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #1a1a2e;
    background: #f5f6fa;
  }

  a { color: inherit; text-decoration: none; }

  button { font-family: inherit; }
`;
