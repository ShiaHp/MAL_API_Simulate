const _Anime = require("../models/Anime/anime.model");
const _Episode = require("../models/Anime/epsisode.model");

module.exports = {
  addEpisode: async (info) => {
    try {
      const { animeId } = info;
      if (!animeId) {
        throw new Error("Please provide anime id");
      }
      const newEpisodes = await _Episode.create(info);
      const addEpisodeToAnime = await _Anime.findByIdAndUpdate(
        { _id: newEpisodes.animeId },
        { $push: { episodeId: newEpisodes._id } },
        { new: true }
      );
      if (!addEpisodeToAnime) {
        throw new Error("Please provide anime id");
      }
      return {
        code: 201,
        message: "Adding new episode successfully added to",
        elements: newEpisodes,
      };
    } catch (error) {
      return {
        code: 501,
        message: "Errors",
        elements: 0,
      };
    }
  },
  addNewAnime: async (info) => {
    try {

      const newAnime = await _Anime.create(info);

      return {
        code: 201,
        message: "Adding new episode successfully added to",
        elements: newAnime,
      };
    } catch (error) {
      return {
        code: 501,
        message: "Errors",
        elements: 0,
      };
    }
  },
  findAllEpisodeOfAnime : async({id}) =>{
      try {
          const allEpisodes = await _Anime.findById({_id  :id}).populate("episodeId")
          return {
            code: 200,
            message: 'all episode of Anime ',
            elements: allEpisodes,
          };
      } catch (error) {
        return {
            code: 501,
            message: "Errors",
            elements: 0,
          };
      }
  },
  findExactEpisodesOnAired : async({date}) =>{
        try {
            const AllEpisodes = await _Episode.find({aired : date})

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
  findEpisodeBySearchName : async({search}) =>{
      try {
          const AllEpisodes  = await _Episode.find({$text : {$search  : search}});
          return {
            code: 200,
            message: "All episode match that search",
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
  findAllAnimeBySearchName : async({search}) =>{
    try {
        const AllAnime  = await _Anime.find({$text : {$search  : search}});
        if(AllAnime.length === 0){
            return {
                code: 401,
                message: "Don't have anime match that search",
                elements: 0,
              };
        }
        return {
          code: 200,
          message: "All anime match that search",
          elements: AllAnime,
        };
    } catch (error) {
      return {
          code: 501,
          message: "Errors",
          elements: 0,
        };
    }
  }
};
