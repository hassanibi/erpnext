# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import msgprint, _

def execute(filters=None):
	columns, data = [], []

	if not filters: filters = {}

	if not filters.get("date"):
		msgprint(_("Please select date"), raise_exception=1)

	columns = get_columns(filters)

	students_payments = get_students_payments(filters.get("date"))
	for student_payment in students_payments:
		row = [student_payment.student]
		row += [student_payment.student_name, student_payment.payment_date, student_payment.total_amount]
		data.append(row)

	chart = get_chart_data(columns)

	return columns, data, _(''), chart

def get_students_payments(date):
	students_payments = frappe.db.sql("""select student, student_name, payment_date, total_amount from `tabStudent Payment` 
		where payment_date= %s order by student""", (date), as_dict=1)
	return students_payments

def get_columns(filters):
	columns = [
		_("Student") + ":Link/Student:250",
		_("Student Name") + "::200",
		_("Payment Date") + ":Date:90",
		_("Total Amount") + ":Currency:90"
	]
	return columns

def get_chart_data(columns):
	x_intervals = ['x']
	columns = [x_intervals]
	return {
		"data": {
			'x': 'x',
			'columns': columns
		}
	}
