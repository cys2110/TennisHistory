// [TODO]
// Styling

export default function Loading({ loading, none }) {
  if (loading) {
    return <div className="text-zinc-400 text-2xl">Loading...</div>;
  }
  return <div className="text-zinc-400 text-2xl">{none}</div>;
}
