const express = require("express");
const router = express.Router();
const {
  addEpisode,
  addNewAnime,
  findAllEpisodeOfAnime,
  findExactEpisodesOnAired,
  findBySearchName,
  deleteManyEpisodes,
} = require("../controllers/anime.controller");
const { createSeasonsYear } = require("../controllers/anime_info/anime_info_controller");

router.post("/addNewAnime", addNewAnime);
router.post("/addEpisode", addEpisode);
router.get("/getAllEpisode", findAllEpisodeOfAnime);
router.get("/getEpisodeExactlyByDate", findExactEpisodesOnAired);
router.get("/findBySearchName",findBySearchName)
router.delete("/deleteManyEpisodes/:id",deleteManyEpisodes)


router.post("/createNewSeason", createSeasonsYear)
module.exports = router;
