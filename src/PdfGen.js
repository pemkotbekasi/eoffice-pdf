"use strict";
let {ResponseHandler} = require('@rahadiana/node_response_standard')

const PdfGen = function (options) {
    if (!(this instanceof PdfGen)) 
        return new PdfGen(options);
    
    this.docname = options.docname;
    this.docpath = options.docpath;
    this.qrpath = options.qrpath;
    this.page = options.page;
    this.pagecount = options.pagecount;

    return this;
};

const getBase64 = function (url) {
    return new Promise(async (resolve) => {
        try {
            const axios = require('axios');
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            }, {timeout: 12000});
            return resolve(Buffer.from(response.data).toString('base64'))
        } catch (err) {
            return resolve(ResponseHandler(err.code, '', err.message))
        }
    })
}

const FileChecker = function (data) {
    return new Promise(async (resolve) => {
        try {
            const fs = require('fs');
            const val = data
            const res = val.substring(7, 0) == "http://"
                ? await getBase64(val)
                : val.substring(8, 0) == "https://"
                    ? await getBase64(val)
                    : fs.existsSync(val) == true
                        ? fs.readFileSync(val, {encoding: 'base64'})
                        : '';
            return resolve(await res);
        } catch (e) {
            return resolve(e);
        }
    })
}

PdfGen.prototype.Build = function () {
    return new Promise(async (resolve) => {
        try {
            const {PDFDocument, StandardFonts} = require("pdf-lib");
            const pdfDoc = await PDFDocument.load(await FileChecker(this.docpath));
            const imgBuffer = await FileChecker(this.qrpath);
            const img = await pdfDoc.embedPng(imgBuffer);
            const amountOfPages = pdfDoc.getPages().length;
            const courierBoldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
            for (let i = 1; i < amountOfPages + 1; i++) {
                const PageNumer = pdfDoc.getPage(i - 1)
                const PageWidth = PageNumer.getWidth()
                const PageHeight = PageNumer.getHeight()
                const PageY = PageHeight - (PageHeight * 0.95) + 9
                const PageX = PageWidth - (PageWidth * 0.93)
                const PageMaxWidth = PageWidth - 150

                function CompareImageText(Val) {
                    return Val > 612
                        ? PageX + 20
                        : PageY;
                }

                function CompareY(Val) {
                    return Val > 612
                        ? PageY + 38
                        : PageY + 18;
                }

                function Qrnya(Val) {
                    return Val > 612
                        ? 20
                        : 0;
                }
                let result = this
                    .docname
                    .replace(this.page, i)
                    .replace(this.pagecount, amountOfPages);

                PageNumer.drawText(result, {
                    maxWidth: PageMaxWidth,
                    lineHeight: 12,
                    x: CompareImageText(PageWidth) + 45,
                    y: CompareY(PageWidth),
                    font: courierBoldFont,
                    size: 8
                });

                PageNumer.drawImage(img, {
                    x: PageX,
                    y: PageHeight / (PageHeight * 0.95) + 23,
                    width: PageY + Qrnya(PageWidth),
                    height: PageY + Qrnya(PageWidth)
                });
            }
            const u8 = new Uint8Array(await pdfDoc.save());
            const b64 = Buffer.from(u8).toString('base64');

            return resolve(ResponseHandler(200, {
                file: b64
            }, 'dokumen berhasil dibuat'))
        } catch (err) {
            return resolve(ResponseHandler(400, "", err))
        }
    })
}

module.exports = PdfGen;
