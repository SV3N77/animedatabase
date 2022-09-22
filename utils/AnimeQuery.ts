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
    coverImage?: {
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
  relationships: {
    genres: {
      links: {
        self: string;
        related: string;
      };
    };
    categories: {
      links: {
        self: string;
        related: string;
      };
    };
    castings: {
      links: {
        self: string;
        related: string;
      };
    };
    installments: {
      links: {
        self: string;
        related: string;
      };
    };
    mappings: {
      links: {
        self: string;
        related: string;
      };
    };
    reviews: {
      links: {
        self: string;
        related: string;
      };
    };
    mediaRelationships: {
      links: {
        self: string;
        related: string;
      };
    };
    characters: {
      links: {
        self: string;
        related: string;
      };
    };
    staff: {
      links: {
        self: string;
        related: string;
      };
    };
    productions: {
      links: {
        self: string;
        related: string;
      };
    };
    quotes: {
      links: {
        self: string;
        related: string;
      };
    };
    episodes: {
      links: {
        self: string;
        related: string;
      };
    };
    streamingLinks: {
      links: {
        self: string;
        related: string;
      };
    };
    animeProductions: {
      links: {
        self: string;
        related: string;
      };
    };
    animeCharacters: {
      links: {
        self: string;
        related: string;
      };
    };
    animeStaff: {
      links: {
        self: string;
        related: string;
      };
    };
  };
  categoriesArray: Categories[];
};

export type Categories = {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: {
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    totalMediaCount: number;
    slug: string;
    nsfw: boolean;
    childCount: number;
  };
  relationships: {
    parent: {
      links: {
        self: string;
        related: string;
      };
    };
    anime: {
      links: {
        self: string;
        related: string;
      };
    };
    drama: {
      links: {
        self: string;
        related: string;
      };
    };
    manga: {
      links: {
        self: string;
        related: string;
      };
    };
  };
};

export type Character = {
  id: string;
  type: string;
  links: {
    self: string;
  };
  attributes: {
    createdAt: string;
    updatedAt: string;
    slug: string;
    names: {
      en: string;
      ja_jp: string;
    };
    canonicalName: string;
    otherNames: Array<string>;
    name: string;
    malId: number;
    description: string;
    image: {
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
  };
  relationships: {
    primaryMedia: {
      links: {
        self: string;
        related: string;
      };
    };
    castings: {
      links: {
        self: string;
        related: string;
      };
    };
    mediaCharacters: {
      links: {
        self: string;
        related: string;
      };
    };
    quotes: {
      links: {
        self: string;
        related: string;
      };
    };
  };
};

export type Links = {
  first: string;
  next: string;
  last: string;
  prev: string;
};

export type MoreCharacters = {
  characters: Character[];
  links: Links;
};

export type MoreFranchises = {
  franchises: AnimeQuery[];
  links: Links;
};
