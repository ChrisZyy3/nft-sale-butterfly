import { ScreenHeader } from "@/components/layout/ScreenHeader";

const products = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: "Hash Butterfly tee",
  price: "$79.00",
}));

export default function MallPage() {
  return (
    <div className="pb-24 pt-2 md:pb-16">
      <ScreenHeader title="Mall" subtitle="Curated brand collaborations" />
      <section className="hb-container flex flex-col gap-6">
        <p className="text-sm leading-relaxed text-[#9ca3b0]">
          Explore limited releases, IRL collaborations and lifestyle products inspired by the Hash Butterfly universe.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map(item => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-[26px] border border-[#1f2432] bg-[#10131c] p-4 shadow-[0_36px_90px_-60px_rgba(32,255,109,0.4)]"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#1f2432] bg-gradient-to-br from-[#1a1f2c] via-[#141924] to-[#0f131d] pb-[65%]">
                <span className="absolute inset-4 rounded-xl border border-dashed border-[#20ff6d]/30" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white">{item.title}</span>
                  <span className="text-xs uppercase tracking-[0.35em] text-[#818898]">
                    Drop {item.id.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#20ff6d]">{item.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
