
INSERT INTO "catalog_stock_config" ("id", "qty_min", "exp_month", "created_by", "created_time") VALUES 
	(1, 3, 3, 'system', current_timestamp);


INSERT INTO "repair_problem_data" ("id", "type", "name", "created_by", "created_time") VALUES
	(1, 'fit', 'Feedback Fit', 'system', current_timestamp),
	(2, 'fit', 'Loose', 'system', current_timestamp),
	(3, 'fit', 'Wrong Canal Direction', 'system', current_timestamp),
	(4, 'fit', 'Canal Too Short', 'system', current_timestamp),
	(5, 'fit', 'Canal Too Long', 'system', current_timestamp),
	(6, 'fit', 'Tight Helix', 'system', current_timestamp),
	(7, 'fit', 'Tight Canal', 'system', current_timestamp),
	(8, 'fit', 'Tight All Over', 'system', current_timestamp),
	(9, 'fit', 'Tight Anti Tragus', 'system', current_timestamp),
	(10, 'fit', 'Protrudes', 'system', current_timestamp),
	(11, 'fit', 'WorksOut Of Year', 'system', current_timestamp),
	(12, 'condition', 'Dead', 'system', current_timestamp),
	(13, 'condition', 'VC Broken', 'system', current_timestamp),
	(14, 'condition', 'Wheel Of VC', 'system', current_timestamp),
	(15, 'condition', 'Loose VC', 'system', current_timestamp),
	(16, 'condition', 'Tight VC', 'system', current_timestamp),
	(17, 'condition', 'Poor Tapper on VC', 'system', current_timestamp),
	(18, 'condition', 'VC Intermittent', 'system', current_timestamp),
	(19, 'condition', 'Internal Feedback', 'system', current_timestamp),
	(20, 'condition', 'Broken Switch', 'system', current_timestamp),
	(21, 'condition', 'Damaged Cross Cord', 'system', current_timestamp),
	(22, 'condition', 'Dead Telecoil', 'system', current_timestamp),
	(23, 'condition', 'Put Pushed in', 'system', current_timestamp),
	(24, 'condition', 'Plugged With Wax', 'system', current_timestamp),
	(25, 'condition', 'Water Damage', 'system', current_timestamp),
	(26, 'condition', 'Fades', 'system', current_timestamp),
	(27, 'condition', 'Accesory Missing', 'system', current_timestamp),
	(28, 'condition', 'Remove Accesory', 'system', current_timestamp),
	(29, 'condition', 'Transducer Broken', 'system', current_timestamp),
	(30, 'condition', 'Recieverpushedin', 'system', current_timestamp),
	(31, 'condition', 'TransducerSealloose', 'system', current_timestamp),
	(32, 'caseDeffect', 'Cracked Shell', 'system', current_timestamp),
	(33, 'caseDeffect', 'Hole in Shell', 'system', current_timestamp),
	(34, 'caseDeffect', 'Broken Battery Drawer', 'system', current_timestamp),
	(35, 'caseDeffect', 'BD Won''t Close Compeletely', 'system', current_timestamp),
	(36, 'caseDeffect', 'Hinge Pin Broken', 'system', current_timestamp),
	(37, 'caseDeffect', 'Battery Stuck in Aid', 'system', current_timestamp),
	(38, 'caseDeffect', 'FacePlate Off', 'system', current_timestamp),
	(39, 'caseDeffect', 'Hole in Vent', 'system', current_timestamp),
	(40, 'caseDeffect', 'Allergy Problem', 'system', current_timestamp),
	(41, 'response', 'No Output', 'system', current_timestamp),
	(42, 'response', 'Weak', 'system', current_timestamp),
	(43, 'response', 'Disorted', 'system', current_timestamp),
	(44, 'response', 'Noisy', 'system', current_timestamp),
	(45, 'response', 'Tiny', 'system', current_timestamp),
	(46, 'response', 'Too Strong', 'system', current_timestamp),
	(47, 'response', 'Too weak', 'system', current_timestamp),
	(48, 'response', 'Barrel Sound', 'system', current_timestamp),
	(49, 'response', 'Circuit Noise', 'system', current_timestamp),
	(50, 'response', 'Static Noise', 'system', current_timestamp),
	(51, 'response', 'Booming', 'system', current_timestamp),
	(52, 'response', 'Others', 'system', current_timestamp);
	


INSERT INTO "address_type" ("id", "name", "created_by", "created_time", "modified_by", "modified_time") VALUES
	(1, 'home', 'system', current_timestamp, NULL, NULL),
	(2, 'office','system', current_timestamp, NULL, NULL);

