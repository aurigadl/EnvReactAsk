import unittest
import requests
import json
import random
import string


class TestApiUserRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'midominio.co'
        self.URL = 'http://localhost:5000/'
        self.admon = 'admon@' + self.domain
        self.test = 'test@' + self.domain

    def test_apiNewUser(self):
        path = 'apiUser/newuser'
        payload = {}
        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        name_user = "test_{x}@{y}".format(x=digits, y=self.domain)
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # One element in json data
        payload = {'usermail': name_user}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json data without any value
        payload = {'usermail': '', 'password': '', 'name_to_show': ''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json data password without size lenght => 8
        payload = {'usermail': name_user, 'password': '1234', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json password size less that 8 bytes')

        # json format correct
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 201, 'Create new user')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Create new user')

        # json format correct with previous user
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Create new user but it was created before')

    def test_apiLogin(self):
        path = 'apiUser/login'
        name_user = self.test

        # json format correct create user for test
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # login bad parameters
        payload = {}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - not parameters')

        # One element in json data
        payload = {'usermail': name_user}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only email ')

        # One element in json data
        payload = {'password': '12345678'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only password')

        # Element in json empty
        payload = {'usermail': '', 'password': ''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - empty')

        # Json complete but user doesnt exist
        payload = {'usermail': 'test2@'+self.domain, 'password': '1234567'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')

        # Json complete but user password wrong
        payload = {'usermail': name_user, 'password': '1234567'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')

        # Json complete user password is true
        payload = {'usermail': name_user, 'password': '12345678'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 202, 'User accepted')
        self.assertEqual(r.headers['content-type'], 'application/json', 'Header json')

        # format answers {"jsonrpc": "2.0", "result": True, "token":token}
        answer_json = json.loads(r.text)
        self.assertRegexpMatches(answer_json['token'], '.+[.].+[.].+', 'does not have correct format')

    def test_apiSignOut(self):
        path = 'apiUser/login'
        path2 = 'apiUser/updateUser'
        path3 = 'apiUser/logout'
        name_user = self.test
        # Save session
        reqsess = requests.Session()
        reqsess.headers.update({'Content-Type': 'application/json'})

        # json format correct create user for test
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user to get token
        payload = dict(usermail=self.test, password='12345678')
        result = reqsess.post(self.URL + path, json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        reqsess.headers.update({'Authorization': token})

        # test api with diferent params
        params = {'display_name': 'fan1'}
        payload = {"jsonrpc": "2.0", "method": path2, "params": params}
        r = reqsess.put(self.URL + path2, json=payload)
        self.assertEqual(r.status_code, 200, 'Save data - display_name parameters')

        # test api with diferent params
        payload = {"jsonrpc": "2.0", "method": path3}
        r = reqsess.put(self.URL + path3, json=payload)
        self.assertEqual(r.status_code, 202, 'Locked - users singout')

        # test api with diferent params
        params = {'display_name': 'fan1'}
        payload = {"jsonrpc": "2.0", "method": path2, "params": params}
        r = reqsess.put(self.URL + path2, json=payload)
        self.assertEqual(r.status_code, 403, 'Do not have access to the resource')

    def test_apiUpdateUser(self):
        path = 'apiUser/updateUser'
        # Save session
        reqsess = requests.Session()

        # json correct format create user for test
        payload = {'usermail': self.test, 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user to get token
        payload = dict(usermail=self.test, password='12345678')
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        header = {'Authorization': token}

        # test api with diferent params
        params = {}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - not parameters')

        # test api with diferent params
        params = {'display_name': '', 'first_name': '', 'last_name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with diferent params
        params = {'display_name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty display_name parameters')

        # test api with diferent params
        params = {'display_name': 'fa'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - require more bits display_name parameters')

        # test api with diferent params
        params = {'display_name': 'fan1'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Save data - display_name parameters')

        # test api with diferent params
        params = {'last_name': 'san2'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Save data - last_name parameters')

        # test api with diferent params
        params = {'display_name': 'gon3', 'first_name': 'san3', 'last_name': 'ron3'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Save data - many parameters')


        # test api with diferent params
        params = {'display_name': 'gon4', 'first_name': '', 'last_name': 'ron4'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Save data - some parameters saved')

    # Validate user access with the role of "admon"  and
    # get all roles from database
    def test_getAllRoles(self):
        path1 = 'apiAdmin/allRoles'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
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
        payload = dict(usermail=self.admon, password='qwerasdf')
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
    def test_getIdUsersRoles(self):
        path1 = 'apiAdmin/idUserRole'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
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

    # Validate user access with the role of "admon"  and
    # get all users from database
    def test_getAllUsers(self):
        path1 = 'apiUser/allUser'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
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
        self.assertTrue(type(dict_users) == list, 'Answer format ok')

    # Validate user access with the role of "candidate"  and
    # get all Marcas from database
    def test_getAllMarcas(self):
        path1 = 'apiFuec/allMarcas'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

    # Validate user access with the role of "candidate" and
    # get all Marcas from database
    def test_updateRoleUser(self):
        path1 = 'apiAdmin/setUserRole'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        name_user = "test_{x}@{y}".format(x=digits,y=self.domain)

        # get id new user
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = reqsess.post(self.URL + 'apiUser/newuser', json=payload)
        self.assertEqual(r.status_code, 201, 'Create new user')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'Create new user')

        # Login user admonUser that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # Get all roles
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/allRoles', "params": ""}
        header = {'Authorization': token}
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


    # Validate user access with the role of "candidate" and
    # get all Marcas from database
    def test_getIdUser(self):
        path1 = 'apiUser/idUser'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        # Login user admonUser that has role candidate
        payload = dict(usermail=self.admon, password='qwerasdf')
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

suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)