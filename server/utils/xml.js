//xml

// funktioner der laves her
//Læse XML
//Skrive/Oprette XML


// Hjælpefunktioner til at læse og skrive XML filer
import fs from "fs";
import xml2js from "xml2js";

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();


// Læser XML fil og konverterer til JS objekt
export async function readXML(path) {
    const data = fs.readFileSync(path, "utf-8");
    return await parser.parseStringPromise(data);
}


// Skriver JS objekt til XML fil
export function writeXML(path, obj) {
    const xml = builder.buildObject(obj);
    fs.writeFileSync(path, xml);
}