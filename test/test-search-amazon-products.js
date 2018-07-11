const test = require('tape');
const searchAmazonProducts = require('../search-amazon-products');

test(t => {
  searchAmazonProducts('conference phone').then(results => {
     
    results.forEach(result => {
      t.ok(result);
      t.ok(result.title);
      t.ok(result.url);
      
      console.log(result.title);
    });
    
    t.end();
  });
});
