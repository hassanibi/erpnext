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
				"filters": [
					//"student": (frm.doc.student),
					["Fees", "student", "=", frm.doc.student],
					["Fees", "outstanding_amount", ">", 0]
				]
			};
		});
	},

	refresh: function(frm) {

	},

	student: function(frm) {
		frm.set_value("components" ,"");
		if (frm.doc.student) {
			frappe.call({
				method: "erpnext.schools.doctype.student_payment.student_payment.get_payment_components",
				args: {
					"student": frm.doc.student
				},
				callback: function(r) {
					if (r.message) {
						$.each(r.message, function(i, d) {
							var row = frappe.model.add_child(frm.doc, "Payment Component", "components");
							row.fees = d.name;
							row.fees_category = d.fees_category;
							row.total_amount = d.total_amount;
							row.received_amount = 0;
							row.outstanding = d.outstanding_amount;
						});
					}
					refresh_field("components");
					frm.trigger("calculate_total_amount");
				}
			});
		}
	},

	calculate_total_amount: function(frm, cdt, cdn) {
		total_amount = 0;
		received_amount = 0;
		outstanding = 0;
		for(var i=0;i<frm.doc.components.length;i++) {
			total_amount += flt(frm.doc.components[i].total_amount);
			received_amount += flt(frm.doc.components[i].received_amount);
			outstanding += flt(frm.doc.components[i].outstanding);
		}
		frm.set_value("total_amount", total_amount);
		frm.set_value("received_amount", received_amount);
		frm.set_value("outstanding", outstanding);
	}
});

frappe.ui.form.on("Payment Component", {
	received_amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.trigger("calculate_total_amount");
	}

});
