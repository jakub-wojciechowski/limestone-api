import limestone from "../src/index";
import { PriceData } from "../src/types";

const MAX_TIME_DIFF = 90000; // 90s

describe("Fluent interface tests ", () => {

  /********* SINGLE SYMBOL *********/

  test("Should get AR price", async () => {
    const price = await limestone.query()
      .symbol("AR")
      .latest()
      .exec();

    expect(price).toBeDefined();
    expect(price.symbol).toBe("AR");
    expect(price.value).toBeGreaterThan(1);
    expect(Date.now() - price.timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get a single historical AR price", async () => {
    const price = await limestone.query()
      .symbol("AR")
      .atDate("2021-04-19")
      .exec();

    const timeDiff = new Date("2021-04-19").getTime() - price.timestamp;

    expect(price.symbol).toBe("AR");
    expect(timeDiff).toBeLessThan(MAX_TIME_DIFF);
    expect(price.value).toBeCloseTo(24.164724409233393);
  });

  test("Should get historical AR price for the last 12 hours", async () => {
    const prices = await limestone.query()
      .symbol("AR")
      .forLastHours(12)
      .exec();

    expect(prices.length).toBeGreaterThan(70);
    expect(prices.length).toBeLessThan(74);
  });

  test("Should get single historical AR price for the 24 hours ago", async () => {
    const price = await limestone.query()
      .symbol("AR")
      .hoursAgo(24)
      .exec();

    const timeDiff = Date.now() - 24 * 3600 * 1000 - price.timestamp;

    expect(price.symbol).toBe("AR");
    expect(price.value).toBeGreaterThan(1);
    expect(timeDiff).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get historical AR price for last 7 days", async () => {
    const prices = await limestone.query()
      .symbol("AR")
      .forLastDays(7)
      .exec();

    expect(prices.length).toBeGreaterThan(165);
    expect(prices.length).toBeLessThan(170);
  });

  test("Should get historical AR price for the last 1 day", async () => {
    const prices = await limestone.query()
      .symbol("AR")
      .forLastDays(1)
      .exec();

    expect(prices.length).toBeGreaterThan(23);
    expect(prices.length).toBeLessThan(25);
  });

  test("Should get AR price in time range", async () => {
    const prices = await limestone.query()
      .symbol("AR")
      .fromDate("2021-04-19")
      .toDate("2021-04-20")
      .exec();

    expect(prices.length).toBe(24);
  });

  // /********* SEVERAL SYMBOLS *********/

  test("Should get latest prices for AR, ETH and BTC", async () => {
    const prices = await limestone.query()
      .symbols(["AR", "ETH", "BTC"])
      .latest()
      .exec();

    expect(prices["AR"]).toBeDefined();
    expect(prices["ETH"]).toBeDefined();
    expect(prices["BTC"]).toBeDefined();
    expect(prices["AR"].value).toBeGreaterThan(0.1);
    expect(prices["ETH"].value).toBeGreaterThan(100);
    expect(prices["BTC"].value).toBeGreaterThan(1000);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

  test("Should get the historical price for AR, ETH and BTC", async () => {
    const prices = await limestone.query()
      .symbols(["AR", "ETH", "BTC"])
      .atDate("2021-04-19")
      .exec();

    const timestamp = new Date("2021-04-19").getTime();

    expect(prices["AR"].value).toBeCloseTo(24.164724409233393);
    expect(prices["ETH"].value).toBeCloseTo(2237.882213712263);
    expect(prices["BTC"].value).toBeCloseTo(56206.13804443239);
    expect(timestamp - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(timestamp - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });


  // /********* ALL SYMBOLS *********/

  test("Should get the latest prices for all symbols", async () => {
    const prices = await limestone.query()
      .allSymbols()
      .latest()
      .exec();

    expect(Object.keys(prices)).toContain("BTC");
    expect(Object.keys(prices)).toContain("ETH");
    expect(Object.keys(prices)).toContain("AR");
    expect(Object.keys(prices).length).toBeGreaterThan(100);
    expect(Date.now() - prices["AR"].timestamp).toBeLessThan(MAX_TIME_DIFF);
    expect(Date.now() - prices["BTC"].timestamp).toBeLessThan(MAX_TIME_DIFF);
  });

});
