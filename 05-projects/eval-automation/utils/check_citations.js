module.exports = async function checkCitations({ response }) {
  const hasCitation = response && response.toLowerCase().includes('[ref');
  return {
    score: hasCitation ? 1 : 0,
    reason: hasCitation ? 'Response includes citation marker.' : 'No citation marker found.'
  };
};
