// Set to true to print debug information.
const DEBUG = false;

module.exports = async function waitForNetworkSettled(page, action, longPolls = 0) {
  let networkSettledCallback;
  const networkSettledPromise = new Promise(f => networkSettledCallback = f);

  let requestCounter = 0;
  let actionDone = false;
  const pending = new Set();

  const maybeSettle = () => {
    if (actionDone && requestCounter <= longPolls)
      networkSettledCallback();
  };

  const onRequest = request => {
    ++requestCounter;
    DEBUG && pending.add(request);
    DEBUG && console.log(`+[${requestCounter}]: ${request.url()}`);
  };
  const onRequestDone = request => {
    // Let the page handle responses asynchronously (via setTimeout(0)).
    //
    // Note: this might be changed to use delay, e.g. setTimeout(f, 100),
    // when the page uses delay itself.
    const evaluate = page.evaluate(() => new Promise(f => setTimeout(f, 0)));
    evaluate.catch(e => null).then(() => {
      --requestCounter;
      maybeSettle();
      DEBUG && pending.delete(request);
      DEBUG && console.log(`-[${requestCounter}]: ${request.url()}`);
    });
  };

  page.on('request', onRequest);
  page.on('requestfinished', onRequestDone);
  page.on('requestfailed', onRequestDone);

  let timeoutId;
  DEBUG && (timeoutId = setInterval(() => {
    console.log(`${requestCounter} requests pending:`);
    for (const request of pending)
      console.log(`  ${request.url()}`);
  }, 5000));

  const result = await action();
  actionDone = true;
  maybeSettle();
  DEBUG && console.log(`action done, ${requestCounter} requests pending`);
  await networkSettledPromise;
  DEBUG && console.log(`action done, network settled`);

  page.removeListener('request', onRequest);
  page.removeListener('requestfinished', onRequestDone);
  page.removeListener('requestfailed', onRequestDone);

  DEBUG && clearTimeout(timeoutId);

  return result;
};
