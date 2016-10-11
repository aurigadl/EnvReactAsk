import unittest
import json
import random
import string


import requests


class TestApiPersonRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'
        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'
        self.digits = "".join([random.choice(string.digits) for i in xrange(10)])
        self.name_user = "test_{x}".format(x=self.digits)

    def test_getAllidType(self):
        path1 = 'apiFuec/allIdType'
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

    def test_getAllPerson(self):
        path1 = 'apiFuec/allPerson'
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
        dict_person = answer_json['result']
        self.assertTrue(type(dict_person) == list, 'Answer format ok')

    def test_getNewPerson(self):
        path1 = 'apiFuec/newPerson'
        path2 = 'apiFuec/allIdType'
        # Save session
        reqsess = requests.Session()

        # Login user admon
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}

        r = reqsess.get(self.URL + path2, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')
        answer_json = json.loads(r.text)
        dict_idtype = answer_json['result']
        self.assertTrue(type(dict_idtype) == list, 'Answer format ok')

        # json format correct
        params = dict(
            first_name=self.name_user + 'TERESA',
            last_name='MARTINEZ DE VARELA',
            email=self.name_user + '@mi.co',
            phone='309435633',
            id_number=self.digits,
            id_type=dict_idtype[0]['id'],
            license='23342222',
            effective_date='23/09/2016',
            address='cr 34 35 con matha esquina')

        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Answer ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiPersonRest)
unittest.TextTestRunner(verbosity=2).run(suite)
