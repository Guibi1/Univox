import * as cheerio from "cheerio";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import mongoose from "mongoose";
import type { Class } from "../Types";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);

type OmnivoxCookie = {
    COMN: string;
    DTKS: string;
    K: string;
    TKSBDBP: string;
};

type ScheduleCookie = {
    sessionID: string;
    rvpMod: string;
};

export enum Semester {
    Winter = "1",
    Summer = "2",
    Fall = "3",
}

/**
 * Fetches the user's schedule page
 * @param cookie The user's cookie session
 * @param year The year to fetch
 * @param semester The semester to fetch
 * @returns The HTML text of the schedule's page
 */
export async function fetchSchedulePageHTML(
    cookie: OmnivoxCookie,
    year: number,
    semester: Semester
): Promise<string> {
    const { sessionID, rvpMod } = await getScheduleCookies(cookie);

    // Get the 'visualise' link
    const res = await fetch("https://bdeb-estd.omnivox.ca:443/estd/hrre/Horaire.ovx", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; TKSBDBP=${cookie.TKSBDBP}; ${sessionID}; ${rvpMod}`,
        },
        body: `AnSession=${year + semester}&Confirm=Consulter+mon+horaire`,
    });

    const text = await res.text();
    const visualiseURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // Fetch the actual schedule data
    const visualiseRes = await fetch("https://bdeb-estd.omnivox.ca:443/estd/hrre/" + visualiseURL, {
        headers: {
            Cookie: `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; TKSBDBP=${cookie.TKSBDBP}; ${sessionID}; ${rvpMod}`,
        },
    });

    const buffer = await visualiseRes.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1");
    return decoder.decode(buffer);
}

/**
 * This function parses the provided HTML to create an array of Class
 * @param HTML The 'visualise' page's HTML content
 * @returns The user's schedule
 */
export function schedulePageToName(HTML: string) {
    const $ = cheerio.load(HTML);
    const match = regexFind($("#headerNavbarProfileUserName").first().text(), /(.*)\s(.*)/);

    return { firstName: match[1], lastName: match[2] };
}

/**
 * Sends a login request to omnivox
 * @param {string} da The student's DA
 * @param {string} password The student's password
 * @returns An object containing all the usefull information
 */
export async function login(da: string, password: string): Promise<OmnivoxCookie> {
    // GET COOKIES
    const firstRes = await fetch("https://bdeb.omnivox.ca:443/Login/Account/Login");
    const formK = regexFind(
        await firstRes.text(),
        /<input id="k" name="k" type="hidden" value="(.*?)" \/>/
    )[1];

    const firstCookies = firstRes.headers.get("set-cookie");
    const COMN = regexFind(firstCookies, /comn=(.+?);/)[1];
    const DTKS = regexFind(firstCookies, /DTKS=(.+?);/)[1];
    const firstK = regexFind(firstCookies, /k=(.+?);/)[1];

    // LOGIN
    const res = await fetch(
        "https://bdeb.omnivox.ca:443/intr/Module/Identification/Login/Login.aspx",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": `comn=${COMN}; DTKS=${DTKS}; ln=FRA; L=FRA; k=${firstK}`,
            },
            redirect: "manual",
            body: `StatsEnvUsersNbCouleurs=24&StatsEnvUsersResolution=1536&k=${formK}&TypeLogin=PostSolutionLogin&TypeIdentification=Etudiant&ReturnUrl=%2Fintr%2F&NoDA=${da}&PasswordEtu=${password}`,
        }
    );

    if (res.url.includes("?erreur=ERROR_0028")) {
        throw "ERROR WHILE LOGIN: BAD CREDENTIALS";
    }

    const cookies = res.headers.get("set-cookie");
    const K = regexFind(cookies, /k=(.+?);/)[1];
    const TKSBDBP = regexFind(cookies, /TKSBDBP=(.+?);/)[1];

    return { COMN, DTKS, K, TKSBDBP };
}

/**
 * This function prepares Onmivox so that the user's schedule can be fetched
 * @param {OmnivoxCookie} cookie The user's session cookie
 * @returns The prepared schedule's specific session ID
 */
async function getScheduleCookies(cookie: OmnivoxCookie): Promise<ScheduleCookie> {
    const res = await fetch(
        "https://bdeb-estd.omnivox.ca:443/estd/vl.ovx?lk=%2festd%2fhrre%2fHoraire.ovx",
        {
            headers: {
                Cookie: `DTKS=${cookie.DTKS}; ln=FRA; L=FRA; comn=${cookie.COMN}; k=${cookie.K}; TKSBDBP=${cookie.TKSBDBP}`,
            },
        }
    );

    const cookies = res.headers.get("set-cookie");
    const sessionID = regexFind(cookies, /(ASPSESSIONID.+?=.+?);/)[1];
    const rvpMod = regexFind(cookies, /(rvp-omnivox-mod-bdb.+?=.+?);/)[1];

    // Get the load session url
    const text = await res.text();
    const loadSessionURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // This is so that omnvivox allows us to look at the schedule
    await fetch("https://bdeb-estd.omnivox.ca:443/estd/" + loadSessionURL, {
        headers: {
            Cookie: `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; TKSBDBP=${cookie.TKSBDBP}; ${sessionID}; ${rvpMod}`,
        },
    });

    return { sessionID, rvpMod };
}

/**
 * This function parses the provided HTML to create an array of Class
 * @param HTML The 'visualise' page's HTML content
 * @returns The user's schedule
 */
export function schedulePageToClasses(HTML: string): Class[] {
    const schedule: Class[] = [];
    const $ = cheerio.load(HTML);
    const rows = $("table .CelluleHoraire > tbody > tr:not(:first)");

    for (const row of rows) {
        const timeStart = dayjs(
            regexFind($("td:first > font", row).html(), /(\d{2}:\d{2})(?:<br>)*\d{2}:\d{2}/)[1],
            "HH:mm"
        );
        const listTdTag = $("td:not(:first)", row);

        listTdTag.each((index, tdTag) => {
            const fontTags = $("b < font", tdTag);
            if (fontTags.length === 0) return;

            const html = fontTags.first().html();

            // TODO: Handle examens communs?
            if (html?.includes("examens")) return;

            const match = regexFind(
                html,
                /<b>(.+?)<\/b><br>(.+?) gr.(.+?)<br>Local (.+?)(?:&nbsp;)*(.)<br>(.+?)<br><font.*?><b><i>(.+?)<\/i><\/b><\/font>/
            );
            const timeEnd = timeStart.add(Number($(tdTag).attr("rowspan") ?? 0) / 2, "hours");

            let day = index;
            for (const c of schedule) {
                if (
                    c.timeStart.weekday() - 1 <= day &&
                    c.timeStart != timeStart &&
                    c.timeStart.isBefore(timeEnd) &&
                    c.timeEnd.isAfter(timeStart)
                ) {
                    day += 1;
                }
            }

            schedule.push({
                _id: new mongoose.Types.ObjectId(),
                name: match[1],
                code: match[2],
                group: Number(match[3]),
                local: match[4],
                theory: match[5] === "T",
                teacher: match[6],
                virtual: match[7] === "Présentiel",
                timeStart: timeStart.weekday(day),
                timeEnd: timeEnd.weekday(day),
            });
        });
    }

    return schedule;
}

function regexFind(data: string | null, query: RegExp): RegExpMatchArray {
    if (data == null) throw "MATCH ERROR: STRING WAS NULL";

    const match = data.match(query);
    if (match == null) throw `MATCH ERROR: '${query}' DIDN'T MATCH WITH '${data}'`;

    return match;
}
