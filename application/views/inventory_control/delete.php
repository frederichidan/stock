<br>
<div class="container" style="margin-left: auto; margin-right: auto; width: 500px; padding: 30px">
    <?php if(isset($inventory_control) && !is_null($inventory_control)) { ?>
        <div class="row">
            Êtes-vous sûr de vouloir supprimer le contrôle n° <?= $inventory_control->inventory_control_id; ?>?
        </div>
        <div class="row">
            <a href="<?= $inventory_control->inventory_control_id.'/1'; ?>" class="btn btn-danger"><?= lang('btn_delete'); ?></a>
            <a href="<?= base_url('item/inventory_controls/'.$item_id); ?>" class="btn"><?= lang('btn_cancel'); ?></a>
        </div>
    <?php } ?>
</div>
