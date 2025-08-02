-- create function func_inc_var_session
CREATE OR REPLACE FUNCTION func_inc_var_session() RETURNS integer AS $$
        BEGIN
               RETURN i + 1;
        END;
$$ LANGUAGE plpgsql;


-- Dumping structure for procedure customer_txn_vw
CREATE OR REPLACE VIEW "customer_txn_vw" AS
SELECT   func_inc_var_session() as id, customer_id,txn_date,credit,debit,remark 
   FROM (
	SELECT customer_id,so.created_time as txn_date,NULL AS credit, grand_total AS debit,uid AS remark FROM sales_order so 
	
	UNION     
	     
	SELECT customer_id,so.created_time as txn_date,paid_amount AS credit, NULL AS debit,pt.name AS remark FROM sales_order so 
	INNER JOIN payment_type pt ON pt.id=so.payment_type_id
	
	UNION 
	
	SELECT customer_id,ct.created_time as txn_date, credit, debit, remark FROM customer_txn ct
	
) res 
ORDER BY txn_date ASC;


-- Dumping structure for procedure customer_ledger
CREATE OR REPLACE VIEW "customer_ledger" AS
SELECT id,
customer_id, txn_date
,credit AS credit,debit AS debit
  
-- (sum(ifnull(credit,0)) OVER (PARTITION BY customer_id ORDER BY txn_date,id )  - sum(ifnull(debit,0)) OVER (PARTITION BY customer_id ORDER BY txn_date,id ) ) AS balance,remark AS remark 
from customer_txn_vw 
WHERE customer_id =1
order by txn_date;


