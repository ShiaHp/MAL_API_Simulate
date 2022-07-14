const _Season = require('../../models/Anime/season.model');
const ApiError = require('../../utils/ApiError');
const httpStatus = require("http-status");

module.exports = {
    createSeasonsYear : async (info) => {
        try {
            const { year, season } = info
            if (await _Season.isYearValid(year)) {
                return{
                    code :401,
                    message : 'Invalid year',
                    elements : 0
                }
              }
             const seasonNew = await _Season.create(info)
             return{
                code : 201,
                message : "Season created successfully",
                elements  : seasonNew
             }
        } catch (error) {
            console.error(error);
        }
    }
}