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
			collect_fees(d.fees, d.paid_amount)



@frappe.whitelist()
def get_payment_components(student):
	"""Returns Student Payment Components.

	:param student: Student.
	"""
	if student:
		outstanding_payments = get_outstanding_payments(student)
		pc = frappe.get_list("Fees", fields=["name", "fees_category", "student", "total_amount", "paid_amount", "outstanding_amount"] , filters={
			"student": student,
			"outstanding_amount": (">", 0),
			"due_date": ("<", frappe.utils.nowdate())
		}, order_by= "idx")
		return pc

def get_outstanding_payments(student):
	outstanding_payments = []



	return get_outstanding_payments

