/**
 * Error code catalogue
 *
 * @module utils/error
 * @name catalogue
 */
const catalogue = {
  FORBIDDEN: 'FORBIDDEN',
  INVALID_REQUEST: 'INVALID_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL: 'INTERNAL',
  DECODE_FAILURE: 'DECODE_FAILURE',
  ID_CONFLICT: 'ID_CONFLICT',
}

/**
 * Custom error class representing a managed error i.e. the result of capturing a runtime error and handling it.
 *
 * @module utils/error
 * @name ManagedError
 * @class
 */
class ManagedError extends Error {
  /**
   * @constructor
   * @param {string} code error code
   * @param {string} message error message
   * @see {@link utils/error:catalogue}
   */
  constructor (code, message = '', { body = {}, status = 500 } = {}) {
    super(message || code)
    this._code = code
    this._status = status
    this._body = body
    Error.captureStackTrace(this, ManagedError)
  }
  get code () {
    return this._code
  }
  get status () {
    return this._status
  }
  get body () {
    return this._body
  }
}

/**
 * Error code-to-response map.
 * Maps an error code to an http response.
 *
 * @module utils/error
 * @name response
 */
const response = {
  [catalogue.FORBIDDEN]: {
    status: 403,
    body: {
      statusCode: 403,
      error: catalogue.FORBIDDEN,
      message: 'Unauthorized access to resource',
    },
  },
  [catalogue.INVALID_REQUEST]: {
    status: 400,
    body: {
      statusCode: 400,
      error: catalogue.INVALID_REQUEST,
      message: 'Invalid request parameters',
    },
  },
  [catalogue.NOT_FOUND]: {
    status: 404,
    body: {
      statusCode: 404,
      error: catalogue.NOT_FOUND,
      message: 'Resource not found',
    },
  },
  [catalogue.INTERNAL]: {
    status: 500,
    body: {
      statusCode: 500,
      error: catalogue.INTERNAL,
      message: 'Internal server error',
    },
  },
  [catalogue.DECODE_FAILURE]: {
    status: 400,
    body: {
      statusCode: 400,
      error: catalogue.DECODE_FAILURE,
      message: 'Decode message content failure',
    },
  },
  [catalogue.ID_CONFLICT]: {
    status: 409,
    body: {
      statusCode: 409,
      error: catalogue.ID_CONFLICT,
      message: 'Identifiers are already associated to a patient',
    },
  },
}

/**
 * Rejects Promise with a ManagedError instance
 * @module utils/error
 * @name rejectWithManaged
 * @version v1
 * @async
 * @param {string} code error code
 * @returns {Promise<ManagedError>} rejected Promise
 * @throws {ManagedError}
 */
const rejectWithManaged = (code, message) => Promise.reject(new ManagedError(code, message))

module.exports = {
  catalogue,
  response,
  ManagedError,
  rejectWithManaged,
}
