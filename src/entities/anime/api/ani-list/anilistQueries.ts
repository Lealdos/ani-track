export const GET_HOME_DATA_QUERY = `
query GetHomeData(
  $season: MediaSeason
  $seasonYear: Int
  $startOfDay: Int
  $endOfDay: Int
  $tag: String
) {
  currentSeason: Page(page: 1, perPage: 20) {
    media(
      season: $season
      seasonYear: $seasonYear
      type: ANIME
      sort: POPULARITY_DESC
      isAdult: false
    ) {
      id
      title { romaji english }
      coverImage { extraLarge large }
      format
      episodes
      status
      averageScore
      genres
      nextAiringEpisode { airingAt timeUntilAiring episode }
    }
  }

  airingToday: Page(page: 1, perPage: 20) {
    airingSchedules(
      airingAt_greater: $startOfDay
      airingAt_lesser: $endOfDay
      sort: TIME
    ) {
      id
      airingAt
      timeUntilAiring
      episode
      media {
        id
        title { romaji english }
        coverImage { extraLarge large }
        format
        episodes
        status
      }
    }
  }

  topAnime: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
      id
      title { romaji english }
      coverImage { extraLarge large }
      format
      episodes
      status
      averageScore
      genres
    }
  }

  tagAnime: Page(page: 1, perPage: 10) {
    media(type: ANIME, tag: $tag, sort: POPULARITY_DESC, isAdult: false) {
      id
      title { romaji english }
      coverImage { extraLarge large }
      format
      episodes
      averageScore
      genres
    }
  }
}`

const MEDIA_LIST_FIELDS = `
fragment MediaListFields on Media {
  id
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

export const ANIME_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
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
    characters(sort: [ROLE, RELEVANCE, ID], perPage: 25) {
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
    recommendations(perPage: 25, sort: RATING_DESC) {
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
