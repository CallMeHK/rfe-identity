const pgConn = require('./pg-connection')

describe('pgConnection', () => {
  describe('#tryPgQuery', () => {
    let runPgQueryStub
    beforeEach(() => {
      runPgQueryStub = jest.spyOn(pgConn, 'runPgQuery').mockImplementation(() => Promise.resolve('test'))
    })
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('can be stubbed over', async () => {
      const result = await pgConn.tryPgQuery('asdf')
      expect(result).toBe('test')
    })
  })
})