const _Season = require('../../models/Anime/season.model');
const {createSeasonsYear} = require('../../services/anime_info/anime_info_servies')

module.exports = {
    createSeasonsYear : async (req, res,next) => {
        try {
            const info = req.body
            const {code, message, elements} = await createSeasonsYear(info)
            res.status(code).json({message , elements}) 
        } catch (err) {
            console.error(err)
        }
       
    }
}


