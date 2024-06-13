
const userShope = require("../../models/userShope");

const create = async (req, res) => {
    try {
        const { shopType, shopId, shopToken, storeName, region, timezone } = req.body;
        const userId = req.user.id
        const shope = await userShope.create({ shopType, shopId, shopToken, userId, storeName, region, timezone });

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

const deleteShop = async (req, res) => {
    try {
        const id = req.params.id

        const shope = await userShope.findByIdAndDelete(id)

        return res
            .status(200)
            .send({ shope: shope, message: "Shop delete successfully" });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};
module.exports = {
    create,
    findeShop,
    deleteShop
};
