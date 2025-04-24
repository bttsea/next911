"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePage = exports.getPagePath = exports.pageNotFoundError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const util_1 = require("util");
const constants_1 = require("../lib/constants");
const normalize_page_path_1 = require("./normalize-page-path");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
function pageNotFoundError(page) {
    const err = new Error(`Cannot find module for page: ${page}`);
    err.code = 'ENOENT';
    return err;
}
exports.pageNotFoundError = pageNotFoundError;
function getPagePath(page, distDir, serverless, dev) {
    const serverBuildPath = (0, path_1.join)(distDir, serverless && !dev ? constants_1.SERVERLESS_DIRECTORY : constants_1.SERVER_DIRECTORY);
    const pagesManifest = require((0, path_1.join)(serverBuildPath, constants_1.PAGES_MANIFEST));
    try {
        page = (0, normalize_page_path_1.normalizePagePath)(page);
        page = page === '/' ? '/index' : page;
    }
    catch (err) {
        // tslint:disable-next-line
        console.error(err);
        throw pageNotFoundError(page);
    }
    if (!pagesManifest[page]) {
        const cleanedPage = page.replace(/\/index$/, '') || '/';
        if (!pagesManifest[cleanedPage]) {
            throw pageNotFoundError(page);
        }
        else {
            page = cleanedPage;
        }
    }
    return (0, path_1.join)(serverBuildPath, pagesManifest[page]);
}
exports.getPagePath = getPagePath;
function requirePage(page, distDir, serverless) {
    const pagePath = getPagePath(page, distDir, serverless);
    if (pagePath.endsWith('.html')) {
        return readFile(pagePath, 'utf8');
    }
    return require(pagePath);
}
exports.requirePage = requirePage;
