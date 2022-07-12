const express = require("express");
const router = express.Router();
const {
  addEpisode,
  addNewAnime,
  findAllEpisodeOfAnime,
  findExactEpisodesOnAired,
  findEpisodeBySearchName,
  findAllAnimeBySearchName
} = require("../controllers/anime.controller");

router.post("/addNewAnime", addNewAnime);
router.post("/addEpisode", addEpisode);
router.get("/getAllEpisode", findAllEpisodeOfAnime);
router.get("/getEpisodeExactlyByDate", findExactEpisodesOnAired);
router.get("/findEpisodeBySearchName",findEpisodeBySearchName)
router.get("/findAllAnimeBySearchName",findAllAnimeBySearchName)
module.exports = router;
