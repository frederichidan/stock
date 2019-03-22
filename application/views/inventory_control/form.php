<form class="container" method="post">
	<h3>
	<?php
		echo $this->lang->line('field_inventory_control').' : ';
		echo $item->name.' ('.$item->inventory_number.')';
	?>
	</h3>

	<label for="controller">
		<?php echo $this->lang->line('field_inventory_controller').' : '; ?>
	</label>
	<input class="form-control" name="controller"
			value="<?= $controller->username; ?>" disabled />
	<br />

	<label for="date">
		<?php echo $this->lang->line('field_inventory_control_date').' : '; ?>
	</label>
	<input class="form-control" name="date" type="date"
			value="<?= $date; ?>" />
	<br />

	<label for="remarks">
		<?php echo $this->lang->line('field_remarks').' : '; ?>
	</label>
	<input class="form-control" name="remarks"
			value="<?= $remarks; ?>" autofocus />
	<br />

	<button type="submit" name="submit" class="btn btn-success">
		<?= lang('btn_save'); ?>
	</button><a class="btn btn-default" href="<?php
	if(isset($update) && $update) {
		echo base_url().'item/inventory_controls/'.$item->item_id;
	} else {
		echo base_url() . "item/view/" . $item->item_id;
	} ?>"><?= lang('btn_back_to_list'); ?></a>
</form>