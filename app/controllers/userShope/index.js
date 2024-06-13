
const userShope = require("../../models/userShope");

const create = async (req, res) => {
    try {
        const { shopType, shopId, shopToken } = req.body;
        const userId = req.user.id
        const shope = await userShope.create({ shopType, shopId, shopToken, userId });

        return res
            .status(200)
            .send({ shope: shope, message: "Shop created successfully" });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};

const findeShop = async (req, res) => {
    try {
        const userId = req.user.id

        const query = {
            $and: [{ userId: userId }],
        };
        const shope = await userShope.find(query);

        return res
            .status(200)
            .send({ shope: shope });

    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    create,
    findeShop
};
