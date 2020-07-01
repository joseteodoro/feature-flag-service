const R = require('ramda')
const db = require('../../../../db')
const personRepository = require('../models/repositories/person')
const identifierRepository = require('../models/repositories/identifier')
const { catalogue, rejectWithManaged } = require('../models/error')
const { resolve, awaitAll, reject } = require('../utils')
const logger = require('../../../../config/logger')

const isDefined = R.complement(R.not)
const hasDefined = R.any(isDefined)
const raiseError = (code, message) => () => rejectWithManaged(code, message)
const raiseConflictError = raiseError(catalogue.ID_CONFLICT)
const rejectManaged = R.curry((code, message) =>
  rejectWithManaged(code, message)
)

const validateItemsNotDefined = R.ifElse(
  hasDefined,
  raiseConflictError,
  resolve
)

const findIdentifier = ({ type, value }) =>
  identifierRepository.findOne({ type, value })

const findIdentifiers = R.pipe(
  R.map(findIdentifier),
  awaitAll
)

const createPerson = () => personRepository.add()

const associatePersonToIdentifier = R.curry((id, person) =>
  R.assoc('person_mpi', person.mpi, id)
)

const associatePersonToIdentifiers = R.curry(
  (ids, person) => ({
    identifiers: ids.map(associatePersonToIdentifier(R.__, person)),
    person,
  })
)

const createIdentifiers = identifiers => identifierRepository.bulkAdd(identifiers)

const addIdentifiersToPerson =
  ({ identifiers, person }) =>
    createIdentifiers(identifiers)
      .then(saved => ({
        identifiers: saved,
        person,
      }))

const createPersonAndAddIds = ids => () =>
  createPerson()
    .then(associatePersonToIdentifiers(ids))
    .then(addIdentifiersToPerson)

const logConstraintError = R.curry((ids, error) =>
  logger.error(error, `Constraint violation when creating ids ${JSON.stringify(ids)}`)
)

const { CONSTRAINT_VIOLATION } = db.ERROR

const handleConstraintViolation = ids => R.ifElse(
  R.allPass([
    R.propEq('name', CONSTRAINT_VIOLATION.name),
    R.pathEq(['original', 'code'], CONSTRAINT_VIOLATION.code),
  ]),
  R.pipe(
    R.tap(logConstraintError(ids)),
    R.prop('message'),
    rejectManaged(catalogue.ID_CONFLICT)
  ),
  reject
)

const createPersonWithIdentifiers = ids =>
  db.transaction(
    () =>
      findIdentifiers(ids)
        .then(validateItemsNotDefined)
        .then(createPersonAndAddIds(ids))
        .catch(handleConstraintViolation(ids))
  )

const handleIdsNotFound = R.when(
  R.anyPass([ R.not, R.isEmpty ]),
  raiseError(catalogue.NOT_FOUND, 'Identifiers not found')
)

const listIdentifiers = R.pipe(
  R.objOf('person_mpi'),
  identifierRepository.list,
  R.then(handleIdsNotFound)
)

const idsNotEqual = R.curry(
  (id1, id2) => id1.type !== id2.type &&
    id1.value !== id2.value &&
    id1.assigner !== id2.assigner &&
    id1.system !== id2.system
)

const getPerson = R.pipe(
  personRepository.get,
  R.then(R.when(
    R.not,
    raiseError(catalogue.NOT_FOUND, 'Person record not found')
  ))
)

const filterNewIdsOnly = identifiers => associatedIdentifiers =>
  identifiers.filter(newId => associatedIdentifiers.every(idsNotEqual(newId)))

const isNonEmptyList = R.allPass([
  Array.isArray,
  R.propSatisfies(R.gt(R.__, 0), 'length'),
])

const addIdentifiers = (mpi, identifiers) =>
  db.transaction(() =>
    getPerson(mpi)
      .then(() => listIdentifiers(mpi))
      .then(filterNewIdsOnly(identifiers))
      .then(R.map(R.assoc('person_mpi', mpi)))
      .then(R.when(
        isNonEmptyList,
        createIdentifiers
      ))
  )

const findAllMpis = ({ page, pageSize }) => {
  const offset = page * pageSize
  const limit = pageSize
  const query = {}
  return personRepository.list(query, {
    limit,
    offset,
  })
}

module.exports = {
  createPersonWithIdentifiers,
  findIdentifier,
  listIdentifiers,
  addIdentifiers,
  findAllMpis,
}
