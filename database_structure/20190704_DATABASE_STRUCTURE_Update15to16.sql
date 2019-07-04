-- Update gestion de stock version 1.5 à version 1.6

--
-- Allow loan_to_user_id to be null, so it don't prevent loan to be created
--

ALTER TABLE `loan` CHANGE `loan_to_user_id` `loan_to_user_id` INT(11) NULL;