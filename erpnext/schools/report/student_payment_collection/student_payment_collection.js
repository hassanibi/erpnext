// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.query_reports["Student Payment Collection"] = {
	"filters": [{
        "fieldname": "date",
        "label": __("Date"),
        "fieldtype": "Date",
        "default": get_today(),
        "reqd": 1
    }]
}
