import { getEndedAuctions } from '../lib/getEndedAuctions'
import { closeAuctions } from '../lib/clouseAuctions'

async function processAuctions(event, context){
  const auctions = await getEndedAuctions()
  await closeAuctions(auctions)
  return {
    closed: auctions.length
  }
}

export const handler = processAuctions