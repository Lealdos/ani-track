export const GET_HOME_DATA_QUERY = `
query GetHomeData(
  $season: MediaSeason, 
  $seasonYear: Int, 
  $startOfDay: Int, 
  $endOfDay: Int
) {
  # 1. Animes de la temporada actual (ordenados por popularidad)
  currentSeason: Page(page: 1) {
    media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      episodes
      status
    }
  }

  # 2. Animes en emisión hoy (filtrados por timestamp de inicio y fin del día)
  airingToday: Page(page: 1, perPage: 15) {
    airingSchedules(airingAt_greater: $startOfDay, airingAt_lesser: $endOfDay, sort: TIME) {
      id
      airingAt           # Timestamp de la hora exacta de emisión
      timeUntilAiring    # Segundos faltantes para el episodio
      episode            # Número de episodio que se estrena
      media {
        id
        title {
          romaji
        }
        coverImage {
          medium
        }
      }
    }
  }

  # 3. Top 10 Animes histórico (ordenados por puntaje)
  topAnime: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: SCORE_DESC) {
      id
      title {
        romaji
      }
      averageScore
      coverImage {
        large
      }
    }
  }

  # 4. Animes según categoría (Ej. Seinen)
  # IMPORTANTE: En AniList "Action" o "Romance" son "genres", 
  # pero demografías como "Seinen" o "Shounen" son "tags".
  seinenAnime: Page(page: 1, perPage: 10) {
    media(type: ANIME, tag: "Seinen", sort: POPULARITY_DESC) {
      id
      title {
        romaji
      }
      genres
      tags {
        name
      }
      coverImage {
        large
      }
    }
  }
}`

const MEDIA_LIST_FIELDS = `
fragment MediaListFields on Media {
  id
  idMal
  title { romaji english native }
  synonyms
  format
  status
  episodes
  duration
  season
  seasonYear
  averageScore
  meanScore
  popularity
  coverImage { extraLarge large medium color }
  bannerImage
  description(asHtml: false)
  genres
  studios {
    nodes { id name siteUrl isAnimationStudio }
  }
  startDate { year month day }
  endDate { year month day }
  nextAiringEpisode { airingAt timeUntilAiring episode }
  trailer { id site thumbnail }
  externalLinks { id url site type }
  rankings { id rank type format year season allTime context }
}
`

export const BROWSE_QUERY = `
${MEDIA_LIST_FIELDS}
query (
  $page: Int,
  $perPage: Int,
  $search: String,
  $genre_in: [String],
  $status: MediaStatus,
  $format: MediaFormat,
  $sort: [MediaSort],
  $isAdult: Boolean
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total currentPage lastPage hasNextPage perPage
    }
    media(
      type: ANIME,
      search: $search,
      genre_in: $genre_in,
      status: $status,
      format: $format,
      sort: $sort,
      isAdult: $isAdult
    ) {
      ...MediaListFields
    }
  }
}
`

export const FIND_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    idMal
    title { romaji english native }
    synonyms
    format
    status
    episodes
    duration
    season
    seasonYear
    averageScore
    meanScore
    popularity
    coverImage { extraLarge large medium color }
    bannerImage
    description(asHtml: false)
    genres
    studios {
      nodes { id name siteUrl isAnimationStudio }
    }
    startDate { year month day }
    endDate { year month day }
    nextAiringEpisode { airingAt timeUntilAiring episode }
    trailer { id site thumbnail }
    externalLinks { id url site type }
    streamingEpisodes { title thumbnail url site }
    rankings { id rank type format year season allTime context }
    relations {
      edges {
        id
        relationType
        node {
          id
          title { romaji english }
          type
          format
          siteUrl
        }
      }
    }
  }
}
`

export const TOP_ANIME_QUERY = `
${MEDIA_LIST_FIELDS}
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total currentPage lastPage hasNextPage perPage
    }
    media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
      ...MediaListFields
    }
  }
}
`

export const SEASONAL_QUERY = `
${MEDIA_LIST_FIELDS}
query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total currentPage lastPage hasNextPage perPage
    }
    media(
      type: ANIME,
      season: $season,
      seasonYear: $seasonYear,
      status: RELEASING,
      sort: POPULARITY_DESC,
      isAdult: false
    ) {
      ...MediaListFields
    }
  }
}
`

export const BY_GENRE_QUERY = `
${MEDIA_LIST_FIELDS}
query ($genre: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total currentPage lastPage hasNextPage perPage
    }
    media(type: ANIME, genre: $genre, sort: POPULARITY_DESC, isAdult: false) {
      ...MediaListFields
    }
  }
}
`

export const AIRING_SCHEDULE_QUERY = `
${MEDIA_LIST_FIELDS}
query ($airingAtGreater: Int, $airingAtLesser: Int, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total currentPage lastPage hasNextPage perPage
    }
    airingSchedules(
      airingAt_greater: $airingAtGreater,
      airingAt_lesser: $airingAtLesser,
      sort: TIME
    ) {
      id
      airingAt
      episode
      media {
        ...MediaListFields
      }
    }
  }
}
`

export const CHARACTERS_QUERY = `
query ($id: Int, $page: Int, $perPage: Int) {
  Media(id: $id, type: ANIME) {
    characters(page: $page, perPage: $perPage, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name { full native userPreferred }
          image { large medium }
          siteUrl
        }
        voiceActors(language: JAPANESE) {
          id
          name { full native userPreferred }
          image { large medium }
          language
          siteUrl
        }
      }
    }
  }
}
`

export const RECOMMENDATIONS_QUERY = `
query ($id: Int, $page: Int, $perPage: Int) {
  Media(id: $id, type: ANIME) {
    recommendations(page: $page, perPage: $perPage, sort: RATING_DESC) {
      nodes {
        id
        mediaRecommendation {
          id
          title { romaji english }
          coverImage { extraLarge large medium }
          siteUrl
        }
      }
    }
  }
}
`

export const STREAMING_EPISODES_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    episodes
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
  }
}
`

export const GENRES_QUERY = `
query {
  GenreCollection
}
`
