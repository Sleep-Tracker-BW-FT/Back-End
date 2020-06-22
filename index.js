const server = require("./api/server");
const port = process.env.PORT || 5000;

server.get("/", (req, res) => {
  db("users")
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json(err));
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});