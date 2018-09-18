const cheerio = require('cheerio');
const fs = require('fs')
const rp = require('request-promise');

const options = {
  uri: `http://leagueoflegends.wikia.com/wiki/List_of_champions`,
  transform: body => cheerio.load(body)
};

rp(options)
  .then($ => {
    var champions = {};
    $(".wikitable.sortable tr").each(function() {
      var champion = $(this).find('td').find('span').attr('data-champion');
      var price = $(this).find('td:nth-child(5)').text().trim();
      if (champion !== undefined && price !== undefined) {
        champions[champion] = price;
      }
    });

    var championsString = JSON.stringify(champions);
    fs.writeFile("championPrice.json", championsString, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch(err => {
    console.log(err)
  });