class BenYehudaDataSet {
    constructor(row) {
        this.general_note = row["General Note"];
        this.genre = row["Genre"];
        this.author_id = row["Author Id"];
        this.work_id = row["Work Id"];
        this.work_name = row["work_name"];
        this.edition_details = row["Edition Details"];
        this.binding_book = row["binding_book"];
        this.volume = row["volume"];
        this.edition_id = row["Edition Id"];
        this.more_information = row["more_information"];
        this.type = row["Type"];
        this.manually_changed = row["Manually changed"];
    }
}

function title_in_ben_yehuda(title) {
    let i = 0;
    while (i < result_csv.length) {
        if (result_csv[i] && result_csv[i]["work_name"].includes(title) == true) {
            return true;
        }
        i = i + 1;
    }
    return false;
}

function subtitle_in_ben_yehuda(subtitle) {
    let i = 0;
    while (i < result_csv.length) {
        if (result_csv[i] && result_csv[i]["work_name"].includes(subtitle) == true) {
            return true;
        }
        i = i + 1;
    }
    return false;
}

function topic_in_ben_yehuda(topic) {
    let i = 0;
    while (i < result_csv.length) {
        if (result_csv[i] && result_csv[i]["work_name"].includes(topic) == true) {
            return true;
        }
        i = i + 1;
    }
    return false;
}

function note_in_ben_yehuda(note) {
    let i = 0;
    while (i < result_csv.length) {
        if (result_csv[i] && result_csv[i]["work_name"].includes(note) == true) {
            return true;
        }
        i = i + 1;
    }
    return false;
}


let result_csv = []; // hashmap: book-title => sipor kazar or not
const path_csv = __dirname + "\\sources\\Mapping the Ben Yehuda project.csv";
const fs_csv = require('fs');
const csv = require('fast-csv');

fs_csv.createReadStream(path_csv)
    .pipe(csv.parse({headers: true}))
    .on('error', error => console.error(error))
    .on('data', row => result_csv.push(row))
    .on('end', () => {
            // result_csv = result_csv.map(row => new BenYehudaDataSet(row));
            console.log("Start");

            const fs = require('fs');
            const {Marc} = require('marcjs');

            const path = __dirname + "\\target\\bhball.xml";
            let result = new Map(); // hashmap: book-title => sipor kazar or not
            let reader = Marc.stream(fs.createReadStream(path), 'marcxml');
            let writers = ['marcxml', 'iso2709', 'json', 'text']
                .map(type => Marc.stream(fs.createWriteStream('results\\Short Stories.' + type), type));

            reader.on('data', (record) => {
                let title = record.fields.filter((field) => field[0] == "245" && field.indexOf("a") !== -1)[0];
                let subtitle = record.fields.filter((field) => field[0] == "245" && field.indexOf("b") !== -1)[0];
                let notes = record.fields.filter((field) => field[0] == "500");
                let topic = record.fields.filter((field) => field[0] == "690")[0];

                if (title) {
                    title = title[title.length - 1];
                    if (title.includes("סיפורים קצרים") ||
                        title.includes("סיפור קצר") ||
                        title.includes("סיפורים הומוריסטיים קצרים") ||
                        title.includes("סיפור היתולי קצר") ||
                        title.includes("סיפורים היתולים קצרים") ||
                        title.includes("רומן קצר") ||
                        title.includes("רומנים קצרים") ||
                        title.includes("פרוזה") ||
                        title.includes("פרוזות") ||
                        title.includes("סיפור הומוריסטי קצר") ||
                        title.includes("סיפורים הומוריסטים קצרים") ||
                        title_in_ben_yehuda(title)
                    ) {
                        writers.forEach((writer) => writer.write(record));
                        result.set(title, true);
                        return;
                    }
                }

                if (subtitle) {
                    subtitle = subtitle[subtitle.length - 1];
                    if (subtitle.includes("סיפורים קצרים") ||
                        subtitle.includes("סיפור קצר") ||
                        subtitle.includes("סיפורים הומוריסטיים קצרים") ||
                        subtitle.includes("סיפור היתולי קצר") ||
                        subtitle.includes("סיפורים היתולים קצרים") ||
                        subtitle.includes("רומן קצר") ||
                        subtitle.includes("רומנים קצרים") ||
                        subtitle.includes("פרוזה") ||
                        subtitle.includes("פרוזות") ||
                        subtitle.includes("סיפור הומוריסטי קצר") ||
                        subtitle.includes("סיפורים הומוריסטים קצרים") ||
                        subtitle_in_ben_yehuda(subtitle)
                    ) {
                        writers.forEach((writer) => writer.write(record));
                        result.set(title, true);
                        return;
                    }
                }

                if (topic) {
                    topic = topic[topic.length - 1];
                    if (topic.includes("סיפורים קצרים") ||
                        topic.includes("סיפור קצר") ||
                        topic.includes("סיפורים הומוריסטיים קצרים") ||
                        topic.includes("סיפור היתולי קצר") ||
                        topic.includes("סיפורים היתולים קצרים") ||
                        topic.includes("רומן קצר") ||
                        topic.includes("רומנים קצרים") ||
                        topic.includes("פרוזה") ||
                        topic.includes("פרוזות") ||
                        topic.includes("סיפור הומוריסטי קצר") ||
                        topic.includes("סיפורים הומוריסטים קצרים") ||
                        topic_in_ben_yehuda(topic)
                    ) {
                        writers.forEach((writer) => writer.write(record));
                        result.set(title, true);
                        return;
                    }
                }

                if (notes) {
                    for (let note of notes) {
                        note = note[note.length - 1];
                        if (note.includes("סיפורים קצרים") ||
                            note.includes("סיפור קצר") ||
                            note.includes("סיפורים הומוריסטיים קצרים") ||
                            note.includes("סיפור היתולי קצר") ||
                            note.includes("סיפורים היתולים קצרים") ||
                            note.includes("רומן קצר") ||
                            note.includes("רומנים קצרים") ||
                            note.includes("פרוזה") ||
                            note.includes("פרוזות") ||
                            note.includes("סיפור הומוריסטי קצר") ||
                            note.includes("סיפורים הומוריסטים קצרים") ||
                            note_in_ben_yehuda(note)
                        ) {
                            writers.forEach((writer) => writer.write(record));
                            result.set(title, true);
                            return;
                        }
                    }
                }

                // result.set(title, false);
            }).on('end',
                () => {
                    writers.forEach(writer => writer.end());
                    console.log("finish");
                    console.log(result);
                }
            );

        }
    );

// const {Marc} = require('marcjs');
// const fs = require('fs');
//
// let reader = Marc.stream(fs.createReadStream('bib.mrc'), 'Iso2709');
// let writers = ['marcxml', 'iso2709', 'json', 'text']
//     .map(type => Marc.stream(fs.createWriteStream('bib-edited.' + type), type));
// // let trans = Marc.transform(record => {
// //     record.fields = record.fields.filter((field) => field[0][0] !== '6' && field[0][0] !== '8' );
// //     record.append( [ '801', '  ', 'a', 'Tamil s.a.r.l.', 'b', '2021-01-01' ] );
// // });
// reader.on('data', (record) => {
//     // trans.write(record);
//     // record = trans.read(record);
//     writers.forEach((writer) => writer.write(record));
// });
// var tick = setInterval(() => {
//     console.log(reader.count);
// }, 100);
// reader.on('end', () => {
//     writers.forEach(writer => writer.end());
//     console.log("Number of processed biblio records: " + reader.count);
//     clearInterval(tick);
// });