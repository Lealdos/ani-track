/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request'
import { AniListClient } from '@/config/const' 

export interface AnimeTitle {
    romaji: string;
    english?: string;
  }
  
  export interface AnimeCoverImage {
    large: string;
  }
  
  export interface AnimeMedia {
    id: number;
    title: AnimeTitle;
    coverImage: AnimeCoverImage;
    siteUrl: string;
  }
  
  export interface AiringSchedule {
    episode: number;
    airingAt: number; // Unix timestamp en segundos
    media: AnimeMedia;
  }
  
  export interface EpisodeInfo {
    title: string;
    episode: number;
    airedAt?: Date; // Para emitidos
    airsAt?: Date; // Para próximos
    image: string;
    url: string;
  }
  
  
  // 🔹 next episodes to release (upcoming) 
  export async function getUpcomingEpisodes(): Promise<EpisodeInfo[]> {
    const query = gql`
      query {
        Page(perPage: 10) {
          airingSchedules(sort: TIME_ASC, notYetAired: true) {
            episode
            airingAt
            media {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              siteUrl
            }
          }
        }
      }
    `;
  
    const data = await AniListClient.request<{ Page: { airingSchedules: AiringSchedule[] } }>(query);
  
    return data.Page.airingSchedules.map(ep => ({
      title: ep.media.title.english || ep.media.title.romaji,
      episode: ep.episode,
      airsAt: new Date(ep.airingAt * 1000),
      image: ep.media.coverImage.large,
      url: ep.media.siteUrl,
    }));
  }


  export async function getCurrentSeasonLatestEpisodes(): Promise<EpisodeInfo[]> {
    const now = new Date();
    const year = now.getFullYear();
  
    // AniList seasons: WINTER, SPRING, SUMMER, FALL
    const seasonMap = [ "WINTER", "SPRING", "SUMMER", "FALL" ] as const;
    const season = seasonMap[Math.floor(now.getMonth() / 3)];
  
    const query = gql`
      query ($season: MediaSeason, $seasonYear: Int) {
        Page(perPage: 50) {
          media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            siteUrl
            nextAiringEpisode {
              episode
              airingAt
            }
            episodes
          }
        }
      }
    `;
  
    const variables = { season, seasonYear: year };
  
    const data = await AniListClient.request<{ Page: { media: any[] } }>(query, variables);
  
    return data.Page.media.map(anime => {
      const lastEp = anime.nextAiringEpisode
        ? anime.nextAiringEpisode.episode - 1
        : anime.episodes; // si ya terminó la temporada
  
      return {
        title: anime.title.english || anime.title.romaji,
        episode: lastEp,
        airedAt: anime.nextAiringEpisode
          ? new Date((anime.nextAiringEpisode.airingAt - 7 * 24 * 60 * 60) * 1000) // fecha estimada del anterior
          : undefined,
        image: anime.coverImage.large,
        url: anime.siteUrl,
      };
    });
  }


  export async function getSeasonEpisodes(
    type: 'latest' | 'upcoming'
  ): Promise<EpisodeInfo[]> {
    const now = new Date();
    const year = now.getFullYear();
  
    const seasonMap = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;
    const season = seasonMap[Math.floor(now.getMonth() / 3)];
  
    const query = gql`
      query ($season: MediaSeason, $seasonYear: Int) {
        Page(perPage: 25) {
          media(
            season: $season
            seasonYear: $seasonYear
            type: ANIME
            sort: POPULARITY_DESC
          ) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            siteUrl
            nextAiringEpisode {
              episode
              airingAt
            }
          }
        }
      }
    `;
  
    const variables = { season, seasonYear: year };
  
    const data = await AniListClient.request<{ Page: { media: any[] } }>(query, variables);
  
    if (type === 'latest') {
      // Últimos episodios emitidos
      return data.Page.media
        .filter(anime => anime.nextAiringEpisode && anime.nextAiringEpisode.episode > 1)
        .map(anime => {
          const next = anime.nextAiringEpisode;
          const lastEpisode = next.episode - 1;
          const date = new Date(next.airingAt * 1000 - 7 * 24 * 60 * 60 * 1000);
          return {
            title: anime.title.english || anime.title.romaji,
            episode: lastEpisode,
            date,
            image: anime.coverImage.large,
            url: anime.siteUrl,
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // más reciente primero
    } else {
      // Próximos episodios por salir
      return data.Page.media
        .filter(anime => anime.nextAiringEpisode)
        .map(anime => {
          const next = anime.nextAiringEpisode;
          const date = new Date(next.airingAt * 1000);
          return {
            title: anime.title.english || anime.title.romaji,
            episode: next.episode,
            date,
            image: anime.coverImage.large,
            url: anime.siteUrl,
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()); // más cercano primero
    }
  }