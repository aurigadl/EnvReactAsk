from datetime import datetime


class calendarTranslate():
    dict_calendar = {'weekDict': {1: 'Lunes', 2: 'Martes',
                                  3: 'Miercoles', 4: 'Jueves',
                                  5: 'Viernes', 6: 'Sabado',
                                  7: 'Domingo'},

                     'monthDict': {1: 'Enero', 2: 'Febrero',
                                   3: 'Marzo', 4: 'Abril',
                                   5: 'Mayo', 6: 'Junio',
                                   7: 'Julio', 8: 'Agosto',
                                   9: 'Septiembre', 10: 'Octubre',
                                   11: 'Nobiembre', 12: 'Diciembre'},

                     'yearDict': {2010: 'Dos mil diez', 2011: 'Dos mil once',
                                  2012: 'Dos mil doce', 2013: 'Dos mil trece',
                                  2014: 'Dos mil catorce', 2015: 'Dos mil quince',
                                  2016: 'Dos mil dieciseis', 2017: 'Dos mil diecisiete',
                                  2018: 'Dos mil dieciocho', 2019: 'Dos mil diecinueve',
                                  2020: 'Dos mil veinte', 2021: 'Dos mil veintiuno'},

                     'dateDict': {1: 'Primero', 2: 'Segundo',
                                  3: 'Tercero', 4: 'Cuarto',
                                  5: 'Quinto', 6: 'Sexto',
                                  7: 'Septimo', 8: 'Octavo',
                                  9: 'Noveno', 10: 'Decimo',
                                  11: 'Once', 12: 'doce',
                                  13: 'trece', 14: 'catorce',
                                  15: 'quince', 16: 'dieciseis',
                                  17: 'diecisiete', 18: 'dieciocho',
                                  19: 'diecinueve', 20: 'veinte',
                                  21: 'Veintiuno', 22: 'Veintidos',
                                  23: 'Veintitres', 24: 'veinticuatro',
                                  25: 'veinticinco', 26: 'veintiseis',
                                  27: 'veintisiete', 28: 'veintiocho',
                                  29: 'veintinueve', 30: 'treinta',
                                  31: 'treinta y uno'}}

    def __init__(self, yy_mm_dd):
        self.yy_mm_dd = datetime.date(datetime.strptime(yy_mm_dd, "%Y-%m-%d"))

    def translate(self):
        text_year = self.dict_calendar['yearDict'][self.yy_mm_dd.year]
        text_month = self.dict_calendar['monthDict'][self.yy_mm_dd.month]
        text_date = self.dict_calendar['dateDict'][self.yy_mm_dd.day]
        text_day = self.dict_calendar['weekDict'][self.yy_mm_dd.weekday()]

        return [text_year, text_month, text_date, text_day]
