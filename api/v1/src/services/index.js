const repository = require('../models/repositories')
const handler = require('./handler')

const list = repo => ({ page = 0, pageSize = 10, ...where }) => {
  const offset = page * pageSize
  const limit = pageSize
  return repo.list({where, limit, offset})
}

const add = repo => item =>
  repo.findOne(item.name)
    .then(() => repo.update((item.name, { ...item })))
    .catch(() => repo.add(item))

const feature = {
  list: list(repository.feature),
  findOne: repository.feature.findOne,
  update: repository.feature.update,
  add: add(repository.feature),
  disable: repository.feature.disable,
  enable: repository.feature.enable,
}

const beta = {
  list: list(repository.beta),
  findOne: repository.beta.findOne,
  add: add(repository.beta),
  disable: repository.beta.disable,
  enable: repository.beta.enable,
}

const tag = {
  list: list(repository.tag),
  findOne: repository.tag.findOne,
  add: repository.tag.addFeatureTag,
  disable: repository.tag.disable,
  enable: repository.tag.enable,
}

module.exports = {
  feature,
  tag,
  beta,
  evaluate: handler.handle,
}
