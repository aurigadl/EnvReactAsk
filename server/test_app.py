import unittest
import requests
import json


class TestApiUserRest(unittest.TestCase):

    def setUp(self):
        self.URL = 'http://localhost:5000/'
        self.token = ''


    def test_root(self):
        r = requests.get(self.URL)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(json.loads(r.text), {u'items': {u'Key2': u'value2', u'Key1': u'Value1'}})

    def test_apinewuser(self):
        path = 'apiuser/newuser'
        payload = {}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')
        # One element in json data
        payload = {'usermail':'nombre_test1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')
        # json data without any value
        payload = {'usermail':'', 'password':'', 'name_to_show':''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format')
        # json data password without size lenght => 8
        payload = {'usermail':'testname1', 'password':'1234', 'name_to_show':'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json password size less that 8 bytes')
        # json format correct
        payload = {'usermail':'testname1', 'password':'12345678', 'name_to_show':'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 201, 'Create new user')
        # json format correct
        payload = {'usermail':'testname1', 'password':'12345678', 'name_to_show':'test name show 1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Create new user but it was created before')

    def test_apilogin(self):
        path = 'apiuser/login'
        # login bad parameters
        payload = {}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format - not parameters')
        # One element in json data
        payload = {'usermail':'nombre_test1'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format - only email ')
        # One element in json data
        payload = {'password':'12345678'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format - only password')
        # Element in json empty
        payload = {'usermail':'', 'password':''}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 400, 'Error json format - empty')
        # Json complet but user doesnt exist
        payload = {'usermail':'nombre_test2', 'password':'1234567'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')
        # Json complet but user password is worng
        payload = {'usermail':'nombre_test1', 'password':'1234567'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 404, 'Error json format - empty')
        # Json complet but user password is worng
        payload = {'usermail':'nombre_test1', 'password':'12345678'}
        r = requests.post(self.URL + path, json=payload)
        self.assertEqual(r.status_code, 202, 'User accepted')




    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiUserRest)
unittest.TextTestRunner(verbosity=2).run(suite)
