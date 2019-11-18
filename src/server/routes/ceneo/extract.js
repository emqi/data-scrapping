const ExtractStep = require('../../../extract');

module.exports = async function (req, res) {
	//TODO 
	// sprawdzic parametry czy sa i czy sa ok.
	const phrase = req.body.phrase; 
	const pagesToSearch = req.body.pagesToSearch;	
	
	console.log(phrase)
	const data = await etl(phrase, pagesToSearch);

	return res.json(data);

};
	//PUSH TO UTILS
async function etl(phrase, pagesToSearch) {
	extract = new ExtractStep();
  
	return await extract.process(phrase, pagesToSearch);

  }
  

  