const mongoclient = require("../db/connection");
const getlist = (query, skip, size) =>
  mongoclient
    .db("drive14")
    .collection("citizen")
    .aggregate(query)
    .skip(skip)
    .limit(size)
    .toArray();

module.exports = { getlist };
