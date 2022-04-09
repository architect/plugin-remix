import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
};

export const loader: LoaderFunction = async () => {
  const data: IndexData = {
    resources: [
      {
        name: "Remix Docs",
        url: "https://remix.run/docs",
      },
      {
        name: "Architect Docs",
        url: "https://arc.codes",
      },
      {
        name: "Remix Discord",
        url: "https://discord.gg/VBePs6d",
      },
      {
        name: "Architect Discord",
        url: "https://discord.gg/y5A2eTsCRX",
      }
    ],
  };

  return json(data);
};

export const meta: MetaFunction = () => {
  return {
    title: "Architect + Remix Starter",
    description: "Welcome to Arc + Remix",
  };
};

export default function Index() {
  const data = useLoaderData<IndexData>();

  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Remix!</h2>
        <h3>Running on Architect</h3>
        <p>We're stoked that you're here. 🥳</p>
        <p>
          Feel free to take a look around the code to see how Remix does things, it might be a bit
          different than what you're used to. When you're ready to dive deeper, we've got plenty of
          resources to get you up-and-running quickly.
        </p>
        <section>
          <h3>Resources</h3>
          <ul>
            {data.resources.map((resource) => (
              <li key={resource.url} className="remix__page__resource">
                <a href={resource.url}>{resource.name}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
