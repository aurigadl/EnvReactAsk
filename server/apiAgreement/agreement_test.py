import unittest
import json
import random
import string


import requests


class TestApiAgreementRest(unittest.TestCase):
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

    def test_getAllAgreement(self):
        path1 = 'apiFuec/allAgreement'
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
        dict_agreement = answer_json['result']
        self.assertTrue(type(dict_agreement) == list, 'Answer format ok')

    def test_getNewAgreement(self):
        path1 = 'apiFuec/newAgreement'
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
                 no_agreement='12312313',
                 no_trip='987',
                 name_contract='test un test',
                 id_type=str(dict_idtype[0]['id']),
                 id_number='223424242',
                 nit_1='33223424343',
                 nit_2='23',
                 purpose='one test with many data',
                 id_route='1',
                 id_type_agreement='1',
                 init_date='2016-02-03',
                 last_date='2016-02-03')

        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Answer ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiAgreementRest)
unittest.TextTestRunner(verbosity=2).run(suite)