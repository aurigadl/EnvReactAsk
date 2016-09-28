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

    # Validate user access with the role of "candidate"  and
    # create a new contrato
    def test_setNewTipoContrato(self):
        path1 = 'apiFuec/newTipoContrato'  # Only candidate role
        name_contrato = ''.join(random.choice(string.ascii_letters) for x in range(10))

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
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'No exist parameters')

        # json format with params but contrato doesn't complete
        params = {'name': 'A'}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Contrato is not complete')

        # json format with params but marca doesn't complete
        params = {'name': name_contrato}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Contrato is ok')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Contrato id created')

        # json format repeat params
        params = {'name': name_contrato}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Contrato exist')

    # create new contrato
    def test_getallTipoContrato(self):
        path1 = 'apiFuec/allTipoContrato'  # Only candidate role

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

    # Update user parameters with id
    def test_apiUpdateIdTipoContrato(self):
        path = 'apiFuec/updateIdTipoContrato'
        path1 = 'apiFuec/newTipoContrato'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        name_contrato = ''.join(random.choice(string.ascii_letters) for x in range(10))

        # Login user admonUser that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # create new contrato
        params = {'name': name_contrato}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Contrato is ok')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Contrato id created')

        # test api with different params
        params = {}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - not parameters')

        # test api with different params, without id
        params = {'name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': '1000', 'name': 'Audi'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': str(id), 'name': name_contrato + '_new'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Contrato update ok')

    # Update user parameters with id
    def test_apiDeleteIdTipoContrato(self):
        path = 'apiFuec/deleteIdTipoContrato'
        path1 = 'apiFuec/newTipoContrato'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        name_contrato = ''.join(random.choice(string.ascii_letters) for x in range(10))

        # Login user admonUser that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # create new contrato
        params = {'name': name_contrato}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        r = reqsess.post(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Contrato is ok')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Contrato id created')

        # test api with different params
        params = {}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.delete(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - not parameters')

        # test api with different params, without id
        params = {'id': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.delete(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': '1000'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.delete(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': str(id)}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.delete(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Contrato delete ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestContratoRest)
unittest.TextTestRunner(verbosity=2).run(suite)