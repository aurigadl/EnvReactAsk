import fpdf


class TmpPdfFuec:
    # this will define the ELEMENTS that will compose the template.
    def __init__(self, nameCompany=None, companyLogo=None):
        self.nameCompany = nameCompany or 'Nameless'
        self.companyLogo = companyLogo or None

    def __call__(self):
        pdf = fpdf.FPDF(format='letter')
        pdf.set_margins(15, 15, 15)
        pdf.add_page()

        # Box margin

        # letf and right
        pdf.line(15, 15, 15, 265)
        pdf.line(201, 15, 201, 265)

        # top and bottom
        pdf.line(15, 15, 201, 15)
        pdf.line(15, 265, 201, 265)

        # image min-transporte
        pdf.image('server/image/min_transporte.jpg', 20, 24, 85, 13)
        pdf.image('server/image/blanco.jpg', 130, 22, 66, 13)

        # line split header
        pdf.line(15, 45, 201, 45)

        # text title
        pdf.set_font("Arial", 'B', size=10)
        pdf.set_y(45)
        pdf.multi_cell(w=181, h=6,
                       txt='FORMATO UNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PUBLICO DE TRANSPORTE TERRESTRE '
                           'AUTOMOTOR ESPECIAL', border=0, align='C')

        # line split title
        pdf.line(15, 57, 201, 57)

        pdf.code39('12342341234132445345', 18, 60, w=1, h=10)
        pdf.set_xy(122, 65)
        pdf.set_font("Arial", 'B', size=13)
        pdf.cell(w=80, h=2, txt='No 12342341234132445345', border=0, align='C')

        # table 3 rows and 2 columns
        # line split cell
        pdf.line(15, 75, 201, 75)
        pdf.line(15, 89, 201, 89)
        pdf.line(15, 82, 201, 82)
        pdf.line(15, 96, 201, 96)

        # Title table row 1 column 1
        pdf.set_xy(18, 78)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=101, h=2, txt='RAZON SOCIAL: ', border=0)
        # Content row1 column 1
        pdf.set_x(47)
        pdf.set_font("Arial", size=10)
        pdf.cell(w=101, h=2, txt='1 Este es un texto: ', border=0)

        # Title table row 2 column 1
        pdf.set_xy(18, 85)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=101, h=2, txt='CONTRATO No: ', border=0)
        # Content row2 column 1
        pdf.set_x(46)
        pdf.set_font("Arial", size=10)
        pdf.cell(w=101, h=2, txt='2 Este es otro texto: ', border=0)

        # Title table row 3 column 1
        pdf.set_xy(18, 92)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=101, h=2, txt='CONTRATANTE: ', border=0)
        # Content row3 column 1
        pdf.set_x(47)
        pdf.set_font("Arial", size=10)
        pdf.cell(w=101, h=2, txt='3 Este es otro texto: ', border=0)

        # Title table row 1 column 2
        pdf.set_xy(145, 78)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=5, h=2, txt='Nit: ', border=0)
        # Content row1 column 1
        pdf.set_x(151)
        pdf.set_font("Arial", size=10)
        pdf.cell(w=51, h=2, txt='1 Este es un texto: ', border=0)

        # Title table row 3 column 2
        pdf.set_xy(145, 92)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=13, h=2, txt='Nit/CC: ', border=0)
        # Content row3 column 1
        pdf.set_x(158)
        pdf.set_font("Arial", size=10)
        pdf.cell(w=41, h=2, txt='3 Este es otro texto: ', border=0)

        # Title Path
        # text title
        pdf.set_xy(18, 99)
        pdf.set_font("Arial", 'B', size=10)
        pdf.cell(w=10, h=0, txt='ORIGEN-DESTINO: ', border=0)
        # Content path
        pdf.set_font("Arial", size=10)
        pdf.set_xy(18, 102)
        pdf.multi_cell(w=201, h=4,
                       txt='FORMATO UNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PUBLICO DE TRANSPORTE TERRESTRE '
                                              'AUTOMOTOR ESPECIAL', border=0, align='L')

        return pdf.output('temp.pdf')
        # return pdf.output('temp.pdf', 'S')
