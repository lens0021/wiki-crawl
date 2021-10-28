'use strict';

import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
const Readable = require('stream').Readable;
const MWBot = require('mwbot');

const TEMP_FILENAME = `${__dirname}/tmp.xml`;

type WikiInfo = {
  apiUrl: string;
  username: string;
  password: string;
  prefix: string;
  readableName: string;
};

async function loginWiki(wiki: WikiInfo): Promise<typeof MWBot> {
  const bot = new MWBot({
    apiUrl: wiki.apiUrl
  });
  if (wiki.username && wiki.password) {
    console.log(`Logging in as ${wiki.username}...`);
    await bot.loginGetEditToken({
      username: wiki.username,
      password: wiki.password
    });
  }
  return bot;
}

function readLastCurid(): number {
  return 1;
}

async function readWikiInfo(prefix: string): Promise<WikiInfo> {
  const data = JSON.parse(await fsPromises.readFile('./auth.json', 'utf8'))[
    prefix
  ];
  const wikiInfo: WikiInfo = {
    prefix: prefix,
    apiUrl: data.apiUrl,
    username: data.username,
    password: data.password,
    readableName: data.readableName
  };
  return wikiInfo;
}

async function exportXml(bot: typeof MWBot, curid: number): Promise<void> {
  const result = await bot.request({
    action: 'query',
    export: 1,
    pageids: curid
  });
  const xml = result?.query?.export?.['*'];
  await fsPromises.writeFile(TEMP_FILENAME, xml);
}

async function makeSummary(
  wiki: WikiInfo,
  bot: typeof MWBot,
  curid: number
): Promise<string> {
  const result = await bot.request({
    action: 'query',
    prop: 'revisions',
    pageids: curid
  });
  const revid: string = result?.query?.pages[curid].revisions[0].revid;
  const title: string = result?.query?.pages[curid].title;
  const timestamp: string = result?.query?.pages[curid].revisions[0].timestamp;

  let pageLink = `[[${wiki.prefix}:Special:Redirect/page/${curid}|${title}]]`;
  if (title.includes(' ')) {
    pageLink = `"${pageLink}"`;
  }
  const revLink = `[[${wiki.prefix}:Special:Redirect/revision/${revid}|${timestamp}판]]`;

  return `${wiki.readableName} ${pageLink} 문서 ${revLink}에서 가져옴 ([[페미위키:포크 프로젝트]])`;
}

function stringToReadable(str: string): typeof Readable {
  const readable = new Readable();
  readable.push(str);
  readable.push(null);
  return readable;
}

async function importXml(
  bot: typeof MWBot,
  src: WikiInfo,
  summary: string
): Promise<any> {
  const USE_BUILT_IN = false;
  if (USE_BUILT_IN) {
    bot.import(
      `Project:포크 프로젝트/${src.readableName}`,
      __dirname + '/a.xml',
      summary
    );
  } else {
    let file = fs.createReadStream(TEMP_FILENAME);

    const params: {
      [key: string]: any;
    } = {
      action: 'import',
      xml: file,
      rootpage: `Project:포크 프로젝트/${src.readableName}`,
      summary: summary || '',
      token: bot.editToken,
      interwikiprefix: src.prefix
    };

    let uploadRequestOptions = MWBot.merge(bot.globalRequestOptions, {
      // https://www.npmjs.com/package/request#support-for-har-12
      har: {
        method: 'POST',
        postData: {
          mimeType: 'multipart/form-data',
          params: []
        }
      }
    });

    // Convert params to HAR 1.2 notation
    for (let paramName in params) {
      const param = params[paramName];
      uploadRequestOptions.har.postData.params.push({
        name: paramName,
        value: param
      });
    }

    return bot.request({}, uploadRequestOptions);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const main = async () => {
  const sourceWiki = await readWikiInfo('librewiki');
  const sourceBot = await loginWiki(sourceWiki);

  const targetWiki = await readWikiInfo('mwdd');
  const targetBot = await loginWiki(targetWiki);

  var startCurid = readLastCurid();
  var endCurId = 1;
  startCurid = 4;
  endCurId = 4;
  for (let curid = startCurid; curid <= endCurId; curid++) {
    console.log(`Trying to import ${curid}...`);
    await exportXml(sourceBot, curid);
    let summary = '';
    try {
      summary = await makeSummary(sourceWiki, sourceBot, curid);
    } catch (e) {
      console.log(`Skipping ${curid}`);
      continue;
    }
    importXml(targetBot, sourceWiki, summary);
    await delay(1000);
  }
};

main();
