import Image from "next/image";
import { MOCK_CRAFT_STORIES } from "@/lib/mock-data";

export function CraftStoriesSection() {
  return (
    <section id="craft-stories" className="py-20 sm:py-28 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Di Sản Bàn Tay Nghệ Nhân
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-sans font-black text-stone-900 tracking-tight">
            Nghệ Thuật Thủ Công Hmong
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Mỗi hoa văn, mỗi đường kim mũi chỉ là một trang ký ức văn hóa sống động được truyền giữ qua hàng chục thế hệ.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_CRAFT_STORIES.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  {story.subtitle}
                </span>
                <h3 className="text-xl font-sans font-bold text-stone-900 mt-1 mb-3">
                  {story.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed flex-1">
                  {story.description}
                </p>

                <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 italic">
                  ✦ {story.authorNote}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default CraftStoriesSection;
