import { Suspense } from "react";

interface Friend {
  name: string;
}

async function getFriends(): Promise<Friend[]> {

  // console.log("HASURA_GRAPHQL_API_ENDPOINT:", process.env.HASURA_GRAPHQL_API_ENDPOINT);
  // console.log("HASURA_GRAPHQL_ADMIN_SECRET:", process.env.HASURA_GRAPHQL_ADMIN_SECRET);

  const res = await fetch(process.env.HASURA_GRAPHQL_API_ENDPOINT as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET as string,
    },
    body: JSON.stringify({
      query: `
        query {
          friend {
            name
          }
        }
      `,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const result = await res.json();
  //console.log("Hasura Result:", result);

  const data = result.data;
  // console.log("Hasura Result:", data);


  return result.data.friend || [];
}

export default async function Home() {
  const friends = await getFriends();

  return (
    <div>
      <h1>Friend List</h1>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <li key={index}>{friend.name}</li>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </ul>
    </div>
  );
}
