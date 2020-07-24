function ConfigurationHandler(fs) {
  function readAndParseJsonFile(path) {
    if (typeof path === undefined || path == null)
      throw new ReferenceError("Path to file is not defined.");

    return JSON.parse(fs.readFileSync(path));
  }

  return { readAndParseJsonFile };
}

module.exports = ConfigurationHandler;
