const db = require("../data/dbConfig");

module.exports = {
    allUserInfo(id) {
        const user = db("users").where({ id }).first();
        const sleep_time = db("sleep").where({ user_id: id })

        return Promise.all([user, sleep_time]).then(([u, t]) => {
            const userObj = {
                user: {
                    id: u.id,
                    email: u.email,
                    first_name: u.first_name,
                    last_name: u.last_name,
                },
                time: t
            };
            return userObj;
        })
    },

    addUser(user) {
        return db("users")
        .insert(user, "id")
        .then(([id]) => db("users").where({ id }));
    },

    login(user) {
        return db("users")
        .where({ email: user.email })
        .then((u) => u);
    },

    addSleepTime(user) {
        return db("sleep")
        .insert(user, "id")
        .then(([id]) =>
        db("sleep")
        .where({ user_id: user.user_id })
        .then((sT) => sT.find((elem) => elem.id === id))
        )
    },

    findDates(id, d1, d2) {
        return db("sleep")
        .where({ user_id: id })
        .andWhereBetween("sleep_start", [d1, d2])
        .limit(30)
    },

    editSleepTime(id, info) {
        return db("sleep").where({ id }).update(info);
    },

    deleteSleepTime(id, sleep_id) {
        return db("sleep")
        .where({ user_id: id })
        .andWhere({ id: sleep_id })
        .del()
        .then((deleted) => deleted)
        .catch((err) => err)
    }
}