<br>
<div class="container" style="margin-left: auto; margin-right: auto; padding: 30px">
    <?php if(isset($inventory_control) && !is_null($inventory_control)) { ?>
        <div class="row alert alert-danger">
            <?= $this->lang->line('delete_inventory_control_verify').$inventory_control->date; ?>?
        </div>
        <div class="row">
            <a href="<?= $inventory_control->inventory_control_id.'/1'; ?>" class="btn btn-danger"><?= lang('btn_delete'); ?></a>
            <a href="<?= base_url('item/inventory_controls/'.$item_id); ?>" class="btn"><?= lang('btn_cancel'); ?></a>
        </div>
    <?php } ?>
</div>
