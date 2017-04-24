# -*- coding: utf-8 -*-
# Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class StudentPayment(Document):
	def on_submit(self):
		from erpnext.schools.api import collect_fees
		for d in self.components:
			collect_fees(d.fees, d.total_amount)

