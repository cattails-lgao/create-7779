export default function Welcome() {
  const content = Array(10)
    .fill(0)
    .map((_, index) => <div key={index}>{index}</div>);
  return <>{content}</>;
}
