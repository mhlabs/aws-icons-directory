const fs = require("fs");
const path = require("path");
const mapping = require("./mapping.json");
function getSVG(cfnType, type = "svg", size = "64") {
  try {
    return fs
      .readFileSync(
        path.join(
          __dirname,
          mapping[cfnType.toLowerCase()].icon
            .replace(/\{size\}/g, size)
            .replace("{type}", type)
        )
      )
      .toString();
  } catch (err) {
    if (process.env.AWS_ICON_DIR_DEBUG === 1) console.log(err);
    return;
  }
}
function guessSVG(service, type = "svg", size = "64") {
  try {
    const bestGuessKey = Object.keys(mapping).filter(p => p.toLowerCase().contains(service.toLowerCase()));
    const bestGuess = mapping[bestGuessKey];
    return fs
      .readFileSync(
        path.join(
          __dirname,
          bestGuess.icon
            .replace(/\{size\}/g, size)
            .replace("{type}", type)
        )
      )
      .toString();
  } catch (err) {
    if (process.env.AWS_ICON_DIR_DEBUG === 1) console.log(err);
    return;
  }
}

module.exports = {
  getSVG,
  guessSVG
};
