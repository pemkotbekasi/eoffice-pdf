# eoffice-pdf

simple pdf footer generation , modul yang digunakan pada aplikasi e-office kota bekasi

# INSTALLING

    npm i @rahadiana/eoffice-pdf

# USAGE

    const  PdfGen = require("@rahadiana/eoffice-pdf");
    const  docname = "Ini sosialisasi kegiatan, hal HAL dari JUMLAH_HALAMAN"
    const  page = "HAL"
    const  pagecount = 'JUMLAH_HALAMAN'
    
    var  PdfGens = new  PdfGen(
	{
	    docname:  docname,
		docpath:  'https://raw.githubusercontent.com/rahadiana/eoffice-pdf/main/tes/exsample.pdf',
		qrpath: 'https://raw.githubusercontent.com/rahadiana/eoffice-pdf/main/tes/q.png',
		page:  page,
		pagecount:  pagecount
	});
	    
    PdfGens.Build().then(console.log)


RESPONSE

    {"success":true,"code":200,"message":"dokumen berhasil dibuat","data":{"file":"8lLsj1M6T..."}}



Untuk lebih detail silahkan lihat [README.md](https://github.com/rahadiana/eoffice-pdf/blob/main/README.md)
