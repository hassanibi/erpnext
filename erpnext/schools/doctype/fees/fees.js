
cur_frm.add_fetch("student", "title", "student_name");

frappe.ui.form.on("Fees", {
	
	onload: function(frm){
		cur_frm.set_query("academic_term",function(){
			return{
				"filters":{
					"academic_year": (frm.doc.academic_year)
				}
			};
		});
		
		cur_frm.set_query("fee_structure",function(){
			return{
				"filters":{
					"academic_term": (frm.doc.academic_term)
				}
			};
		});
	},
	
	refresh: function(frm) {
		if (frm.doc.docstatus === 1 && (frm.doc.total_amount > frm.doc.paid_amount)) {
			frm.add_custom_button(__("Collect Fees"), function() {
				frappe.prompt({fieldtype:"Float", label: __("Amount Paid"), fieldname:"amt"},
					function(data) {
						frappe.call({
							method:"erpnext.schools.api.collect_fees",
							args: {
								"fees": frm.doc.name,
								"amt": data.amt
							},
							callback: function(r) {
								frm.doc.paid_amount = r.message
								frm.doc.outstanding_amount = frm.doc.total_amount - r.message
								frm.refresh()
							}
						});
					}, __("Enter Paid Amount"), __("Collect"));
			});
		}
	},
	
	program: function(frm) {
		if (frm.doc.program && frm.doc.academic_term) {
			frappe.call({
				method: "erpnext.schools.api.get_fee_structure",
				args: {
					"program": frm.doc.program,
					"academic_term": frm.doc.academic_term
				},
				callback: function(r) {
					if(r.message) {
						frm.set_value("fee_structure" ,r.message);
					}
				}
			});
		}
	},

	academic_term: function() {
		frappe.ui.form.trigger("Fees", "program");
	},

	fee_structure: function(frm) {
		frm.set_value("components" ,"");
		if (frm.doc.fee_structure) {
			frappe.call({
				method: "erpnext.schools.api.get_fee_components",
				args: {
					"fee_structure": frm.doc.fee_structure
				},
				callback: function(r) {
					if (r.message) {
						$.each(r.message, function(i, d) {
							var row = frappe.model.add_child(frm.doc, "Fee Component", "components");
							row.fees_category = d.fees_category;
							row.amount = d.amount;
						});
					}
					refresh_field("components");
					frm.trigger("calculate_total_amount");
					frm.trigger("update_fees_category");
				}
			});
		}
	},

	due_date: function(frm) {
		frm.trigger("update_fees_category");
    },
	
	calculate_total_amount: function(frm) {
		total_amount = 0;
		for(var i=0;i<frm.doc.components.length;i++) {
			total_amount += frm.doc.components[i].amount;
		}
		frm.set_value("total_amount", total_amount);
	},
	
	update_fees_category: function (frm) {
		var fees_category = [];
		for(var i=0;i<frm.doc.components.length;i++) {
			fees_category.push(frm.doc.components[i].fees_category);
		}
		frm.set_value("fees_category", fees_category.join(",") + (frm.doc.due_date ? " / " + frm.doc.due_date : ""));
    }
	
	
});

frappe.ui.form.on("Fee Component", {
	amount: function(frm) {
		frm.trigger("calculate_total_amount");
		frm.trigger("update_fees_category");
	},

	components_add: function (frm) {
		frm.trigger("update_fees_category");
    },

    components_remove: function (frm) {
		frm.trigger("update_fees_category");
    }
});
