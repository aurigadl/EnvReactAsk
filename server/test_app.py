import unittest
import requests
import json
import random
import string


class TestApiUserRest(unittest.TestCase):
    token = ''

    def setUp(self):
        self.URL = 'http://localhost:5000/'

    def test_root(self):
        r = requests.get(self.URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(json.loads(r.text), {u'items': {u'Key2': u'value2', u'Key1': u'Value1'}})

    def test_apinewuser_a(self):
        path = 'apiuser/newuser'
        payload = {}
        digits = "".join([random.choice(string.digits) for i in xrange(10)])
        nameUser = "testname_{x}".format(x=digits)
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # One element in json data
        payload = {'usermail': nameUser}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json data without any value
        payload = {'usermail': '', 'password': '', 'name_to_show': ''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')

        # json data password without size lenght => 8
        payload = {'usermail': nameUser, 'password': '1234', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json password size less that 8 bytes')

        # json format correct
        payload = {'usermail': nameUser, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 201, 'Create new user')

        # json format correct with previous user
        payload = {'usermail': nameUser, 'password': '12345678', 'name_to_show': 'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Create new user but it was created before')

    def test_apilogin(self):
        path = 'apiuser/login'
        name_user = 'testname_0'

        # json format correct create user for test
        payload = {'usermail': name_user, 'password': '12345678', 'name_to_show': 'test name show 1'}
        requests.post(self.URL + 'apiuser/newuser', json=payload)

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
        self.__class__.token = answer_json['token']
        self.assertRegexpMatches(answer_json['token'], '.+[.].+[.].+', 'does not have correct format')

    def test_questionary(self):
        path = 'apiquestionary/assigned'

        # json format correct no header
        payload = {"jsonrpc": "2.0", "method": "apiquestionary/assigned", "params": ""}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'No header authorization assigned')

        # json format correct with header but bad token
        string_token = "Bearer untoken"
        header = {'Authorization': string_token}
        r = requests.get(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 401, 'Token is invalid')
        
        # json format correct
        payload = {"jsonrpc": "2.0", "method": "apiquestionary/assigned", "params": ""}
        stingToken = "Bearer {t}".format(t=self.__class__.token)
        header = {'Authorization': stingToken}
        r = requests.get(self.URL + path, json=payload, headers=header)
        self.assertEqual(r.status_code, 200, 'Answer ok')


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)