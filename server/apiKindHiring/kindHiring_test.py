import unittest
import requests
import json
import random
import string


class TestContratoRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'

        self.test = 'test@' + self.domain
        self.password = '1234Abcd'

        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'

    # create new contrato
    def test_getallkindHiring(self):
        path1 = 'apiFuec/allKindHiring'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # json format correct without params
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Contrato is ok')
        answer_json = json.loads(r.text)
        dict_result = answer_json['result']
        self.assertTrue((type(dict_result) is list), 'Contrato get all')


suite = unittest.TestLoader().loadTestsFromTestCase(TestContratoRest)
unittest.TextTestRunner(verbosity=2).run(suite)