let config = {
  "backends" : {
    "sage" : {
      "amazon" : process.env.AMAZON_URL || "http://localhost:3001/api/web/receive",
      "tesla" : process.env.TESLA_URL || "http://localhost:3001/api/web/receive"
    }
  }
};










module.exports = config;
