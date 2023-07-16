/**
 * @file Allows to interact with Omnivox. (login, schedule, etc)
 */

import type { Lesson } from "$lib/types";
import * as cheerio from "cheerio";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import sharp from "sharp";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/Montreal");

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
 * @param session The user's cookie session
 * @param year The year to fetch
 * @param semester The semester to fetch
 * @returns The HTML text of the schedule's page
 */
export async function fetchSchedulePageHTML(
    session: OmnivoxSession,
    year: number,
    semester: Semester
): Promise<PageHTML> {
    const scheduleCookies = await getScheduleCookies(session);

    // Get the 'visualise' link
    const res = await fetch(
        `https://${session.baseUrl}-estd.omnivox.ca:443/estd/hrre/Horaire.ovx`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": formatCookies(session.cookies, scheduleCookies),
            },
            body: `AnSession=${year + semester}&Confirm=Consulter+mon+horaire`,
        }
    );

    const text = await res.text();
    const visualiseURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // Fetch the actual schedule data
    const visualiseRes = await fetch(
        `https://${session.baseUrl}-estd.omnivox.ca:443/estd/hrre/${visualiseURL}&typeHoraire=Session`,
        {
            headers: {
                Cookie: formatCookies(session.cookies, scheduleCookies),
            },
        }
    );

    const buffer = await visualiseRes.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1");
    return {
        html: decoder.decode(buffer),
        session,
        scheduleCookies,
        semester,
        year,
        visualiseURL,
    };
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
export async function login(
    email: string,
    password: string
): Promise<{ session: OmnivoxSession; mfa?: { type: "T" | "E"; id: string } }> {
    const match = regexFind(email, /(\d{7})@(.*).qc.ca/);
    const da = match[1];
    const baseUrl = match[2];

    // GET COOKIES
    const firstRes = await fetch(`https://${baseUrl}.omnivox.ca:443/Login/Account/Login`);
    const formK = regexFind(
        await firstRes.text(),
        /<input id="k" name="k" type="hidden" value="(.*?)" \/>/
    )[1];

    const firstCookies = extractCookies(firstRes.headers);

    // LOGIN
    const res = await fetch(
        `https://${baseUrl}.omnivox.ca:443/intr/Module/Identification/Login/Login.aspx`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": formatCookies(firstCookies),
            },
            redirect: "manual",
            body: `StatsEnvUsersNbCouleurs=24&StatsEnvUsersResolution=1536&k=${formK}&TypeLogin=PostSolutionLogin&TypeIdentification=Etudiant&ReturnUrl=%2Fintr%2F&NoDA=${da}&PasswordEtu=${password}`,
        }
    );

    if (res.headers.get("Location")?.includes("?erreur=ERROR_0028")) {
        throw "ERROR WHILE LOGIN: BAD CREDENTIALS";
    }

    const cookies = extractCookies(res.headers, firstCookies);

    const match2FA = res.headers
        .get("Location")
        ?.match(/\/apps\/mfa\/login\/validate-method\/(.*)/);
    if (match2FA) {
        const apiRes = await fetch(
            `https://${baseUrl}.omnivox.ca:443/api/mfa/login/validate-method/${match2FA[1]}`,
            {
                headers: {
                    Cookie: formatCookies(cookies),
                },
            }
        );
        const json = (await apiRes.json()) as Method2FA;
        const apiCookies = extractCookies(apiRes.headers, cookies);
        return {
            session: { baseUrl, cookies: apiCookies },
            mfa: { type: json.methodType, id: json.idUserValidationMethod },
        };
    }

    return { session: { baseUrl, cookies }, mfa: undefined };
}

export async function submitCode2FA(
    code: string,
    session: OmnivoxSession,
    id: string
): Promise<{ success: false } | { success: true; session: OmnivoxSession }> {
    const cookiesEntries = Object.entries(session.cookies);
    const tksm = cookiesEntries.find(([v]) => v.startsWith("TKSM"));
    const xsrf = cookiesEntries.find(([v]) => v === "XSRF-REQUEST-TOKEN")?.[1];

    if (!tksm) {
        throw "No TKSM found while trying to send 2FA.";
    }

    const postRes = await fetch(
        `https://${session.baseUrl}.omnivox.ca:443/api/mfa/login/validate/code`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": formatCookies(session.cookies),
                "X-Xsrf-Token": xsrf ?? "",
            },
            body: JSON.stringify({
                idUserValidationMethod: id,
                tksm: tksm[1] ?? "",
                code: code,
                saveDevice: false,
            }),
        }
    );
    const postCookies = extractCookies(postRes.headers, session.cookies);
    const json = await postRes.json();

    if (json.result !== "Valid") {
        console.error("2FA FAIL");
        return { success: false };
    }

    delete postCookies["X-XSRF-KEY"];
    delete postCookies[tksm[0]];
    postCookies["olt"] = json.olt;

    const loginRes = await fetch(
        `https://${session.baseUrl}.omnivox.ca:443/intr/Module/Identification/Login/Login.aspx`,
        {
            headers: {
                Cookie: formatCookies(postCookies),
            },
            redirect: "manual",
        }
    );

    delete postCookies["olt"];
    const loginCookies = extractCookies(loginRes.headers, postCookies);

    return { success: true, session: { baseUrl: session.baseUrl, cookies: loginCookies } };
}

/**
 * This function prepares Onmivox so that the user's schedule can be fetched
 * @param {OmnivoxSession} session The user's session cookie
 * @returns The prepared schedule's specific session ID
 */
async function getScheduleCookies(session: OmnivoxSession): Promise<ScheduleCookies> {
    const res = await fetch(
        `https://${session.baseUrl}-estd.omnivox.ca:443/estd/vl.ovx?lk=%2festd%2fhrre%2fHoraire.ovx`,
        {
            headers: {
                Cookie: formatCookies(session.cookies),
            },
        }
    );

    const cookies = extractCookies(res.headers, session.cookies);

    // Get the load session url
    const text = await res.text();
    const loadSessionURL = decodeURIComponent(
        regexFind(text, /<body .*decodeURIComponent\('(.*)'.*>/)[1]
    );

    // This is so that omnvivox allows us to look at the schedule
    await fetch(`https://${session.baseUrl}-estd.omnivox.ca:443/estd/${loadSessionURL}`, {
        headers: {
            Cookie: formatCookies(session.cookies, cookies),
        },
    });

    return cookies;
}

/**
 * This function parses the provided HTML to create an array of Class,
 * which is then used to parse the user's entire session
 * @param htmlPage The PageHTML returned by `fetchSchedulePageHTML`
 * @returns The user's schedule for the entire session
 */
export async function schedulePageToClasses(htmlPage: PageHTML): Promise<Omit<Lesson, "id">[]> {
    const schedule: Omit<Lesson, "id">[] = [];
    const orderedSchedule: Omit<Lesson, "id">[][] = Array.from({ length: 5 }, () => []);

    const $ = cheerio.load(htmlPage.html);
    const rows = $("table .CelluleHoraire > tbody > tr:not(:first)");

    for (const row of rows) {
        const timeStart = dayjs(
            regexFind($("td:first > font", row).html(), /(\d{2}:\d{2})(?:<br>)*\d{2}:\d{2}/)[1] +
                "",
            "HH:mm"
        );
        const listTdTag = $("td:not(:first)", row);

        listTdTag.each((index, tdTag) => {
            const fontTags = $("b < font", tdTag);
            if (fontTags.length === 0) return;

            const match = regexFind(
                fontTags.first().html(),
                /<b>(.+?)<\/b>(?:<br>(.+?) gr.(.+?))?<br>(?:Local (.+?))?(?:&nbsp;)*([TL])?(?:<br>(.+?))?<br>(?:<font.*?><b><i>(.+?)<\/i><\/b><\/font>)?/
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

            const c: Omit<Lesson, "id"> = {
                name: match[1],
                code: match[2] || "",
                group: match[3] ? Number(match[3]) : 0,
                local: match[4] || "",
                theory: match[5] !== "L",
                teacher: match[6] || "",
                virtual: match[7] ? match[7] !== "Présentiel" : false,
                timeStart: timeStart.day(day),
                timeEnd: timeEnd.day(day),
            };

            orderedSchedule[day - 1].push(c);
            schedule.push(c);
        });
    }

    return await getScheduleForAllSession(htmlPage, orderedSchedule);
}

/**
 * Fetches the user's schedule week by week from Omnivox
 * @param htmlPage The PageHTML returned by `fetchSchedulePageHTML`
 * @param orderedSchedule An array containing 5 days of Class fetched from Omnivox
 * @returns A proper array of class for the entire session
 */
async function getScheduleForAllSession(
    htmlPage: PageHTML,
    orderedSchedule: Omit<Lesson, "id">[][]
): Promise<Omit<Lesson, "id">[]> {
    const classes: Omit<Lesson, "id">[] = [];
    let currentMonday = dayjs().startOf("day").day(-8);
    let lastClassesLength = 0;
    let emptyWeeksInARow = 0;

    // Fetch the week image url
    const iframeRes = await fetch(
        `https://${htmlPage.session.baseUrl}-estd.omnivox.ca:443/estd/hrre/${htmlPage.visualiseURL}&typeHoraire=Semaine`,
        {
            headers: {
                Cookie: formatCookies(htmlPage.session.cookies, htmlPage.scheduleCookies),
            },
        }
    );
    const iframeSearchParams = regexFind(
        await iframeRes.text(),
        /src='\/Estd\/Net\/HoraireClara\/Default\.aspx\?(.*?)'/
    )[1];

    const claraText = await (
        await fetch(
            `https://${htmlPage.session.baseUrl}-estd.omnivox.ca:443/Estd/Net/HoraireClara/Default.aspx?${iframeSearchParams}`,
            {
                headers: {
                    Cookie: formatCookies(htmlPage.session.cookies, htmlPage.scheduleCookies),
                },
            }
        )
    ).text();
    const formViewState = regexFind(claraText, /id="__VIEWSTATE" value="(.*?)"/)[1];
    const formEventValidation = regexFind(claraText, /id="__EVENTVALIDATION" value="(.*?)"/)[1];

    // While there is no more than three consecutives weeks without any classes
    while (emptyWeeksInARow < 3) {
        // Fetch the week image url
        const weekText = await (
            await fetch(
                `https://${htmlPage.session.baseUrl}-estd.omnivox.ca:443/Estd/Net/HoraireClara/Default.aspx?${iframeSearchParams}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cookie": formatCookies(htmlPage.session.cookies, htmlPage.scheduleCookies),
                    },
                    body: `__EVENTTARGET=ctl00%24cntFormulaire%24btnChangeDate&__EVENTARGUMENT=&__VIEWSTATE=${encodeURIComponent(
                        formViewState
                    )}&__EVENTVALIDATION=${encodeURIComponent(
                        formEventValidation
                    )}&ctl00%24cntFormulaire%24ddlJour=${currentMonday.date()}&ctl00%24cntFormulaire%24ddlMois=${
                        currentMonday.month() + 1
                    }&ctl00%24cntFormulaire%24ddlAnnee=${currentMonday.year()}`,
                }
            )
        ).text();

        const weekImageURL = regexFind(weekText, /src="(HoraireSemaine\.ashx.*?)"/)[1];

        // Fetch the week's image
        const imageRes = await fetch(
            `https://${htmlPage.session.baseUrl}-estd.omnivox.ca:443/Estd/Net/HoraireClara/${weekImageURL}`,
            {
                headers: {
                    Cookie: formatCookies(htmlPage.session.cookies, htmlPage.scheduleCookies),
                },
            }
        );

        const image = sharp(await imageRes.arrayBuffer());
        const { width, height } = await image.metadata();
        const buffer = await image.raw().toBuffer();

        if (!width || !height) {
            throw "Bad image";
        }

        lastClassesLength = classes.length;

        // For each day of the week
        for (let i = 0; i < 5; i++) {
            const unknownPeriods = scanDay(i, { buffer, width, height });

            for (const day of orderedSchedule) {
                if (unknownPeriods.length !== day.length) {
                    continue;
                }

                if (
                    unknownPeriods.every(
                        (period, index) =>
                            period.timeStart.date(1).isSame(day[index].timeStart.date(1)) &&
                            period.timeEnd.date(1).isSame(day[index].timeEnd.date(1))
                    )
                ) {
                    classes.push(
                        ...day.map((c) => ({
                            ...c,
                            timeStart: currentMonday
                                .day(i + 1)
                                .hour(c.timeStart.hour())
                                .minute(c.timeStart.minute()),
                            timeEnd: currentMonday
                                .day(i + 1)
                                .hour(c.timeEnd.hour())
                                .minute(c.timeEnd.minute()),
                        }))
                    );
                }
            }
        }

        currentMonday = currentMonday.add(1, "week");
        // If no periods this week
        if (classes.length === lastClassesLength) {
            emptyWeeksInARow += 1;
        } else {
            emptyWeeksInARow = 0;
        }
    }

    return classes;
}

/**
 *
 * @param currentWeekday
 * @param image
 * @returns
 */
function scanDay(currentWeekday: number, image: Image) {
    // Image position found by-hand
    const firstPeriodY = 47;
    const periodHeight = 60;
    const firstDayX = 122;
    const dayWidth = 281;
    const numberOfRows = 21;

    /**
     * Converts the row to a dayjs
     */
    function rowToDayjs(rowIndex: number) {
        return dayjs()
            .day(currentWeekday + 1)
            .startOf("day")
            .hour(8)
            .minute(30 * rowIndex);
    }

    /**
     * Returns the RGB value of the specified pixel in an array
     */
    function getColorAtPosition(x: number, y: number) {
        const index = (image.width * y + x) * 3;
        return [image.buffer[index], image.buffer[index + 1], image.buffer[index + 2]];
    }

    const foundPeriods: { timeStart: Dayjs; timeEnd: Dayjs }[] = [];
    const x = firstDayX + dayWidth * currentWeekday;
    let lastFoundRow = -1;

    // For each row of the image (all the times)
    for (let row = 0; row < numberOfRows; row++) {
        const y = firstPeriodY + periodHeight * row - (row === 20 ? 1 : 0);

        // If the pixel is outside of our image
        if (x >= image.width || y >= image.height) {
            console.error(`Invalid pixel coordinates: (${x}, ${y})`);
            continue;
        }

        const [r, g, b] = getColorAtPosition(x, y);

        // If the pixel is black (the border of a period)
        if (r === 0 && g === 0 && b === 0) {
            // If it isnt the first border we find
            if (lastFoundRow !== -1) {
                const [r, g, b] = getColorAtPosition(x, y - 3);

                // If the pixel over the current Y is white (inside a period)
                if (r === 255 && g === 255 && b === 255) {
                    foundPeriods.push({
                        timeStart: rowToDayjs(lastFoundRow),
                        timeEnd: rowToDayjs(row),
                    });
                }
            }

            lastFoundRow = row;
        }
    }

    return foundPeriods;
}

function extractCookies(headers: Headers, cookies: Cookies = {}) {
    const setCookies = headers.get("set-cookie");

    if (!setCookies) {
        return cookies;
    }

    const matches = setCookies.matchAll(/([-a-zA-Z1-9]*?)=(.*?); .*?path=.*?(?:,\s?|$)/g);

    if (!matches) return cookies;

    for (const match of matches) {
        if (match[2] == "" && match[1] != "k") {
            delete cookies[match[1]];
        } else {
            cookies[match[1]] = match[2];
        }
    }

    return cookies;
}

function formatCookies(...cookies: Cookies[]): string {
    return cookies.flatMap((c) => Object.entries(c).map(([k, v]) => `${k}=${v}`)).join("; ");
}

/**
 * Finds a regular expression match in the specified string.
 * @param {string|null} data The string to search for the regular expression match.
 * @param {RegExp} query The regular expression pattern to match in the string.
 * @returns {RegExpMatchArray} An array of matches that were found in the string.
 * @throws Throws a string error message if the specified string is null or the regular expression query does not match the string.
 */
function regexFind(data: string | null, query: RegExp): RegExpMatchArray {
    if (data === null) {
        throw "MATCH ERROR: STRING WAS NULL";
    }

    const match = data.match(query);
    if (match === null) {
        throw `MATCH ERROR: '${query}' DIDN'T MATCH WITH PROVIDED STRING.`;
    }

    return match;
}

type Cookies = Record<string, string>;

type OmnivoxSession = {
    baseUrl: string;
    cookies: Cookies;
};

type ScheduleCookies = Cookies;

type PageHTML = {
    html: string;
    session: OmnivoxSession;
    scheduleCookies: ScheduleCookies;
    year: number;
    semester: Semester;
    visualiseURL: string;
};

type Image = { buffer: Buffer; width: number; height: number };

// JSON returned by "/api/mfa/login/validate-method/xxxxx"
type Method2FA = {
    idUserValidationMethod: string;
    methodType: "T" | "E";
    data: string;
    hasOtherMethods: boolean;
};

// JSON returned by "/api/mfa/login/validate-methods"
// type Methods2FA = Omit<Method2FA, "hasOtherMethods">[];
