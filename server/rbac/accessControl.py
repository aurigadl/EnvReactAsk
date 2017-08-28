#-*-coding: utf-8
"""
    flaskext.rbac
    ~~~~~~~~~~~~~
    Adds Role-based Access Control modules to application
"""

class AccessControlList(object):
    """
    This class record rules for access controling.
    """

    def __init__(self):
        self._allowed = []
        self._denied = []
        self._exempt = []
        self.seted = False

    def allow(self, role, method, resource, with_children=False):
        """Add allowing rules.

        :param role: Role of this rule.
        :param method: Method to allow in rule, include GET, POST, PUT etc.
        :param resource: Resource also view function.
        :param with_children: Allow role's children in rule as well
                              if with_children is `True`
        if with_children:
            for r in role.get_children():
                permission = (r.get_name(), method, resource)
                if not permission in self._allowed:
                    self._allowed.append(permission)
        """
        
        if role == 'anonymous':
            permission = (role, method, resource)
        else:
            permission = (role.get_name(), method, resource)
        if not permission in self._allowed:
            self._allowed.append(permission)

    def deny(self, role, method, resource, with_children=False):
        """Add denying rules.

        :param role: Role of this rule.
        :param method: Method to deny in rule, include GET, POST, PUT etc.
        :param resource: Resource also view function.
        :param with_children: Deny role's children in rule as well
                              if with_children is `True`
        """
        if with_children:
            for r in role.get_children():
                permission = (r.get_name(), method, resource)
                if not permission in self._denied:
                    self._denied.append(permission)
        permission = (role.get_name(), method, resource)
        if not permission in self._denied:
            self._denied.append(permission)

    def exempt(self, view_func):
        """Exempt a view function from being checked permission

        :param view_func: The view function exempt from checking.
        """
        if not view_func in self._exempt:
            self._exempt.append(view_func)

    def is_allowed(self, role, method, resource):
        """Check whether role is allowed to access resource

        :param role: Role to be checked.
        :param method: Method to be checked.
        :param resource: View function to be checked.
        """
        return (role, method, resource) in self._allowed

    def is_denied(self, role, method, resource):
        """Check wherther role is denied to access resource

        :param role: Role to be checked.
        :param method: Method to be checked.
        :param resource: View function to be checked.
        """
        return (role, method, resource) in self._denied

    def is_exempt(self, view_func):
        """Return whether view_func is exempted.

        :param view_func: View function to be checked.
        """
        return view_func in self._exempt
