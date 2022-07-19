const _Anime = require("../models/Anime/anime.model");
const _Episode = require("../models/Anime/epsisode.model");
const logger = require("../utils/log/index");
const redisClient = require("../utils/redis");
const _Season = require("../models/Anime/season.model");
module.exports = {
  getAnimeGenre: async ({ genre }) => {
    try {
      const genreArr = [
        "Action",
        "Adventure",
        "Cars",
        "Comedy",
        "AvantGarde",
        "Demons",
        "Mystery",
        "Drama",
        "Ecchi",
        "Fantasy",
        "Game",
        "Hentai",
        "Historical",
        "Horror",
        "Kids",
        "MartialArts",
        "Mecha",
        "Music",
        "Parody",
        "Samurai",
        "Romance",
        "School",
        "SciFi",
        "Shoujo",
        "Girls love",
        "Shounen",
        "Boys love",
        "Space",
        "Sports",
        "SuperPower",
        "Vampire",
        "Harem",
        "Slice of Life",
        "Supernatural",
        "Military",
        "Police",
        "Psychological",
        "Suspense",
        "Seinen",
        "Josei",
        "Award winning",
        "Gourmet",
        "Work life",
        "Erotica",
      ];

      const checkGenre = genreArr.indexOf(genre);
      if (checkGenre >= 0) {
        const animeOfGenres = await _Anime.find({ Genres: { $all: [genre] } });

        return {
          code: 200,
          message: "Anime found with that genre",
          elements: animeOfGenres,
        };
      } else {
        return {
          code: 401,
          message: "Invalid Genres ",
          elements: 0,
        };
      }
    } catch (e) {
      return {
        code: 401,
        message: e.message,
        elements: 0,
      };
    }
  },
  getAnime: async ({ slug }) => {
    try {
      const anime = await _Anime.findOne({ slug: slug });
      if (!anime) {
        return {
          code: 401,
          message: "Anime not found successfully ",
          elements: 0,
        };
      }
      return {
        code: 200,
        message: "Anime found successfully ",
        elements: [anime],
      };
    } catch (e) {
      res.status(404).send(e);
    }
  },
  addEpisode: async (info) => {
    try {
      const { animeId, episode } = info;
      if (!animeId) {
        return {
          code: 401,
          message: "Provide anime id",
          elements: 0,
        };
      }

      const oldEpisodes = await _Episode.find({ animeId: animeId });

      if (
        oldEpisodes.length > 0 &&
        oldEpisodes[oldEpisodes.length - 1].episode === episode
      ) {
        return {
          code: 401,
          message: "Episode already exists ",
          elements: 0,
        };
      }

      const newEpisodes = await _Episode.create(info);
      const addEpisodeToAnime = await _Anime.findByIdAndUpdate(
        { _id: newEpisodes.animeId },
        { $push: { episodeId: newEpisodes._id } },
        { new: true }
      );
      return {
        code: 201,
        message: "Adding new episode successfully added to",
        elements: newEpisodes,
      };
    } catch (error) {
      return {
        code: 501,
        message: error.message,
        elements: 0,
      };
    }
  },
  addNewAnime: async (info) => {
    try {
      let anime = new _Anime({
        titleEng: info[0].titleEng,
        image: info[1],
        alternativeTitle: info[0].alternativeTitle,
        Synopsis: info[0].Synopsis,
        Background: info[0].Background,
        rating: info[0].Rating,
        ratingValue: info[0].RatingValue,
        ratingAvg: info[0].Rating,
        Type: info[0].Type,
        Status: info[0].Status,
        Broadcast: info[0].Broadcast,
        Source: info[0].Source,
        Genres: info[0].Genres,
        Duration: info[0].Duration,
        openingTheme: info[0].openingTheme,
        endingTheme: info[0].endingTheme,
        startDate: info[0].startDate,
        endDate: info[0].endDate,
        Rated: info[0].Rated,
        Premiered: info[0].Premiered,
        episodes: info[0].episodes,
        StreamingPlatforms: info[0].StreamingPlatforms,
      });
      await anime.save();

      await _Season.findByIdAndUpdate(
        { _id: anime.Premiered },
        { $push: { animeIdOfSeason: anime._id } },
        { new: true }
      );
      return {
        code: 201,
        message: "Adding new episode successfully added to",
        elements: anime,
      };
    } catch (error) {
      return {
        code: 501,
        message: error.message,
        elements: 0,
      };
    }
  },
  findAllEpisodeOfAnime: async ({ id, pageSize, episode, allOfEpisode }) => {
    try {
      if (allOfEpisode <= 12) {
        const allEpisodes = await _Anime
          .findById({ _id: id })
          .populate({ path: "episodeId", options: { sort: { episode: 1 } } });

        return {
          code: 200,
          message: "all episode of Anime ",
          elements: allEpisodes,
        };
      } else {
        // phân trang
        // nếu số tập vượt quá 12 tập thì mỗi lần load sẽ tải thêm 12 tập nữa

        const allEpisodes = await _Episode
          .find({
            animeId: id,
            episode: { $gte: episode },
          })
          .limit(pageSize)
          .sort({ episode: 1 });

        return {
          code: 200,
          message: "all episode of Anime",
          elements: allEpisodes,
        };
      }
    } catch (error) {
      return {
        code: 501,
        message: error.message,
        elements: 0,
      };
    }
  },
  findExactEpisodesOnAired: async ({ date }) => {
    try {
      const AllEpisodes = await _Episode.find({ aired: date });

      return {
        code: 200,
        message: "All episode Aired on this day",
        elements: AllEpisodes,
      };
    } catch (error) {
      return {
        code: 501,
        message: "Errors",
        elements: 0,
      };
    }
  },
  findBySearchName: async (search, _Model) => {
    try {
      if (!_Model || !search)
        return {
          code: 404,
          message: "Please enter a search name and try again",
          elements: 0,
        };

      const resultOfSearch = await _Model.find({
        $text: { $search: search },
      });

      return {
        code: 200,
        message: `All result match that search`,
        elements: { resultOfSearch },
      };
    } catch (error) {
      return {
        code: 501,
        message: error.message,
        elements: 0,
      };
    }
  },
  advanceSearch: async (
    Rated,
    Status,
    Genres,
    startDate,
    endDate,
    excludeGenres,
    page,
    pageSize
  ) => {
    try {
      const queryObject = {};

      if (Rated && Rated !== null) {
        queryObject.Rated = Rated;
      }
      if (Status && Status !== null) {
        queryObject.Status = Status;
      }
      if (Genres && Genres !== null) {
        queryObject.Genres = Genres;
      }

      const timeStart = new Date(startDate);
      const timeEnd = new Date(endDate);

      if (startDate && endDate) {
        const foundAnime = await _Anime
          .find({
            $and: [
              { startDate: { $gte: timeStart } },
              { endDate: { $lte: timeEnd } },
              { queryObject: queryObject },
            ],
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        if (!foundAnime) {
          return {
            code: 400,
            message: "Failed to find anime",
            elements: 0,
          };
        }
        return {
          code: 200,
          message: "Success",
          elements: foundAnime,
        };
      } else {
        // $or: [
        //   { Genres: { $all: Genres }, Rated: "PG-children", Status: Status },
        // ],
        const foundAnime = await _Anime
          .find({
            $and: [
              queryObject,
              {
                Genres: { $ne: excludeGenres },
              },
            ],
          })
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        if (!foundAnime) {
          return {
            code: 400,
            message: "Failed to find anime",
            elements: 0,
          };
        }

        return {
          code: 200,
          message: "Success",
          elements: foundAnime,
        };
      }
    } catch (e) {
      return {
        code: 401,
        message: e.message,
        elements: 0,
      };
    }
  },
};
