const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

const getChampionPrices = async () => {
  try {
    const { data } = await axios.get(
      'http://leagueoflegends.wikia.com/wiki/List_of_champions'
    );

    const $ = cheerio.load(data);
    const champions = {};
    /*
      $('.class1, .class2') finds any element with EITHER of these classes
      $('.class1.class2') finds element that has BOTH classes

      CSS selectors are read right to left!
      Descendant selectors: .wikitable.sortable tr
      Child selectors: table.wikitable.sortable > tbody > tr
    */
    $('table.wikitable.sortable > tbody > tr').each((_, ele) => {
      const champion = $(ele).find('td').attr('data-sort-value');
      const price = $(ele).find('td:nth-child(6)').text().trim();
      if (champion && price) {
        champions[champion] = price;
      }
    });

    return champions;
  } catch (error) {
    throw error;
  }
};

// IIFE
(async () => {
  championPrices = await getChampionPrices();
  fs.writeFile('championPrice.json', JSON.stringify(championPrices), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})();

// Promise method
/*
getChampionPrices().then((championPrices) => {
  fs.writeFile('championPrice.json', JSON.stringify(championPrices), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});
*/
