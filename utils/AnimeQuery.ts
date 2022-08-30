export type AnimeQuery = {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis: string;
    description: string;
    coverImageTopOffset: number;
    titles: {
      en: string;
      en_jp: string;
      ja_jp: string;
    };
    canonicalTitle: string;
    abbreviatedTitles: Array<string>;
    averageRating: string;
    userCount: number;
    favoritesCount: number;
    startDate: string;
    endDate: string;
    nextRelease: any;
    popularityRank: number;
    ratingRank: number;
    ageRating: string;
    ageRatingGuide: string;
    subtype: string;
    status: string;
    tba: any;
    posterImage: {
      tiny: string;
      large: string;
      small: string;
      medium: string;
      original: string;
      meta: {
        dimensions: {
          tiny: {
            width: number;
            height: number;
          };
          large: {
            width: number;
            height: number;
          };
          small: {
            width: number;
            height: number;
          };
          medium: {
            width: number;
            height: number;
          };
        };
      };
    };
    coverImage: {
      tiny: string;
      large: string;
      small: string;
      original: string;
      meta: {
        dimensions: {
          tiny: {
            width: number;
            height: number;
          };
          large: {
            width: number;
            height: number;
          };
          small: {
            width: number;
            height: number;
          };
        };
      };
    };
    episodeCount: number;
    episodeLength: number;
    totalLength: number;
    youtubeVideoId: string;
    showType: string;
    nsfw: boolean;
  };
};
