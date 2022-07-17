const _Anime = require("../models/Anime/anime.model");
const _Episode = require("../models/Anime/epsisode.model");
const redisClient = require("../utils/redis");
const _Character = require("../models/Anime/character.model");
const _VoiceActor = require("../models/Anime/voiceActor.model");
const cloudinary = require("../utils/cloudinary");

const {
  addEpisode,
  addNewAnime,
  findAllEpisodeOfAnime,
  findExactEpisodesOnAired,
  findBySearchName,
  getAnime,
  getAnimeGenre,
  advanceSearch
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
  advanceSearch: async (req, res, next) => {
    try {
      const {Rated, Status , Genres , startDate, endDate , excludeGenres} = req.query
    
   


      const {code, message, elements}  = await  advanceSearch(Rated, Status  ,Genres,  startDate, endDate,excludeGenres);
      res.status(code).json({message, elements })
    } catch (e) {
      res.status(500).send({ message: "Error processing : " + e.message });
    }
  },

  
  getAnimeGenre: async (req, res, next) => {
    try {
      const { genre } = req.params;
      console.log(genre);
      const { code, message, elements } = await getAnimeGenre({ genre });
      res.status(code).json({
        elements,
        message,
      });
    } catch (e) {
      res.status(404).send(e);
    }
  },
  getAnime: async (req, res) => {
    try {
      const { slug } = req.params;
      const { code, message, elements } = await getAnime({ slug });
      res.status(code).json({ message, elements });
    } catch (error) {
      res.status(404).send(error);
    }
  },
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
      const info = [];
      const result = await cloudinary.uploader.upload(req.file.path);
      info.push(req.body);
      info.push(result.secure_url);
      const { code, message, elements } = await addNewAnime(info);
      res.status(code).json({
        message: message,
        elements,
      });
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  findAllEpisodeOfAnime: async (req, res, next) => {
    let { pageSize, episode, allOfEpisode } = req.query;
    const { id } = req.body;

    if (allOfEpisode === "24") {
      const { code, message, elements } = await findAllEpisodeOfAnime({
        id,
        pageSize,
        episode,
        allOfEpisode,
      });

      res.status(code).json({
        message: message,
        elements,
      });
    }
    try {
      redisClient.get(id, async (err, resp) => {
        if (err) throw err;

        if (resp) {
          res.status(200).send({
            res: resp,
            message: "data retrieved from the cache",
          });
        } else {
          episode = parseInt(episode);
          allOfEpisode = parseInt(allOfEpisode);
          const { code, message, elements } = await findAllEpisodeOfAnime({
            id,
            pageSize,
            episode,
            allOfEpisode,
          });

          redisClient.setex(id, 3600, elements);

          res.status(code).json({
            message: message,
            elements,
          });
        }
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
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
  findBySearchName: async (req, res, next) => {
    try {
      const { search, _Model } = req.body;
      let result = {};

      const searchResult = async (search) => {
        const searchAnime = _Anime.find({ $text: { $search: search } });
        const searchEpisode = _Episode.find({ $text: { $search: search } });
        const searchCharacters = _Character.find({
          $text: { $search: search },
        });
        const searchVoiceActors = _VoiceActor.find({
          $text: { $search: search },
        });
        const result = await Promise.all([
          searchAnime,
          searchEpisode,
          searchCharacters,
          searchVoiceActors,
        ]);
        return result;
      };
      if (_Model === "All") {
        searchResult(search).then((resp) => {
          res.status(200).json({
            message: "All results were found",
            elements: resp,
          });
        });
      } else {
        switch (_Model) {
          case "_Anime":
            result = await findBySearchName(search, _Anime);

            break;
          case "_Episode":
            result = await findBySearchName(search, _Episode);

            break;
          case "_Character":
            result = await findBySearchName(search, _Character);

            break;
          case "_VoiceActor":
            result = await findBySearchName(search, _VoiceActor);

            break;
          default:
            console.error("Unknown search term: " + search);
        }

        const { code, message, elements } = result;
        res.status(code).json({
          message: message,
          elements: elements,
        });
      }
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
  deleteManyEpisodes: async (req, res, next) => {
    try {
      const { id } = req.params;
      await _Episode.deleteMany({ animeId: id });
      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      res.status(501).json({ message: error.message });
    }
  },
};
