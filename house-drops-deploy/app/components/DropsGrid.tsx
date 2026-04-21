import DropCard from "./DropCard";
import { publishedDrops } from "../data/published-drops";

export default function DropsGrid() {
  const drops = publishedDrops.filter((d) => !d.hidden);

  if (drops.length === 0) return null;

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drops.map((d) => (
          <DropCard
            key={d.id}
            title={d.title}
            description={d.description}
            standout={d.standout}
            href={`/drops/user/${d.id}`}
          />
        ))}
      </div>
    </section>
  );
}
