import fpdf


class TmpPdfFuec:
    # this will define the ELEMENTS that will
    # compose the template.
    def __init__(self
                 , nameCompany=None
                 , companyLogo=None
                 , code_fuec=None
                 , social_object=None
                 , nit=None
                 , no_agreefuec=None
                 , contractor=None
                 , id_contractor=None
                 , object_agreement=None
                 , route=None
                 , kindAgreement=' '
                 , kind_agreement_link=' '
                 , text_init_date=None
                 , text_last_date=None
                 , car_no=None
                 , car_license_plate=None
                 , car_model=None
                 , car_brand=None
                 , car_class_car=None
                 , car_operation=None
                 , data_drivers=None
                 , contractor_owner=None
                 , img_sign=None):

        self.nameCompany = nameCompany
        self.companyLogo = companyLogo
        self.code_fuec = code_fuec
        self.social_object = social_object
        self.nit = nit
        self.no_agreefuec = no_agreefuec
        self.contractor = contractor
        self.id_contractor = id_contractor
        self.object_agreement = object_agreement

        self.kind_agreement_1 = ' '
        self.kind_agreement_2 = ' '
        self.kind_agreement_3 = ' '
        if kindAgreement is 1:
            self.kind_agreement_1 = 'X'
        elif kindAgreement is 2:
            self.kind_agreement_2 = 'X'
        elif kindAgreement is 3:
            self.kind_agreement_3 = 'X'

        self.kind_agreement_link = kind_agreement_link

        self.img_sign = img_sign

        self.car_no = car_no
        self.car_license_plate = car_license_plate
        self.car_model = car_model
        self.car_brand = car_brand
        self.car_class_car = car_class_car
        self.car_operation = car_operation

        self.text_init_date = text_init_date
        self.text_last_date = text_last_date

        self.data_drivers = data_drivers
        self.contractor_owner = contractor_owner
        self.route = route

    def __call__(self):

        route = ''

        text_init_date_y = self.text_init_date[0]
        text_init_date_m = self.text_init_date[1]
        text_init_date_d = self.text_init_date[2]

        text_last_date_y = self.text_last_date[0]
        text_last_date_m = self.text_last_date[1]
        text_last_date_d = self.text_last_date[2]

        for i in range(len(self.route)):
            route += 'Ruta '+ i + '' + route[i] + ''

        pdf = fpdf.FPDF(format='letter')
        pdf.set_margins(15, 15, 15)
        pdf.add_page()

        pdf.set_line_width(0.1)

        # Box margin
        # letf and right
        pdf.line(15, 15, 15, 265)
        pdf.line(201, 15, 201, 265)

        # top and bottom
        pdf.line(15, 15, 201, 15)
        pdf.line(15, 265, 201, 265)

        # image min-transporte
        pdf.image('server/image/min_transporte.jpg', 20, 24, 85, 13)
        pdf.image('server/image/blanco.jpg', 130, 18.5, 66, 23)

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

        # Code bar
        pdf.code39(self.code_fuec, 20, 60, w=1, h=10)
        pdf.set_xy(122, 65)
        pdf.set_font("Arial", 'B', size=13)
        pdf.cell(w=80, h=2, txt='No ' + self.code_fuec, border=0, align='C')

        # table 3 rows and 2 columns
        # line split cell
        pdf.line(15, 75, 201, 75)
        pdf.line(15, 82, 201, 82)
        pdf.line(15, 89, 201, 89)
        pdf.line(15, 96, 201, 96)
        pdf.line(15, 104, 201, 104)
        pdf.line(15, 111, 201, 111)
        pdf.line(15, 134, 201, 134)
        pdf.line(15, 151, 201, 151)
        pdf.line(15, 163, 201, 163)
        pdf.line(15, 207, 201, 207)


        # Title table row 1 column 1
        pdf.set_xy(17, 78)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=101, h=2, txt='RAZON SOCIAL: ', border=0)
        # Content row1 column 1
        pdf.set_x(47)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=101, h=2, txt=self.social_object, border=0)

        # Title table row 2 column 1
        pdf.set_xy(17, 85)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=101, h=2, txt='CONTRATO No: ', border=0)
        # Content row2 column 1
        pdf.set_x(46)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=101, h=2, txt=self.no_agreefuec, border=0)

        # Title table row 3 column 1
        pdf.set_xy(17, 92)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=101, h=2, txt='CONTRATANTE: ', border=0)
        # Content row3 column 1
        pdf.set_x(47)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=101, h=2, txt=self.contractor, border=0)

        # Title table row 1 column 2
        pdf.set_xy(145, 78)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=5, h=2, txt='Nit: ', border=0)
        # Content row1 column 1
        pdf.set_x(151)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=51, h=2, txt=self.nit, border=0)

        # Title table row 3 column 2
        pdf.set_xy(145, 92)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=13, h=2, txt='Nit/CC: ', border=0)
        # Content row3 column 1
        pdf.set_x(158)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=41, h=2, txt=self.id_contractor, border=0)

        # Title
        pdf.set_xy(17, 99)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=46, h=2, txt='OBJETO DEL CONTRATO: ', border=0)
        # Content
        pdf.set_xy(64, 99)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=170, h=2, txt=self.object_agreement, border=0)

        # Title
        pdf.set_xy(17, 107)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=23, h=2, txt='CONVENIO: ', border=0)
        # Content
        pdf.set_xy(38, 107)
        pdf.set_font("Arial", size=12)
        pdf.cell(w=3, h=2, txt=self.kind_agreement_1, border=0)

        # Title
        pdf.set_xy(45, 107)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=23, h=2, txt='CONSORCIO: ', border=0)
        # Content
        pdf.set_xy(69, 107)
        pdf.set_font("Arial", size=12)
        pdf.cell(w=3, h=2, txt=self.kind_agreement_2, border=0)

        # Title
        pdf.set_xy(75, 107)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=26, h=2, txt='UNION TEMPORAL: ', border=0)
        # Content
        pdf.set_xy(109, 107)
        pdf.set_font("Arial", size=12)
        pdf.cell(w=3, h=2, txt=self.kind_agreement_3, border=0)

        # Title
        pdf.set_xy(116, 107)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=5, h=2, txt='CON: ', border=0)
        # Content
        pdf.set_xy(126, 107)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=73, h=2, txt=self.kind_agreement_link, border=0)


        # text title
        pdf.set_xy(17, 114.5)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=199, h=0, txt='VIGENCIA DEL CONTRATO', border=0, align='L')

        # text title
        pdf.set_xy(15, 124)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='FECHA INICIAL:', border=0, align='C')

        # Title Path
        pdf.set_xy(70, 119)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='DIA', border=0, align='C')
        # Content
        pdf.set_xy(70, 124)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_init_date_d, border=0, align='C')

        # Title Path
        pdf.set_xy(110, 119)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='MES', border=0, align='C')
        # Content
        pdf.set_xy(110, 124)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_init_date_m, border=0, align='C')

        # Title Path
        pdf.set_xy(155, 119)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='ANO', border=0, align='C')
        # Content
        pdf.set_xy(155, 124)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_init_date_y, border=0, align='C')


        # Title Path
        pdf.set_xy(15, 130)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='FECHA FINAL:', border=0, align='C')

        # Content
        pdf.set_xy(70, 130)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_last_date_d, border=0, align='C')

        # Content
        pdf.set_xy(110, 130)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_last_date_m, border=0, align='C')

        # Content
        pdf.set_xy(155, 130)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=text_last_date_y, border=0, align='C')

        # text title
        pdf.set_xy(17, 137)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=199, h=0, txt='CARACTERISTICAS DEL VEHICULO', border=0, align='L')

        # Title Path
        pdf.set_xy(15, 142)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=55, h=0, txt='CLASE', border=0, align='C')
        # Content
        pdf.set_xy(15, 147)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt=self.car_class_car, border=0, align='C')

        # Title Path
        pdf.set_xy(70, 142)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='MARCA', border=0, align='C')
        # Content
        pdf.set_xy(70, 147)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=self.car_brand, border=0, align='C')

        # Title Path
        pdf.set_xy(110, 142)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='MODELO', border=0, align='C')
        # Content
        pdf.set_xy(110, 147)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=self.car_model, border=0, align='C')

        # Title Path
        pdf.set_xy(155, 142)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='PLACA', border=0, align='C')
        # Content
        pdf.set_xy(155, 147)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt=self.car_license_plate, border=0, align='C')

        # text title
        pdf.set_xy(15, 155)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=93, h=0, txt='NUMERO INTERNO', border=0, align='C')
        # Content
        pdf.set_xy(15, 160)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=93, h=0, txt=self.car_no, border=0, align='C')
        # text title
        pdf.set_xy(108, 155)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=93, h=0, txt='NUMERO TARJETA DE OPERACION', border=0, align='C')
        # Content
        pdf.set_xy(108, 160)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=93, h=0, txt=self.car_operation, border=0, align='C')


        # text title
        pdf.set_xy(17, 167)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=199, h=0, txt='DATOS DEL CONDUCTOR', border=0, align='L')

        # Title Path
        pdf.set_xy(15, 172)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=55, h=0, txt='NOMBRE', border=0, align='C')
        # Content
        pdf.set_xy(15, 177)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Camioneta Van', border=0, align='C')
        # Content
        pdf.set_xy(15, 182)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Camioneta Van', border=0, align='C')
        # Content
        pdf.set_xy(15, 187)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Camioneta Van', border=0, align='C')



        # Title Path
        pdf.set_xy(70, 172)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='CEDULA', border=0, align='C')
        # Content
        pdf.set_xy(70, 177)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='Tercero', border=0, align='C')
        # Content
        pdf.set_xy(70, 182)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Tercero', border=0, align='C')
        # Content
        pdf.set_xy(70, 187)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Tercero', border=0, align='C')




        # Title Path
        pdf.set_xy(110, 172)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='LICENCIA DE CONDUCCION', border=0, align='C')
        # Content
        pdf.set_xy(110, 177)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='2015', border=0, align='C')
        # Content
        pdf.set_xy(110, 182)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='2015', border=0, align='C')
        # Content
        pdf.set_xy(110, 187)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='2015', border=0, align='C')


        # Title Path
        pdf.set_xy(155, 172)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='VIGENCIA', border=0, align='C')
        # Content
        pdf.set_xy(155, 177)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='345655', border=0, align='C')
        # Content
        pdf.set_xy(155, 182)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='235454', border=0, align='C')
        # Content
        pdf.set_xy(155, 187)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='234234', border=0, align='C')




        # text title
        pdf.set_xy(17, 194)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=199, h=0, txt='DATOS DEL CONTRATANTE', border=0, align='L')

        # Title Path
        pdf.set_xy(15, 198)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=55, h=0, txt='NOMBRE', border=0, align='C')
        # Content
        pdf.set_xy(15, 203)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=55, h=0, txt='Camioneta Van', border=0, align='C')


        # Title Path
        pdf.set_xy(70, 198)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='CEDULA', border=0, align='C')
        # Content
        pdf.set_xy(70, 203)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='Tercero', border=0, align='C')

        # Title Path
        pdf.set_xy(110, 198)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='TELEFONO', border=0, align='C')
        # Content
        pdf.set_xy(110, 203)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='2015', border=0, align='C')

        # Title Path
        pdf.set_xy(155, 198)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=45, h=0, txt='DIRECCION', border=0, align='C')
        # Content
        pdf.set_xy(155, 203)
        pdf.set_font("Arial", size=9)
        pdf.cell(w=45, h=0, txt='345655', border=0, align='C')

        # Title Path
        pdf.set_xy(17, 211)
        pdf.set_font("Arial", 'B', size=9)
        pdf.cell(w=182, h=0, txt='ORIGEN-DESTINO', border=0, align='L')

        # footer text
        pdf.set_font("Arial", size=9)
        pdf.set_xy(17, 213)
        pdf.multi_cell(w=182, h=4,
                       txt=self.route,
                       border=0, align='J')

        # End page
        # line split cell
        pdf.line(15, 238, 201, 238)
        pdf.line(133, 238, 133, 265)
        # footer text
        pdf.set_font("Arial", size=9)
        pdf.set_xy(17, 240)
        pdf.multi_cell(w=111, h=4,
                       txt='CLL 24C No 80B -36 OF 204 BOGOTA - CUNDINAMARCA '
                           'TELEFONO: 311  488 27 15 transportesoceantoursas@gmail.com',
                       border=0, align='J')

        # Code bar rad
        pdf.code39('123423412341324453', 17, 250, w=1, h=7)
        pdf.set_font("Arial", size=9)
        pdf.set_xy(17, 259)
        pdf.cell(w=111, txt='Radicado No. 12342341234132445345', border=0, align='L')

        pdf.image(self.img_sign, 136, 241, 62, 20)
        return pdf.output('temp.pdf')
        # return pdf.output('temp.pdf', 'S')