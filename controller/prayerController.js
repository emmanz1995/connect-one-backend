const { Router } = require('express')
const Prayer = require('../model/prayerModel')
const { StatusCodes } = require('http-status-codes')
const requireLogin = require('../middleware/requireLogin')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const prayers = await Prayer.find({});
        res.status(StatusCodes.OK).json(prayers);
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: err });
    }
});

router.post('/', requireLogin, async (req, res) => {
    try {
        const { title, body } = req.body;
        const newPrayer = new Prayer({
            title: title,
            body: body,
            isAnswered: false,
            prayedBy: req.user.id
        })
        console.log(newPrayer)
        const savedPrayer = await newPrayer.save()
        req.user.prayer = req.user.prayer.concat(savedPrayer)
        await req.user.save()
        return res.status(StatusCodes.CREATED).json(savedPrayer)
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: err });
    }
});

router.delete('/:id', requireLogin, async (req, res) => {
    const prayerId = req.params.id;
    try {
        if(!prayerId) {
            return res.status(400).send({ msg: `${prayerId} was not found!` });
        }
        const prayer = await Prayer.findById(prayerId)
        if(req.user._id.toString() === prayer.prayedBy._id.toString()) {
            const deletePrayer = await Prayer.findByIdAndDelete(prayerId);
            console.log(deletePrayer);
            res.status(StatusCodes.OK).json(deletePrayer);
        }
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: err });
    }
});

router.put('/:id', requireLogin, async(req, res) => {
    const prayerId = req.params.id;
    const { isAnswered } = req.body;
    try {
        const updateStatus = await Prayer.findByIdAndUpdate(prayerId, { isAnswered }, { new: true })
        res.status(StatusCodes.OK).json(updateStatus);
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ msg: err });
    }
})

module.exports = router;