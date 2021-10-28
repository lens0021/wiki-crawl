'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fs = __importStar(require("fs"));
var Readable = require('stream').Readable;
var MWBot = require('mwbot');
var TEMP_FILENAME = __dirname + "/tmp.xml";
function loginWiki(wiki) {
    return __awaiter(this, void 0, void 0, function () {
        var bot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bot = new MWBot({
                        apiUrl: wiki.apiUrl
                    });
                    if (!(wiki.username && wiki.password)) return [3 /*break*/, 2];
                    console.log("Logging in as " + wiki.username + "...");
                    return [4 /*yield*/, bot.loginGetEditToken({
                            username: wiki.username,
                            password: wiki.password
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, bot];
            }
        });
    });
}
function readLastCurid() {
    return 1;
}
function readWikiInfo(prefix) {
    return __awaiter(this, void 0, void 0, function () {
        var data, _a, _b, wikiInfo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_1.promises.readFile('./auth.json', 'utf8')];
                case 1:
                    data = _b.apply(_a, [_c.sent()])[prefix];
                    wikiInfo = {
                        prefix: prefix,
                        apiUrl: data.apiUrl,
                        username: data.username,
                        password: data.password,
                        readableName: data.readableName
                    };
                    return [2 /*return*/, wikiInfo];
            }
        });
    });
}
function exportXml(bot, curid) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var result, xml;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, bot.request({
                        action: 'query',
                        export: 1,
                        pageids: curid
                    })];
                case 1:
                    result = _c.sent();
                    xml = (_b = (_a = result === null || result === void 0 ? void 0 : result.query) === null || _a === void 0 ? void 0 : _a.export) === null || _b === void 0 ? void 0 : _b['*'];
                    return [4 /*yield*/, fs_1.promises.writeFile(TEMP_FILENAME, xml)];
                case 2:
                    _c.sent();
                    console.log('  Done');
                    return [2 /*return*/];
            }
        });
    });
}
function makeSummary(wiki, bot, curid) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var result, ns, revid, title, timestamp, pageLink, revLink;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, bot.request({
                        action: 'query',
                        prop: 'revisions',
                        pageids: curid
                    })];
                case 1:
                    result = _f.sent();
                    if (!((_a = result === null || result === void 0 ? void 0 : result.query) === null || _a === void 0 ? void 0 : _a.pages[curid].revisions)) {
                        throw new Error("Page is not found");
                    }
                    ns = (_b = result === null || result === void 0 ? void 0 : result.query) === null || _b === void 0 ? void 0 : _b.pages[curid].ns;
                    if (ns !== 0) {
                        throw new Error("The namespace for " + curid + " is " + ns);
                    }
                    revid = (_c = result === null || result === void 0 ? void 0 : result.query) === null || _c === void 0 ? void 0 : _c.pages[curid].revisions[0].revid;
                    title = (_d = result === null || result === void 0 ? void 0 : result.query) === null || _d === void 0 ? void 0 : _d.pages[curid].title;
                    timestamp = (_e = result === null || result === void 0 ? void 0 : result.query) === null || _e === void 0 ? void 0 : _e.pages[curid].revisions[0].timestamp;
                    pageLink = "[[" + wiki.prefix + ":Special:Redirect/page/" + curid + "|" + title + "]]";
                    if (title.includes(' ')) {
                        pageLink = "\"" + pageLink + "\"";
                    }
                    revLink = "[[" + wiki.prefix + ":Special:Redirect/revision/" + revid + "|" + timestamp + "\uD310]]";
                    return [2 /*return*/, wiki.readableName + " " + pageLink + " \uBB38\uC11C " + revLink + "\uC5D0\uC11C \uAC00\uC838\uC634 ([[\uD398\uBBF8\uC704\uD0A4:\uD3EC\uD06C \uD504\uB85C\uC81D\uD2B8]])"];
            }
        });
    });
}
function importXml(bot, src, summary) {
    return __awaiter(this, void 0, void 0, function () {
        var USE_BUILT_IN, file, params, uploadRequestOptions, paramName, param;
        return __generator(this, function (_a) {
            USE_BUILT_IN = false;
            if (USE_BUILT_IN) {
                bot.import("Project:\uD3EC\uD06C \uD504\uB85C\uC81D\uD2B8/" + src.readableName, __dirname + '/a.xml', summary);
            }
            else {
                file = fs.createReadStream(TEMP_FILENAME);
                params = {
                    action: 'import',
                    xml: file,
                    rootpage: "Project:\uD3EC\uD06C \uD504\uB85C\uC81D\uD2B8/" + src.readableName,
                    summary: summary || '',
                    token: bot.editToken,
                    interwikiprefix: src.prefix
                };
                uploadRequestOptions = MWBot.merge(bot.globalRequestOptions, {
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
                for (paramName in params) {
                    param = params[paramName];
                    uploadRequestOptions.har.postData.params.push({
                        name: paramName,
                        value: param
                    });
                }
                return [2 /*return*/, bot
                        .request({}, uploadRequestOptions)
                        .then(function (response) {
                        console.log(response);
                    })
                        .catch(function (err) {
                        console.log(err);
                    })];
            }
            return [2 /*return*/];
        });
    });
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sourceWiki, sourceBot, targetWiki, targetBot, startCurid, endCurId, curid, summary, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readWikiInfo('librewiki')];
            case 1:
                sourceWiki = _a.sent();
                return [4 /*yield*/, loginWiki(sourceWiki)];
            case 2:
                sourceBot = _a.sent();
                return [4 /*yield*/, readWikiInfo('mwdd')];
            case 3:
                targetWiki = _a.sent();
                return [4 /*yield*/, loginWiki(targetWiki)];
            case 4:
                targetBot = _a.sent();
                startCurid = readLastCurid();
                endCurId = 1;
                startCurid = 1;
                endCurId = 5;
                curid = startCurid;
                _a.label = 5;
            case 5:
                if (!(curid <= endCurId)) return [3 /*break*/, 12];
                console.log("Trying to import " + curid + "...");
                return [4 /*yield*/, exportXml(sourceBot, curid)];
            case 6:
                _a.sent();
                summary = '';
                _a.label = 7;
            case 7:
                _a.trys.push([7, 10, , 11]);
                return [4 /*yield*/, makeSummary(sourceWiki, sourceBot, curid)];
            case 8:
                summary = _a.sent();
                // importXml(targetBot, sourceWiki, summary);
                return [4 /*yield*/, delay(1000)];
            case 9:
                // importXml(targetBot, sourceWiki, summary);
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                e_1 = _a.sent();
                console.log("  Skipping " + curid + ", error: " + e_1.toString());
                return [3 /*break*/, 11];
            case 11:
                curid++;
                return [3 /*break*/, 5];
            case 12: return [2 /*return*/];
        }
    });
}); };
main();
