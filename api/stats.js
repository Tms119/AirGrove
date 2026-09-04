const telemetryHandler = require('./telemetry');

module.exports = async (req, res) => {
  return telemetryHandler(req, res);
};
