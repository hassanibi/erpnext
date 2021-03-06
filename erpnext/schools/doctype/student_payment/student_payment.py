# -*- coding: utf-8 -*-
# Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import flt
from frappe import _

class StudentPayment(Document):
	def validate(self):
		received_amount = 0
		for d in self.components:
			received_amount =  received_amount + flt(frappe.db.get_value("Fees", d.fees, "paid_amount"))
		if received_amount == self.received_amount:
			frappe.throw(_("Enter Paid Amount"));


	def on_submit(self):
		from erpnext.schools.api import collect_fees
		for d in self.components:
			collect_fees(d.fees, d.received_amount)


@frappe.whitelist()
def get_payment_components(student):
	"""Returns Student Payment Components.

	:param student: Student.
	"""
	if student:
		pc = frappe.get_list("Fees", fields=["name", "fees_category", "student", "total_amount", "paid_amount", "outstanding_amount", "due_date"] , filters={
			"student": student,
			"outstanding_amount": (">", 0),
			"due_date": ("<", frappe.utils.nowdate())
		}, order_by= "idx")
		return pc

