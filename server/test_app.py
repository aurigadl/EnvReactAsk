import unittest
import requests
import json
import random
import string


class TestApiUserRest(unittest.TestCase):
    def setUp(self):
        self.URL = 'http://localhost:5000/'

    def test_root(self):
        r = requests.get(self.URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(json.loads(r.text), {u'items': {u'Key2': u'value2', u'Key1': u'Value1'}})

    def test_apiNewUser(self):
        path = 'apiUser/newuser'
        payload = {}
        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        name_user = "testName_{x}".format(x=digits)
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

        # json format correct with previous user
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Create new user but it was created before')

    def test_apiLogin(self):
        path = 'apiUser/login'
        name_user = 'testName_0'

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
        payload = {'usermail': 'nombre_test2', 'password': '1234567'}
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
        name_user = 'testName_0'
        # Save session
        reqsess = requests.Session()
        reqsess.headers.update({'Content-Type': 'application/json'})

        # json format correct create user for test
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user to get token
        payload = dict(usermail='testName_0', password='12345678')
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
        payload = {'usermail': 'testName_0', 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user to get token
        payload = dict(usermail='testName_0', password='12345678')
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

    '''
    Validate user access with the role of "candidate" to a
    api that has that role.

    Validate user access with the role of "admon" to a api
    that has only the role of candiate
    '''

    def test_loginRolesCandidate(self):
        path1 = 'apiQuestionary/assigned'  # Only candidate role
        path2 = 'apiAdmin/users'  # Only admon role

        # Save session
        reqsess = requests.Session()
        # json format correct create user for test
        payload = {'usermail': 'testName_0', 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user testName_0 that has role candidate
        payload = dict(usermail='testName_0', password='12345678')
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": "apiQuestionary/assigned", "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')

        r = reqsess.get(self.URL + path2, json=payload, headers=header)
        self.assertEqual(r.status_code, 403, 'Do not have access to the resource')


    '''Validate user access with the role of "admon"  and
    get all roles from database
    '''
    def test_getAllRoles(self):
        path1 = 'apiAdmin/allRoles'  # Only candidate role

        # Save session
        reqsess = requests.Session()

        # Login user testName_0 that has role candidate
        payload = dict(usermail='admonUser', password='qwerasdf')
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct
        payload = {"jsonrpc": "2.0", "method": path1, "params": ""}
        header = {'Authorization': token}
        r = reqsess.get(self.URL + path1, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)