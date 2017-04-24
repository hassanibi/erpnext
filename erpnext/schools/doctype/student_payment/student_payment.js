// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

cur_frm.add_fetch("student", "title", "student_name");

frappe.ui.form.on('Student Payment', {
	onload: function(frm){
		cur_frm.set_query("academic_term",function(){
			return{
				"filters":{
					"academic_year": (frm.doc.academic_year)
				}
			};
		});

		cur_frm.set_query("fees", "components",function(){
			return{
				"filters":{
					"student": (frm.doc.student)
				}
			};
		});
	},

	refresh: function(frm) {

	},

	calculate_total_amount: function(frm) {
		total_amount = 0;
		for(var i=0;i<frm.doc.components.length;i++) {
			total_amount += frm.doc.components[i].total_amount;
		}
		frm.set_value("total_amount", total_amount);
	}
});

frappe.ui.form.on("Payment Component", {
	total_amount: function(frm) {
		frm.trigger("calculate_total_amount");
	}
});
