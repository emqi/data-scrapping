const ExtractStep = require('../../../extract');

module.exports = async function extract(phrase, pagesToSearch) {
  extractStep = new ExtractStep();
  
  return await extractStep.process(phrase, pagesToSearch);
};
