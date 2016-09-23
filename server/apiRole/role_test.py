import unittest
import requests
import json
import random
import string


class TestRoleRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'

        self.test = 'test@' + self.domain
        self.password = '1234Abcd'

        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'

    # Validate user access with the role of "admon"  and
    # update roles from specific Id user
    def test_updateRoleUser(self):
        path1 = 'apiAdmin/setUserRole'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        name_user = "test_{x}@{y}".format(x=digits,y=self.domain)

        # Login user admonUser that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # get id new user
        params = {'email': name_user, 'password': self.password, 'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/newuser', "params": params}
        r = reqsess.post(self.URL + 'apiUser/newuser', json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Create new user')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Create new user')

        # Get all roles
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/allRoles', "params": ""}
        r = reqsess.get(self.URL + 'apiAdmin/allRoles', json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')
        answer_json = json.loads(r.text)
        ids = ', '.join([str(x['id']) for x in answer_json['result']])

        # json format correct
        params = {'role_id': ''}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json format correct
        params = {'role_id': ids, 'user_id': id}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

        # json format correct with role tuple
        params = {'role_id': '1', 'user_id': id}
        payload = {"jsonrpc": "2.0", "method": path1, "params": params}
        header = {'Authorization': token}
        r = reqsess.put(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

        # validate last role update
        params = '?id='+ str(id)
        payload = {"jsonrpc": "2.0", "method": path1}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + 'apiAdmin/idUserRole' + params, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')
        result = r.json()['result']
        self.assertEqual(len(result), 1, 'Return onlyone role_id')
        self.assertEqual(r.json()['result'][0]['role_id'], 1, 'Answer ok')


    # Validate user access with the role of "admon"  and
    # get all roles from database
    def test_getAllRoles(self):
        path1 = 'apiAdmin/allRoles'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

    # Validate user access with the role of "admon"  and
    # get all roles from database
    def test_getRolesUsers(self):
        path1 = 'apiAdmin/allUserRole'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

    # Validate user access with the role of "admon"  and
    # get roles from specific Id user
    def test_getIdUsersRoles(self):
        path1 = 'apiAdmin/idUserRole'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Answer ok')

        # json format correct
        params = '?id=1'
        payload = {"jsonrpc": "2.0", "method": path1}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1 + params, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

suite = unittest.TestLoader().loadTestsFromTestCase(TestRoleRest)
unittest.TextTestRunner(verbosity=2).run(suite)
