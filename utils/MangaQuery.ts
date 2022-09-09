export type MangaQuery = {
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
    };
    canonicalTitle: string;
    abbreviatedTitles: Array<any>;
    averageRating: string;
    ratingFrequencies: {
      "2": string;
      "3": string;
      "4": string;
      "5": string;
      "6": string;
      "7": string;
      "8": string;
      "9": string;
      "10": string;
      "11": string;
      "12": string;
      "13": string;
      "14": string;
      "15": string;
      "16": string;
      "17": string;
      "18": string;
      "19": string;
      "20": string;
    };
    userCount: number;
    favoritesCount: number;
    startDate: string;
    endDate: string;
    nextRelease: any;
    popularityRank: number;
    ratingRank: number;
    ageRating: any;
    ageRatingGuide: string;
    subtype: string;
    status: string;
    tba: string;
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
    coverImage: any;
    chapterCount: number;
    volumeCount: number;
    serialization: string;
    mangaType: string;
  };
  relationships: {
    genres: {
      links: {
        self: string;
        related: string;
      };
      data: Array<{
        type: string;
        id: string;
      }>;
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
    chapters: {
      links: {
        self: string;
        related: string;
      };
    };
    mangaCharacters: {
      links: {
        self: string;
        related: string;
      };
    };
    mangaStaff: {
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
