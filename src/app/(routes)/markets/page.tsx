import { MarketGraphics } from "./components/marketsGraphics";

export default function MarketsPage() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">Markets</h2>
      <p className="mt-2 text-gray-600">Trending coins and market movers.</p>
      <MarketGraphics />
    </section>
  );
}
