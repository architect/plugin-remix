import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/simpledotcss/simple.min.css',
    },
    {
      rel: 'icon',
      href: '/_static/favicon.ico',
    },
  ];
};

export const meta = () => {
  return { title: 'New Remix App' };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
