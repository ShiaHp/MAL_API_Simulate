


const express = require("express");
const router = express.Router();
const _Anime = require("../models/Anime/anime.model");
const {
  addEpisode,
  addNewAnime,
  findAllEpisodeOfAnime,
  findExactEpisodesOnAired,
  findBySearchName,
  deleteManyEpisodes,
  getAnime,
  getAnimeGenre,
  advanceSearch
} = require("../controllers/anime.controller");








router.get("/anime/search/advanceSearch" , advanceSearch); 




module.exports = router;
