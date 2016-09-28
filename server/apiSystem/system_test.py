import unittest
import requests
import json


class TestApiSystemRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'

        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'

    # Validate user access with the role of "admon"  and
    # get all System from database
    def test_getAllUsers(self):
        path1 = 'apiSystem/allSystem'  # Only candidate role

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
        dict_users = answer_json['result']
        self.assertTrue(type(dict_users) == dict, 'Answer format ok')

    # Update System parameters with id
    def test_apiUpdateSystem(self):
        path = 'apiSystem/updateSystem'

        # Save session
        reqsess = requests.Session()

        # Login admon
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # test api with different params
        params = dict(secuence_contract='100', secuence_payroll='200', secuence_vehicle='300')
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'System ok')

        # test api with different params but worng key
        params = dict(secuence1='100', secuence2='200', secuence3='300')
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'System doesnt update')

        # test api with different params
        params = dict(nit_1='2000', nit_2='4')
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'System ok')

suite = unittest.TestLoader().loadTestsFromTestCase(TestApiSystemRest)
unittest.TextTestRunner(verbosity=2).run(suite)