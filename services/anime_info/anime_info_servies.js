const _Season = require("../../models/Anime/season.model");
const _Character = require("../../models/Anime/character.model");
const _VoiceActor = require("../../models/Anime/voiceActor.model");
const _Anime = require("../../models/Anime/anime.model");
const ApiError = require("../../utils/ApiError");
const httpStatus = require("http-status");

module.exports = {
  createSeasonsYear: async (info) => {
    try {
      const { year, season } = info;
      if (await _Season.isYearValid(year)) {
        return {
          code: 401,
          message: "Invalid year",
          elements: 0,
        };
      }
      const seasonNew = await _Season.create(info);
      return {
        code: 201,
        message: "Season created successfully",
        elements: seasonNew,
      };
    } catch (error) {
      console.error(error);
    }
  },
  addNewCharacter: async (info) => {
    try {
      const newChar = await _Character.create(info);
      const result = await _VoiceActor.findByIdAndUpdate(
        { _id: newChar.VaId[0] },
        {
          $addToSet: { characterRole: newChar._id },
        },
        { new: true }
      );
      if (!newChar || !result) {
        return {
          code: 501,
          message: "Error updating",
          elments: 0,
        };
      }
      return {
        code: 201,
        message: "New character had been created",
        elements: newChar,
      };
    } catch (error) {
      return {
        code: 401,
        message: error.message,
        elements: 0,
      };
    }
  },
  createNewVoiceActor: async (info) => {
    try {
      const newVA = await _VoiceActor.create(info);
      return {
        code: 201,
        message: "New VoiceActor had been created",
        elements: newVA,
      };
    } catch (error) {
      return {
        code: 401,
        message: error.message,
        elements: 0,
      };
    }
  },
  getCharacterAndVaFromAnime: async ({ id }) => {
    try {

      const allInformationAboutVaAndChar = await _Character
        .find({ Animeography: id })
        .select("name role -_id")
        .populate("VaId", "name")
        .exec();

      return {
        code: 201,
        message: "Success",
        elements: allInformationAboutVaAndChar,
      };
    } catch (error) {
      return {
        code: 401,
        message: error.message,
        elements: 0,
      };
    }
  },
  getAnimeFollowSeasons : async ({seasonYear,season}) =>{
    try{
      console.log(seasonYear,season)
        const animeOfYear = await _Season.findOne({year : seasonYear , season : season},null, {
              populate : { path : 'animeIdOfSeason' , options : {strictPopulate: false}   }
          }).exec();
        if(!animeOfYear) {
          return {
            code : 404,
            message : "Anime not found",
            elements : 0
          }
        }
        return{
          code: 200,
          message: 'Successfully',
          elements: animeOfYear,
       }
    } catch(error) {
        return{
           code: 401,
           message: error.message,
           elements: 0,
        }
    }
  }
};
