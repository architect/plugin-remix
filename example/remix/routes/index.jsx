import { useLoaderData, json } from 'remix';

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export const loader = async () => {
  const data = {
    resources: [
      {
        name: 'Remix Docs',
        url: 'https://remix.run/docs',
      },
      {
        name: 'React Router Docs',
        url: 'https://reactrouter.com/docs',
      },
      {
        name: 'Remix Discord',
        url: 'https://discord.gg/VBePs6d',
      },
    ],
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export const meta = () => {
  return {
    title: 'Architect Remix Starter',
    description: 'Welcome to remix',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const data = useLoaderData();

  return (
    <div className="remix__page">
      <main>
        <h1>Welcome to Remix!</h1>
        <h2>Running on Architect</h2>
        <p>We're stoked that you're here. 🥳</p>
        <p>
          Feel free to take a look around the code to see how Remix does things, it might be a bit
          different than what you're used to. When you're ready to dive deeper, we've got plenty of
          resources to get you up-and-running quickly.
        </p>
      </main>
      <aside>
        <h2>Resources</h2>
        <ul>
          {data.resources.map((resource) => (
            <li key={resource.url} className="remix__page__resource">
              <a href={resource.url}>{resource.name}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
