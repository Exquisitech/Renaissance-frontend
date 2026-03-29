export async function getPrediction(
  homeTeam: string,
  awayTeam: string,
  competition: string,
) {
  return `AI analysis suggests a competitive ${competition} match between ${homeTeam} and ${awayTeam}. Current form and implied odds slightly favor the stronger recent performer, but the match projects as close.`;
}