import { BrowserBotty } from "../src/index.js";
import {Builder, Browser} from "selenium-webdriver";

const driver = await new Builder().forBrowser(Browser.CHROME).build();
const botty = new BrowserBotty( driver );

const testUrl = 'https://github.com/giorgiogilbert/browserbotty';
const timeout = 10_000;
await botty.gotoUrl( testUrl );
await botty.waitUntilUrlIs( testUrl, timeout );
await botty.quit();

console.log("Test was successfull");