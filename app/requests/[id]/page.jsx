import Requests from "./requests";

export default function Page({ params }) {
  return (
    <div>
      <Requests params={params} />
    </div>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: params.id,
  };
}
