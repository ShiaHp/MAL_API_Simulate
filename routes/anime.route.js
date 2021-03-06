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
  advanceSearch,
  getAnimeById,
  deleteAnimeById
} = require("../controllers/anime.controller");

const upload = require("../utils/multer");

const {
  createSeasonsYear,
  createNewVoiceActor,
  addNewCharacter,
  getCharacterAndVaFromAnime,
  getAnimeFollowSeasons,
  
} = require("../controllers/anime_info/anime_info_controller");

router.post("/addNewAnime", upload.single("image"), addNewAnime);


router.route("/info/:id").get(getAnimeById).delete(deleteAnimeById)


router.get("/genre/:genre",getAnimeGenre)
router.post("/addEpisode", addEpisode);
router.get("/getAllEpisode", findAllEpisodeOfAnime);
router.get("/getEpisodeExactlyByDate", findExactEpisodesOnAired);
router.get("/findBySearchName", findBySearchName);
router.delete("/deleteManyEpisodes/:id", deleteManyEpisodes);
router.post("/addNewvoiceActor", createNewVoiceActor);
router.post("/addNewCharacter", addNewCharacter);
router.get("/getCharacterAndVaFromAnime/:id", getCharacterAndVaFromAnime);
router.post("/createNewSeason", createSeasonsYear);
router.get("/:seasonYear/:season" , getAnimeFollowSeasons);
router.get("/:slug" , getAnime)






module.exports = router;
