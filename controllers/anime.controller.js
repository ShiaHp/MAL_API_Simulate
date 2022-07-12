const _Anime = require("../models/Anime/anime.model");
const _Episode = require("../models/Anime/epsisode.model");

const {
  addEpisode,
  addNewAnime,
  findAllEpisodeOfAnime,
  findExactEpisodesOnAired,
  findEpisodeBySearchName,
  findAllAnimeBySearchName
} = require("../services/anime.services");

function dateIsValid(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateStr.match(regex) === null) {
    return false;
  }

  const date = new Date(dateStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateStr);
}

module.exports = {
  addEpisode: async (req, res, next) => {
    try {
      const { code, message, elements } = await addEpisode(req.body);
      res.status(code).json({
        message: message,
        elements,
      });
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  addNewAnime: async (req, res, next) => {
    try {
      const { code, message, elements } = await addNewAnime(req.body);
      res.status(code).json({
        message: message,
        elements,
      });
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  findAllEpisodeOfAnime: async (req, res, next) => {
    try {
      const { id } = req.query;

      const { code, message, elements } = await findAllEpisodeOfAnime({ id });
      res.status(code).json({
        message: message,
        elements,
      });
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  findExactEpisodesOnAired: async (req, res, next) => {
    try {
      const { date } = req.body;
      const isValid = dateIsValid(date);
      if (!isValid) {
        res.status(401).json({ message: "Invalid date" });
      }
      if (isValid) {
        const { code, message, elements } = await findExactEpisodesOnAired({
          date,
        });
        res.status(code).json({
          message: message,
          elements,
        });
      }
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  findEpisodeBySearchName : async ( req, res, next ) => {
      try {
          const { search} = req.body;
          const {code, message, elements} = await findEpisodeBySearchName({search})
          res.status(code).json({
              message: message,
              elements: elements
          })
      } catch (error) {
        res.status(501).json({ message: error.message });
      }
  },
  findAllAnimeBySearchName : async(req,res,next) =>{
    try {
        const { search} = req.body;
        const {code, message, elements} = await findAllAnimeBySearchName({search})
        res.status(code).json({
            message: message,
            elements: elements
        })
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  }
};
