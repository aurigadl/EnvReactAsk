import unittest
import requests
import json
import random
import string


class TestApiUserRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'

        self.test = 'test@' + self.domain
        self.password = '1234Abcd'

        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'

    #Create a new user from Admon account
    def test_apiNewUser(self):
        reqsess = requests.Session()
        reqsess.headers.update({'Content-Type': 'application/json'})

        # Login user admonUser that has role candidate
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        reqsess.headers.update({'Authorization': token})

        path = 'apiUser/newuser'
        payload = {"jsonrpc": "2.0", "method": path, "params": ""}
        r = reqsess.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        name_user = "test_{x}@{y}".format(x=digits, y=self.domain)

        # One element in json data
        params = {'email': name_user}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 201, 'Create new user')

        # json data without any value
        params = {'email': '', 'password': '', 'display_name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json format correct with previous user
        params = {'email': name_user, 'password': self.password, 'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Create new user but it was created before')

    # Create user and login with this
    def test_apiLogin(self):
        path = 'apiUser/login'
        name_user = self.test

        # json format correct create user for test
        # Login user admonUser that has role candidate
        reqsess2 = requests.Session()
        reqsess2.headers.update({'Content-Type': 'application/json'})
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess2.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        reqsess2.headers.update({'Authorization': token})
        params = {'email': name_user,'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/newuser', "params": params}
        reqsess2.post(self.URL + 'apiUser/newuser', json=payload)

        # login bad parameters
        payload = {}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - not parameters')

        # One element in json data
        payload = {'email': name_user}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only email ')

        # One element in json data
        payload = {'password': self.password}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only password')

        # Element in json empty
        payload = {'email': '', 'password': ''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - empty')

        # Json complete but user doesnt exist
        payload = {'email': 'test2@'+self.domain, 'password': self.password}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error usuario no existe')

        # Json complete but user password wrong
        payload = {'email': name_user, 'password': '123456'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - empty')

        # Json complete user password is true
        payload = {'email': name_user, 'password': self.password, 'password_c':self.password}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 202, 'User accepted')
        self.assertEqual(r.headers['content-type'], 'application/json', 'Header json')

        # format answers {"jsonrpc": "2.0", "result": True, "token":token}
        answer_json = json.loads(r.text)
        self.assertRegexpMatches(answer_json['token'], '.+[.].+[.].+', 'does not have correct format')

    # login and them singout
    def test_apiSignOut(self):
        path = 'apiUser/login'
        path2 = 'apiUser/updateMyUser'
        path3 = 'apiUser/logout'
        name_user = self.test

        # Login user admonUser that has role candidate
        reqsess2 = requests.Session()
        reqsess2.headers.update({'Content-Type': 'application/json'})
        payload = dict(email=self.admon, password=self.passAdmin, password_c=self.passAdmin)
        result = reqsess2.post(self.URL + 'apiUser/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']
        reqsess2.headers.update({'Authorization': token})
        params = {'email': name_user,'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/newuser', "params": params}
        reqsess2.post(self.URL + 'apiUser/newuser', json=payload)

        reqsess = requests.Session()
        reqsess.headers.update({'Content-Type': 'application/json'})
        # Login user to get token
        payload = dict(email=self.test, password=self.password, password_c=self.password)
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

    # Update user that is log
    def test_apiUpdateMyUser(self):
        path = 'apiUser/updateMyUser'
        # Save session
        reqsess = requests.Session()

        # json correct format create user for test
        params = {'email': self.test, 'password': self.password, 'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/newuser', "params": params}
        requests.post(self.URL + 'apiUser/newuser', json=payload)

        # Login user to get token
        payload = dict(email=self.test, password=self.password, password_c=self.password)
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

    # Update user parameters with id
    def test_apiUpdateIdUser(self):
        path = 'apiUser/updateIdUser'

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
        params = {'email': name_user, 'display_name': 'test name show 1'}
        payload = {"jsonrpc": "2.0", "method": 'apiAdmin/newuser', "params": params}
        r = reqsess.post(self.URL + 'apiUser/newuser', json=payload, headers=header)
        self.assertEqual(r.status_code, 201, 'Create new user')
        answer_json = json.loads(r.text)
        id = answer_json['id']
        self.assertTrue(str(id).isdigit(), 'User id created')

        # test api with different params
        params = {}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - not parameters')

        # test api with different params, without id
        params = {'display_name': '', 'first_name': '', 'last_name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': '1000', 'display_name': '', 'first_name': '', 'last_name': ''}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 400, 'Error json format - empty parameters')

        # test api with different params
        params = {'id': str(id), 'display_name': 'Test ' + name_user, 'first_name': 'Test first_name', 'last_name': 'Test Last_name'}
        payload = {"jsonrpc": "2.0", "method": path, "params": params}
        r = reqsess.put(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'User update ok')

    # Validate user access with the role of "admon"  and
    # get all users from database
    def test_getAllUsers(self):
        path1 = 'apiUser/allUser'  # Only candidate role

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
        answer_json = json.loads(r.text)
        dict_users = answer_json['result']
        self.assertTrue(type(dict_users) == list, 'Answer format ok')

    # Get all information user with Id
    def test_getIdUser(self):
        path1 = 'apiUser/idUser'  # Only candidate role

        # Save session
        reqsess = requests.Session()
        # Login user admonUser that has role candidate
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

suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)
