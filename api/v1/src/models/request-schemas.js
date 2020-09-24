// const R = require('ramda')

// const TYPES = require('./identifier-types')
// const { STATES } = require('./identifier-assigners')

// const TYPES_CREATABLE = Object.values(TYPES)
// const REGEX_FEDERAL_TAX_ID = /^\d{11}$/
// const REGEX_ALPHANUMERIC = /^[A-Za-z0-9]+$/
// const REGEX_NUMERIC = /^[0-9]+$/
// const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// const isDefined = R.complement(R.not)
// const included = list => R.contains(R.__, list)
// const isCreatableType = included(TYPES_CREATABLE)
// const isState = included(STATES)
// const isExternalType = R.complement(isCreatableType)

// const isNumeric = R.test(REGEX_NUMERIC)

// const idValueValidators = {
//   [TYPES.FEDERAL_TAX_ID]: R.test(REGEX_FEDERAL_TAX_ID),
//   [TYPES.GENERAL_REGISTRY]: R.test(REGEX_ALPHANUMERIC),
//   [TYPES.PASSPORT]: R.test(REGEX_ALPHANUMERIC),
// }

// const idAssignerValidators = {
//   [TYPES.GENERAL_REGISTRY]: isState,
//   [TYPES.REGIONAL_MEDICAL_COUNCIL]: isState,
//   [TYPES.REGIONAL_NURSING_COUNCIL]: isState,
// }

// const dependantPropValidator = R.curry(
//   (prop, dependant, validators, object) =>
//     (validators[object[prop]] || R.T)(object[dependant])
// )

// const validateValueByType = dependantPropValidator('type', 'value', idValueValidators)

// const validateAssignerByType = dependantPropValidator('type', 'assigner', idAssignerValidators)

// const validateAssignerByExternalType = R.ifElse(
//   R.compose(isExternalType, R.prop('type')),
//   R.compose(Boolean, R.prop('assigner')),
//   R.T
// )

// const isCreatableIdentifier = R.allPass([
//   R.propSatisfies(isCreatableType, 'type'),
//   R.propSatisfies(isDefined, 'value'),
//   validateValueByType,
//   validateAssignerByType,
// ])

// const isUUID = R.test(REGEX_UUID)

// const isAddableIdentifier = R.allPass([
//   R.propSatisfies(
//     R.allPass([
//       R.is(String),
//       R.complement(R.isEmpty),
//     ]),
//     'type'
//   ),
//   R.anyPass([
//     isCreatableIdentifier,
//     validateAssignerByExternalType,
//   ]),
// ])

// const personCreateWithIdentifiers = {
//   identifiers: {
//     in: 'body',
//     isArrayOf: {
//       options: [isCreatableIdentifier],
//     },
//   },
// }

// const listAllMpis = {
//   page: {
//     in: 'query',
//     notEmpty: true,
//     assert: {
//       options: [isNumeric],
//     },
//   },
//   pageSize: {
//     in: 'query',
//     notEmpty: true,
//     assert: {
//       options: [isNumeric],
//     },
//   },
// }

// const identifierQuery = {
//   type: {
//     in: 'query',
//     notEmpty: true,
//     assert: {
//       options: [isCreatableType],
//     },
//   },
//   value: {
//     in: 'query',
//     notEmpty: true,
//   },
// }

// const identifierList = {
//   mpi: {
//     in: 'params',
//     assert: {
//       options: [isUUID],
//     },
//   },
// }

// const identifierAddToPerson = {
//   mpi: {
//     in: 'params',
//     assert: {
//       options: [isUUID],
//     },
//   },
//   identifiers: {
//     in: 'body',
//     isArrayOf: {
//       options: [isAddableIdentifier],
//     },
//   },
// }

// module.exports = {
//   personCreateWithIdentifiers,
//   identifierQuery,
//   identifierList,
//   identifierAddToPerson,
//   listAllMpis,
// }
