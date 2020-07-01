const R = require('ramda')
const service = require('../../src/services')
const { catalogue: errors } = require('../../src/models/error')
const config = require('../../../../config')

const VERSION = 'v1'

describe(`(${VERSION}) services test`, () => {
  describe('#createPersonWithIdentifiers test', () => {
    context('When attempting concurrent creation of the same identifiers', () => {
      it('All but one of the transactions fail', async () => {
        const randomInt = () => Math.trunc(Math.random() * 10)
        const identifiers = [{
          type: 'FEDERAL_TAX_ID',
          value: `${randomInt()}`.repeat(11),
        }]

        const promises = R.times(
          () => service.createPersonWithIdentifiers(identifiers),
          config.database.pool.max + 1
        )

        const results = await Promise.allSettled(promises)

        const failedTransactions = results.length - 1
        const rejected = results.filter(R.propEq('status', 'rejected'))
        expect(rejected).to.have.lengthOf(failedTransactions)
        expect(rejected.every(R.pathEq(['reason', 'code'], errors.ID_CONFLICT))).to.be.true
      })
    })
    context('When attempting concurrent creation of different identifiers', () => {
      it('None of the transactions fails', async () => {
        const randomInt = () => Math.trunc(Math.random() * 1000)
        const getIdentifiers = () => [{
          type: 'FEDERAL_TAX_ID',
          value: `${randomInt()}`.padStart(11, 0),
        }]

        const promises = R.times(
          () => {
            const identifiers = getIdentifiers()
            return service.createPersonWithIdentifiers(identifiers)
          },
          config.database.pool.max
        )

        const results = await Promise.allSettled(promises)

        const rejected = results.filter(R.propEq('status', 'rejected'))
        expect(rejected).to.be.empty
      })
    })
  })
})
