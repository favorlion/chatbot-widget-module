require('dotenv').load();

const {get} = require('lodash');
const amazon = require('amazon-product-api');

function getTitleFromResult(result) {
  return {
    title: get(result, 'ItemAttributes.0.Title.0'),
    url: get(result, 'DetailPageURL.0')
  };
}

function searchAmazonProducts(keywords) {
  const client = amazon.createClient({
    awsId: process.env.AWS_ID,
    awsSecret: process.env.AWS_KEY
  });

  return client.itemSearch({
    keywords: keywords
  }).then(function(results){
    return results.map(getTitleFromResult);
  }).catch(function(err){
    console.log(JSON.stringify(err));
    return [];
  });
}

module.exports = searchAmazonProducts;
