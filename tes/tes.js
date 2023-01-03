const PdfGen = require("../src/index");

const docname = "Ini sosialisasi kegiatan, hal HAL dari JUMLAH_HALAMAN"
const page = "HAL"
const pagecount = 'JUMLAH_HALAMAN'

var PdfGens = new PdfGen(
    {
        docname: docname, 
        docpath: 'https://raw.githubusercontent.com/rahadiana/eoffice-pdf/main/tes/exsample.pdf', 
        qrpath: 'https://raw.githubusercontent.com/rahadiana/eoffice-pdf/main/tes/q.png', 
        page: page, 
        pagecount: pagecount
    }
);

PdfGens.Build().then(console.log)