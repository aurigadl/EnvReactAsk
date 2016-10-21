import unittest
import json
import random
import string


import requests


class TestApiPersonCarRest(unittest.TestCase):
    def setUp(self):
        self.domain = 'mi.co'
        self.URL = 'http://localhost:5000/'
        self.admon = 'admon@' + self.domain
        self.passAdmin = 'Abcd1234'
        self.digits = "".join([random.choice(string.digits) for i in xrange(10)])
        self.name_user = "test_{x}".format(x=self.digits)


suite = unittest.TestLoader().loadTestsFromTestCase(TestApiPersonCarRest)
unittest.TextTestRunner(verbosity=2).run(suite)