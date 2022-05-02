import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

@Injectable()
export class CrawlerService {
  browser: Browser;
  page: Page;

  constructor(@Inject('LogerService') private readonly logger: LoggerService) {}

  async init() {
    if (!this.browser && !this.page) {
      this.browser = await puppeteer.launch({
        headless: false,
      });
      this.page = await this.browser.newPage();
    }
  }

  async loadElPaisFeed() {
    this.logger.log('Loading ElPais.com');
    if (this.page) {
      await this.page.goto('https://elpais.com', {
        timeout: 60000,
        waitUntil: 'networkidle2',
      });

      // Wait for suggest overlay to appear and click "Accept".
      const acceptCookies = '#didomi-notice-agree-button';
      await this.page.waitForSelector(acceptCookies, {
        visible: true,
        hidden: true,
        timeout: 35000,
      });
      await this.page.click(acceptCookies);

      // Wait for the results page to load and display the results.
      const resultsSelector = 'article';
      await this.page.waitForSelector(resultsSelector, {
        visible: true,
        hidden: true,
      });

      // Extract the results from the page.
      const feeds = await this.page.evaluate((resultsSelector) => {
        const articles = Array.from(document.querySelectorAll(resultsSelector));
        const feeds = [];
        for (let i = 0; i < 5; i++) {
          const header = articles[i].querySelectorAll('header')[0]?.textContent;
          const news = articles[i].querySelectorAll('p')[0]?.textContent;
          feeds.push({ newspaper: 'ElPais', head: header, news: news });
        }
        return feeds;
      }, resultsSelector);

      return feeds;
    }
  }

  async loadElMundoFeed() {
    if (this.page) {
      await this.page.goto('https://elmundo.com');
    }
  }

  async close() {
    this.logger.log('Closing browser.');
    if (this.browser) {
      await this.page.close();
      await this.browser.close();
    }
  }
}
