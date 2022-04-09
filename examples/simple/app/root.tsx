import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/simpledotcss/simple.min.css",
    },
    {
      rel: "icon",
      href: "/_static/favicon.ico",
    },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: "New Remix App",
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
  };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
