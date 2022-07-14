const _Anime = require("../models/Anime/anime.model");
const _Episode = require("../models/Anime/epsisode.model");
const logger = require("../utils/log/index");
const _Season = require("../models/Anime/season.model");
module.exports = {
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
      console.log(info);
      const newAnime = await _Anime.create(info);
      console.log(newAnime);
       await _Season.findByIdAndUpdate(
        { _id: newAnime.Premiered },
        { $push: { animeIdOfSeason: newAnime._id } },
        { new: true }
      );
      return {
        code: 201,
        message: "Adding new episode successfully added to",
        elements: newAnime,
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
  }
  
} catch (error) {
  return {
    code: 501,
    message: error.message,
    elements: 0,
  };
}
   
 
 

  }
}
