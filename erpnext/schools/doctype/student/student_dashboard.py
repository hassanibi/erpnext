from frappe import _

def get_data():
	return {
		'heatmap': True,
		'heatmap_message': _('This is based on the attendance of this Student'),
		'fieldname': 'student',
		'transactions': [
			{
				'items': ['Student Log', 'Student Batch', 'Student Group', 'Program Enrollment']
			},
			{
				'items': ['Student Payment', 'Fees', 'Assessment Result', 'Student Attendance']
			}
		]
	}