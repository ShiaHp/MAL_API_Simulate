const _Season = require("../../models/Anime/season.model");
const {
  createSeasonsYear,
  createNewVoiceActor,
  addNewCharacter,
  getCharacterAndVaFromAnime,
  getAnimeFollowSeasons
} = require("../../services/anime_info/anime_info_servies");

module.exports = {
  createSeasonsYear: async (req, res, next) => {
    try {
      const info = req.body;
      const { code, message, elements } = await createSeasonsYear(info);
      res.status(code).json({ message, elements });
    } catch (err) {
      console.error(err);
    }
  },
  createNewVoiceActor: async (req, res, next) => {
    try {
      const { code, message, elements } = await createNewVoiceActor(req.body);
      res.status(code).json({ message, elements });
    } catch (err) {
      console.error(err);
    }
  },
  addNewCharacter: async (req, res, next) => {
    try {
      const { code, message, elements } = await addNewCharacter(req.body);
      res.status(code).json({ message, elements });
    } catch (err) {
      console.error(err);
    }
  },
  getCharacterAndVaFromAnime : async (req, res) => { 
    try {
        const {id} = req.params
        console.log(id)
        const { code, message, elements } = await getCharacterAndVaFromAnime({id});
        res.status(code).json({ message, elements });
      } catch (err) {
        console.error(err);
      }
  },
  getAnimeFollowSeasons : async (req,res , next) => {  
    try {
      const { seasonYear , season } = req.params;

      const {code, message ,elements } = await getAnimeFollowSeasons({seasonYear,season});

      res.status(code).json({message, elements })
    } catch (err) { 
       res.status(501).json({ error: err.message });
    } 
  }
};
