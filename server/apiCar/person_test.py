import unittest
import json
import random
import string


import requests


class TestApiCarRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'
        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'
        self.digits = "".join([random.choice(string.digits) for i in xrange(10)])
        self.name_user = "test_{x}".format(x=self.digits)

    def test_getAllidType(self):
        path1 = 'apiFuec/classcar'
        # Save session
        reqsess = requests.Session()

        # Login user admon
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')
        answer_json = json.loads(r.text)
        dict_idtype = answer_json['result']
        self.assertTrue(type(dict_idtype) == list, 'Answer format ok')

    def test_getAllCar(self):
        path1 = 'apiFuec/allCar'
        # Save session
        reqsess = requests.Session()

        # Login user admon
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')
        answer_json = json.loads(r.text)
        dict_Car = answer_json['result']
        self.assertTrue(type(dict_Car) == list, 'Answer format ok')

    def test_getNewCar(self):
        path1 = 'apiFuec/newCar'
        # Save session
        reqsess = requests.Session()

        # Login user admon
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}

        # json format correct
        params = dict(
            license_plate='ACV234',
                 model=2012,
                 brand=1,
                 class_car=1,
                 operation_card='ASDF13413')

        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Answer ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiCarRest)
unittest.TextTestRunner(verbosity=2).run(suite)