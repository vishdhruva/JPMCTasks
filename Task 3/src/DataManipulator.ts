import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[0].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = (priceDEF == 0) ? priceABC : (priceABC / priceDEF); // accounts for divide by zero error
    const upperBound = 1.005; // conservative bounds to test trigger alert
    const lowerBound = 1 - .005;


      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? // Use the most recent timestamp for the ratio of stocks
          serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined

      };
    }
  }
