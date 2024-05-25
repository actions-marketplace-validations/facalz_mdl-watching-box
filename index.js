const axios = require('axios');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');
require('dotenv/config');

async function main(gistId, githubToken, user, gistTitle) {

    if (!user || !gistId || !githubToken) {
        console.log('Invalid configuration! To know more: https://github.com/facalz-npm/mdl-watching-box#readme');
        return process.exit(1);
    };

    if (!gistTitle) gistTitle = '📺 Currently Watching | MyDramalist';

    const octokit = new Octokit({
        auth: `token ${githubToken}`
    });

    async function updateGist(lines, desc) {
        let gist;
        try {
            gist = await octokit.gists.get({
                gist_id: gistId
            });
        } catch (error) {
            console.error(`Unable to get gist\n${error}`);
        };

        const filename = Object.keys(gist.data.files)[0];

        try {
            await octokit.gists.update({
                gist_id: gistId,
                files: {
                    [filename]: {
                        filename: desc,
                        content: lines
                    }
                }
            });
        } catch (error) {
            console.error(`Unable to update gist\n${error}`);
        };
    };

    function truncate(str, maxLength) {
        let visualLength = 0;
        let lastNonSpaceIndex = -1;

        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            visualLength += charCode >= 0x4E00 && charCode <= 0x9FFF ? 3 : 1;

            if (str[i] !== ' ') {
                lastNonSpaceIndex = i;
            }

            if (visualLength > maxLength - 1) {
                if (str[lastNonSpaceIndex] === ' ') {
                    return str.slice(0, lastNonSpaceIndex) + '… ' + (i < str.length ? '' : '');
                } else {
                    return str.slice(0, lastNonSpaceIndex + 1) + '… ' + (i < str.length ? '' : '');
                }
            }
        }

        return str.padEnd(maxLength);
    }

    var id = [],
        title = [],
        country = [],
        year = [],
        type = [],
        progress = [],
        lines = [];

    var countries = {
        'South Korea': 'KR',
        'Japan': 'JP',
        'China': 'CN',
        'Taiwan': 'TW',
        'Hong Kong': 'HK',
        'Thailand': 'TH',
        'Philippines': 'PH'
    };

    async function scrap(user) {
        const data = await axios.get('https://mydramalist.com/dramalist/' + user).then((res) => res.data);
        const $ = cheerio.load(data);

        $('#mylist_1 tr').each((i, elem) => {
            let idText = $(elem).find('th:nth-child(1)').text();
            let titleText = $(elem).find('.mdl-style-col-title>.title span').text();
            let countryText = $(elem).find('td:nth-child(3)').text();
            let yearText = $(elem).find('td:nth-child(4)').text();
            let typeText = $(elem).find('td:nth-child(5)').text();
            let progressText = $(elem).find('td:nth-child(7)').text();

            if (idText && titleText && countryText && yearText && typeText && progressText) {
                id.push(idText);
                title.push(titleText);
                country.push(countryText);
                year.push(yearText);
                type.push(typeText);
                progress.push(progressText);
            }
        });

        for (let i = 0; i < id.length; i++) {
            country[i] = countries[country[i]];
            year[i] = `(${year[i]})`;
            type[i] = type[i].replace('Drama Special', 'Drama S.');

            lines.push(`${truncate(title[i], 33).padEnd(33)} ${year[i]} ${type[i].padStart(8)} ${progress[i].padStart(9)}`);
        };

        return lines.join('\n');
    };

    try {
        var data = await scrap(user);
        if (!data) data = 'Nothing around here...'
        updateGist(data, gistTitle);
    } catch (error) {
        console.log('Invalid user!');
    };
};

module.exports = main;