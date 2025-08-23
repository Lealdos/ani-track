
import {GraphQLClient } from 'graphql-request'

export const API_BASE_URL = 'https://api.jikan.moe/v4'

export const ANILIST_API_GRAPHQL = 'https://graphql.anilist.co'

export const AniListClient = new GraphQLClient(ANILIST_API_GRAPHQL)
