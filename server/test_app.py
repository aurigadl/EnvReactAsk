import unittest
import requests
import json


class TestStringMethods(unittest.TestCase):

    def __init__(self, nombre):
        self.token = []

    def test_root(self):
        r = requests.get('http://localhost:5000/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(json.loads(r.text), {u'items': {u'Key2': u'value2', u'Key1': u'Value1'}})

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')


    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)


suite = unittest.TestLoader().loadTestsFromTestCase(TestStringMethods)
unittest.TextTestRunner(verbosity=2).run(suite)
