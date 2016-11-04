import unittest
import json
import random
import string


import requests


class TestApiPersonCarRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'
        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'
        self.digits = "".join([random.choice(string.digits) for i in xrange(10)])
        self.name_user = "test_{x}".format(x=self.digits)

    # Validate user access with the role of "candidate"  and
    # create a new ruta
    def test_setNewPersonCar(self):
        path1 = 'apiFuec/updatePersonCar' # Only candidate role

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
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'No exist parameters')

        # json format with params but ruta doesn't complete
        params = {'id': '1'}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Parameters is not complete')

        # json format with params but ruta doesn't complete
        params = {'id': '1', 'person_car': ''}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Parameters is not complete')

        # json format with params
        params = {'id': '1', 'person_car': '[{person: "2", mod: "1"}, {person: "3", mod: "2"}]'}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Person car is ok')

suite = unittest.TestLoader().loadTestsFromTestCase(TestApiPersonCarRest)
unittest.TextTestRunner(verbosity=2).run(suite)