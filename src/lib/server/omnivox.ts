/**
 * @file Allows to interact with Omnivox. (login, schedule, etc)
 */

import type { Class } from "$lib/Types";
import * as cheerio from "cheerio";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import sharp from "sharp";

dayjs.extend(customParseFormat);

/**
 * Represents the differents Semesters
 */
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
    const res = await fetch(`https://${cookie.baseUrl}-estd.omnivox.ca:443/estd/hrre/Horaire.ovx`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; ${cookie.TK}; ${sessionID}; ${rvpMod}`,
        },
        body: `AnSession=${year + semester}&Confirm=Consulter+mon+horaire`,
    });

    const text = await res.text();
    const visualiseURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // Fetch the actual schedule data
    const visualiseRes = await fetch(
        `https://${cookie.baseUrl}-estd.omnivox.ca:443/estd/hrre/${visualiseURL}&typeHoraire=Session`,
        {
            headers: {
                Cookie: `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; ${cookie.TK}; ${sessionID}; ${rvpMod}`,
            },
        }
    );

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
 * @param {string} email The student's email adresse
 * @param {string} password The student's password
 * @returns An object containing all the usefull information
 */
export async function login(email: string, password: string): Promise<OmnivoxCookie> {
    const match = regexFind(email, /(\d{7})@(.*).qc.ca/);
    const da = match[1];
    const baseUrl = match[2];

    // GET COOKIES
    const firstRes = await fetch(`https://${baseUrl}.omnivox.ca:443/Login/Account/Login`);
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
        `https://${baseUrl}.omnivox.ca:443/intr/Module/Identification/Login/Login.aspx`,
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
    const TK = regexFind(cookies, /(TK(?!INTR).+?=.+?);/)[1];

    return { baseUrl, COMN, DTKS, K, TK };
}

/**
 * This function prepares Onmivox so that the user's schedule can be fetched
 * @param {OmnivoxCookie} cookie The user's session cookie
 * @returns The prepared schedule's specific session ID
 */
async function getScheduleCookies(cookie: OmnivoxCookie): Promise<ScheduleCookie> {
    const res = await fetch(
        `https://${cookie.baseUrl}-estd.omnivox.ca:443/estd/vl.ovx?lk=%2festd%2fhrre%2fHoraire.ovx`,
        {
            headers: {
                Cookie: `DTKS=${cookie.DTKS}; ln=FRA; L=FRA; comn=${cookie.COMN}; k=${cookie.K}; ${cookie.TK}`,
            },
        }
    );

    const cookies = res.headers.get("set-cookie");
    const sessionID = regexFind(cookies, /(ASPSESSIONID.+?=.+?);/)[1];
    const rvpMod = regexFind(cookies, /(rvp-omnivox-mod.+?=.+?);/)[1];

    // Get the load session url
    const text = await res.text();
    const loadSessionURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // This is so that omnvivox allows us to look at the schedule
    await fetch(`https://${cookie.baseUrl}-estd.omnivox.ca:443/estd/${loadSessionURL}`, {
        headers: {
            Cookie: `comn=${cookie.COMN}; DTKS=${cookie.DTKS}; ln=FRA; L=FRA; k=${cookie.K}; ${cookie.TK}; ${sessionID}; ${rvpMod}`,
        },
    });

    return { sessionID, rvpMod };
}

/**
 * This function parses the provided HTML to create an array of Class
 * @param HTML The 'visualise' page's HTML content
 * @returns The user's schedule
 */
export async function schedulePageToClasses(HTML: string): Promise<Class[]> {
    const schedule: Class[] = [];
    const orderedSchedule: Class[][] = Array.from({ length: 5 }, () => []);

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

            let day = index + 1;
            for (const c of schedule) {
                if (
                    c.timeStart.day() <= day &&
                    !c.timeStart.date(1).isSame(timeStart.date(1)) &&
                    c.timeStart.date(1).isBefore(timeEnd.date(1)) &&
                    timeStart.date(1).isBefore(c.timeEnd.date(1))
                ) {
                    day += 1;
                }
            }

            const c: Class = {
                name: match[1],
                code: match[2],
                group: Number(match[3]),
                local: match[4],
                theory: match[5] === "T",
                teacher: match[6],
                virtual: match[7] !== "Présentiel",
                timeStart: timeStart.day(day),
                timeEnd: timeEnd.day(day),
            };

            orderedSchedule[day - 1].push(c);
            schedule.push(c);
        });
    }

    return await getScheduleForAllSession(orderedSchedule);
}

type UnknownPeriods = { timeStart: Dayjs; timeEnd: Dayjs }[];
type Image = { buffer: Buffer; width: number; height: number };

export async function getScheduleForAllSession(orderedSchedule: Class[][]): Promise<Class[]> {
    // TODO: Get the image from onmivox
    const url = "C:\\Users\\guibi\\Downloads\\HoraireSemaine2.gif";

    const image = sharp(url);
    const { width, height } = await image.metadata();
    const buffer = await image.raw().toBuffer();

    if (!width || !height) {
        throw "Bad image";
    }

    const classes: Class[] = [];
    for (let i = 0; i < 5; i++) {
        const unknownPeriods = scanDay(i, { buffer, width, height });

        for (const day of orderedSchedule) {
            if (unknownPeriods.length !== day.length) {
                continue;
            }

            if (
                unknownPeriods.every(
                    (period, index) =>
                        period.timeStart.isSame(day[index].timeStart) &&
                        period.timeEnd.isSame(day[index].timeEnd)
                )
            ) {
                // TODO: Put the good date + month + year
                classes.push(
                    ...day.map((c) => ({ ...c, timeStart: c.timeStart, timeEnd: c.timeEnd }))
                );
            }
        }
    }
    return classes;
}

function scanDay(weekdayToScan: number, image: Image): UnknownPeriods {
    const firstPeriod = 47;
    const periodHeoight = 60;
    const firstWidth = 122;
    const periodWidth = 281;

    function toDayjs(index: number) {
        return dayjs()
            .day(weekdayToScan + 1)
            .startOf("day")
            .hour(8)
            .minute(30 * index);
    }

    function getColorAtPosition(x: number, y: number) {
        const index = (image.width * y + x) * 3;
        return [image.buffer[index], image.buffer[index + 1], image.buffer[index + 2]];
    }

    const foundPeriods: UnknownPeriods = [];
    const x = firstWidth + periodWidth * weekdayToScan;
    let lastTime = -1;

    for (let i = 0; i < 21; i++) {
        const y = firstPeriod + periodHeoight * i - (i === 20 ? 1 : 0);

        if (x < image.width && y < image.height) {
            const [r, g, b] = getColorAtPosition(x, y);

            if (r === 0 && g === 0 && b === 0) {
                if (lastTime !== -1) {
                    const [r, g, b] = getColorAtPosition(x, y - 3);

                    if (r === 255 && g === 255 && b === 255) {
                        foundPeriods.push({ timeStart: toDayjs(lastTime), timeEnd: toDayjs(i) });
                    }
                }

                lastTime = i;
            }
        } else {
            console.error(`Invalid pixel coordinates: (${x}, ${y})`);
        }
    }

    return foundPeriods;
}

/**
 * Finds a regular expression match in the specified string.
 * @param {string|null} data The string to search for the regular expression match.
 * @param {RegExp} query The regular expression pattern to match in the string.
 * @returns {RegExpMatchArray} An array of matches that were found in the string.
 * @throws Throws a string error message if the specified string is null or the regular expression query does not match the string.
 */
function regexFind(data: string | null, query: RegExp): RegExpMatchArray {
    if (data == null) throw "MATCH ERROR: STRING WAS NULL";

    const match = data.match(query);
    if (match == null) throw `MATCH ERROR: '${query}' DIDN'T MATCH WITH PROVIDED STRING.`;

    return match;
}

type OmnivoxCookie = {
    COMN: string;
    DTKS: string;
    K: string;
    TK: string;
    baseUrl: string;
};

type ScheduleCookie = {
    sessionID: string;
    rvpMod: string;
};
