<div class="container">
  <?php if(isset($controller_id) && isset($date) && isset($remarks)) { ?>
    <div class="row" >
      <?= lang('admin_delete_inventory_control_verify')." ?"; ?>
    </div>
    <div class="btn-group row" >
      <a href="<?= base_url().uri_string()."/confirmed";?>" class="btn btn-danger btn-lg"><?= lang('text_yes'); ?></a>
      <a href="<?= base_url()."item/inventory_controls/$item_id";?>" class="btn btn-lg"><?= lang('text_no'); ?></a>
    </div>
  <?php } ?>
</div>
