// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { count } = require("console");
const { chromium } = require("playwright");


async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({
    headless: true //headless: false means that you can see it happning
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
  let numElements = 0;
  let numArticlesChecked = 0;
  let numTrys = 0;//A safty varable that will stop the program after 150 loops 
  let Sorted = true;
  while (numArticlesChecked < 100 && numTrys < 150){//While you have checked less than 100
    const locatedTimestamps = await page.locator(".age");//find all timestamps in document order
    numElements = await locatedTimestamps.count();
    if (numElements == 0){
      console.log("test did not execute correctly");//if the server malfunctions, Try again
      const result = await sortHackerNewsArticles();
      return result;
    }
    const output = await page.locator(".age").evaluateAll((list, input) => {
        let checkNum = 1;
        let prevArticle = list[0];
        let currArticle;
        let currTime;
        let prevTime;
        for(let i=1; i<list.length; i++){
          currArticle = list[i];
          currTime = (currArticle.title).substring(20);//Title expected format is yyyy-mm-ddTHH:MM:SS UNIXtime 
          prevTime = (prevArticle.title).substring(20);//This will therefore just get UNIXtime as a string
          if (parseInt(currTime) < parseInt(prevTime)){//in the case that they are equal, it is arbitrary what goes first
            return true;
          }
          prevArticle = list[i];
          checkNum = checkNum + 1;
        }
        return false;
    }, 0);
    if(output == false){
      Sorted = false;
      break;
    }
    numArticlesChecked = numArticlesChecked + numElements;
    if(numArticlesChecked < 100){
      await page.locator(".morelink").click();
    }
    numTrys++;
  }
  console.log(Sorted);
  await page.close();
  await context.close();
  await browser.close();
  return Sorted;

}

(async () => {
  await sortHackerNewsArticles();
})();
