





router.post('/features', features.add)
router.get('/features', features.list)
router.get('/features/:feature', features.findOne)
router.put('/features/:feature', features.update)
router.put('/features/:feature/enable', features.enable)
router.put('/features/:feature/disable', features.disable)

module.exports = {
  add,
  list,
  findOne,
  update,
  enable,
  disable
}
