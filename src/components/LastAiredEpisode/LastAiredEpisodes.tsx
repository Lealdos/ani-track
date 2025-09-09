import { getSeasonEpisodes } from "@/services/AniList/Graphql/NewEpisode";

/* eslint-disable @next/next/no-img-element */
export async function LastAiredEpisodes() {
    const recent = await getSeasonEpisodes('latest');
  
    return (
      <div className="p-4">
        <ul className="grid grid-cols-2 justify-items-center gap-4 px-4 py-4 sm:grid-cols-3 md:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
          {recent.map(ep => (
            <li key={ep.url}>
              <img src={ep.image} className="w-20 h-28 object-cover" alt={`${ep.title}`} />

              {ep.title} - Episode {ep.episode}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  