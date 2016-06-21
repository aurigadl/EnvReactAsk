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

    def test_apiNewUser_a(self):
        path = 'api_user/newuser'
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
        requests.post(self.URL + 'api_user/newuser', json=payload)

        # login bad parameters
        payload = {}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - not parameters')

        # One element in json data
        payload = {'usermail': name_user}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only email ')

        # One element in json data
        payload = {'password': '12345678'}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - only password')

        # Element in json empty
        payload = {'usermail': '', 'password': ''}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Error json format - empty')

        # Json complete but user doesnt exist
        payload = {'usermail': 'nombre_test2', 'password': '1234567'}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')

        # Json complete but user password wrong
        payload = {'usermail': name_user, 'password': '1234567'}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')

        # Json complete user password is true
        payload = {'usermail': name_user, 'password': '12345678'}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 202, 'User accepted')
        self.assertEqual(r.headers['content-type'], 'application/json', 'Header json')

        # format answers {"jsonrpc": "2.0", "result": True, "token":token}
        answer_json = json.loads(r.text)
        self.assertRegexpMatches(answer_json['token'], '.+[.].+[.].+', 'does not have correct format')

    def test_questionary(self):
        path = 'api_questionary/assigned'
        reqsess = requests.Session()
        # Login user to get token
        payload = dict(usermail='testName_0', password='12345678')
        result = reqsess.get(self.URL + 'api_user/login', json=payload)
        answer_json = json.loads(result.text)
        token = answer_json['token']

        # json format correct no header
        payload = {"jsonrpc": "2.0", "method": "api_questionary/assigned", "params": ""}
        r = reqsess.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'No header authorization assigned')

        # json format correct with header but bad token
        string_token = "Bearer untoken"
        header = {'Authorization': string_token}
        r = reqsess.get(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 401, 'Token is invalid')

        # json format correct
        payload = {"jsonrpc": "2.0", "method": "api_questionary/assigned", "params": ""}
        string_token = "Bearer {t}".format(t=token)
        header = {'Authorization': string_token}
        r = reqsess.get(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')




suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)
