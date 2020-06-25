const express = require("express");
const router = express.Router();
const Helpers = require("../utils/helpers");
const userAuth = require("./userAuthentication");

router.get("/", (req, res) => {
    const { id } = req.decrypted;
    Helpers.allUserInfo(id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({ error: err }))
})

router.post("/", (req, res) => {
    const body = req.body;
    const { id } = req.decrypted;
    const data = { ...body, user_id: Number(id) }

    Helpers.addSleepTime(data)
    .then((userInfo) => res.status(201).json(userInfo))
    .catch((err) => res.status(500).json({ error: err }))
})

router.put("/:id", (req, res) => {
    console.log(req.body, req.decrypted.id);
    const { id } = req.params;
    const body = req.body;

    Helpers.editSleepTime(id, body)
    .then((updated) => res.status(201).json(updated))
    .catch((err) => res.status(500).json({ error: err }));
})

router.delete("/:post_id", (req, res) => {
    const { post_id } = req.params;
    const { id } = req.decrypted;

    Helpers.deleteSleepTime(id, post_id)
    .then((deleted) =>
    deleted
    ? res.status(200).json({
        message: `${post_id} successfully deleted!`
    })
    : res.status(404).json({ error: "post not found" })
    )
    .catch((err) => res.status(500).json({ error: err }))
})

router.get("/dates", (req, res) => {
    const { id } = req.decrypted;
    const { start, end } = req.query;

    Helpers.findDates(id, start, end)
    .then((dates) => res.status(200).json(dates))
    .catch((err) => res.status(500).json(err));
})

module.exports = router;