import unittest
import requests
import json


class TestMovilidadRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'

        self.test = 'test@' + self.domain
        self.password = '1234Abcd'

        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'

    # Validate user access with the role of "candidate"  and
    # create a new marca
    def test_getallModality(self):
        path1 = 'apiFuec/allModality'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # json format correct without params
        payload = {"jsonrpc": "2.0", "method": path1,
                   "params": {"no_fuec":"201612432173345450","social_object":"EB company","nit":"2431434133-11","no_agreefuec":"73345","selectRuta":["1","2","3"],"contractor":"1","agreement_object":"2","kind_agreement_link":"1","kind_agreement":"2","init_date":"2016-12-31","last_date":"2017-12-31","agreement":"2","no_car":"2"}}



        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Modality is ok')
        answer_json = json.loads(r.text)
        dict_result = answer_json['result']
        self.assertTrue((type(dict_result) is list), 'Modality get all')


suite = unittest.TestLoader().loadTestsFromTestCase(TestMovilidadRest)
unittest.TextTestRunner(verbosity=2).run(suite)